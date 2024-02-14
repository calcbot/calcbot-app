import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Allotment } from 'allotment';
import "allotment/dist/style.css";
import { sleep, useGlobalStore } from '#src/utils';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parser } from 'mathjs';
import * as API from 'aws-amplify/api';
import { useQuery } from '@tanstack/react-query';
const apiClient = API.generateClient();
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 7);

export const Dashboard = () => {
    const { id } = useParams();
    const sizes = useGlobalStore(state => state.sizes);
    const setSizes = useGlobalStore(state => state.setSizes);
    const panesRef = useRef(null);
    const math = parser();
    const navigate = useNavigate();
    const [refetchInterval, setRefetchInterval] = useState(0);

    useEffect(() => {
        const async = async () => {
            outputEditor?.commands.setContent('');
            const rawId = nanoid();
            const id = `${rawId.slice(0, 3)}-${rawId.slice(3, 7)}`;
            await apiClient.graphql({
                query: `mutation ($id: String) {
                        insert_calcs_one(object: {id: $id}) { id }
                    }`,
                variables: { id }
            });
            navigate(`/${id}`);
        }
        !id && async();
    }, [id])

    const performCalcs = (data) => {
        const rows = data.split('\n');
        const answers = [];
        for (const row of rows) {
            const isCurrency = row.includes('$');
            try {
                const answer = math.evaluate(row.replaceAll('$', '').replaceAll(',', ''));
                if (!answer?.toString()?.startsWith('function ')) {
                    answers.push(isCurrency ? '$' + answer?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : answer ?? '');
                }
                else {
                    answers.push(' ');
                }
            }
            catch (err) {
                try {
                    const answer = math.evaluate(row.split('=').reverse().join('=').replaceAll('$', '').replaceAll(',', ''));
                    if (!answer?.toString()?.startsWith('function ')) {
                        answers.push(isCurrency ? '$' + answer?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : answer ?? '');
                    }
                }
                catch (err) {
                    answers.push(' ');
                }
            }
        }
        outputEditor?.commands.setContent(answers.filter(answer => answer).map(answer => `<p>${answer}</p>`).join(''));
    }

    const outputEditor = useEditor({
        editable: false,
        extensions: [StarterKit, Underline, Link],
    });

    const inputEditor = useEditor({
        extensions: [StarterKit, Underline, Link, Placeholder.configure({ placeholder: 'Start typing to calculate...' })],
        onUpdate: async ({ editor }) => {
            setRefetchInterval(0);
            const data = editor.getHTML();
            await apiClient.graphql({
                query: `mutation($id: String!, $content: String) { update_calcs_by_pk(pk_columns: {id: $id}, _set: {content: $content}) { id } }`,
                variables: { id, content: data },
            });
            performCalcs(data.replaceAll('<p>', '').replaceAll('</p>', '\n\n'));
            await sleep(1000);
            setRefetchInterval(1000);
        }
    });

    const { data: content } = useQuery({
        queryKey: ['content', id, inputEditor?.isEditable],
        queryFn: async () => {
            const data = (await apiClient.graphql({ query: `{ calcs_by_pk(id: "${id}") { content } }` }))?.data?.calcs_by_pk?.content;
            const { from, to } = inputEditor?.state.selection;
            inputEditor?.commands.setContent(data, false);
            inputEditor?.commands.setTextSelection({ from, to });
            performCalcs(data.replaceAll('<p>', '').replaceAll('</p>', '\n\n'));
            return data;
        },
        refetchInterval,
    });

    return (
        <Allotment ref={panesRef} onChange={(sizes) => setSizes(sizes)} minSize={100} defaultSizes={sizes}>
            <div className='flex h-full w-full'>
                <EditorContent className='p-2 w-full' editor={inputEditor} content={content} />
            </div>
            <div className='flex h-full w-full'>
                <EditorContent className='p-2 w-full' editor={outputEditor} />
            </div>
        </Allotment>
    )
}