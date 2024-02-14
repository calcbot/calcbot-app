import { useGlobalStore } from "#src/utils";
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Loader } from ".";
import { FaCalculator } from "react-icons/fa6";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AiOutlineMenu } from "react-icons/ai";

export const Navigation = () => {
    const darkMode = useGlobalStore(state => state.darkMode);
    const setDarkMode = useGlobalStore(state => state.setDarkMode);
    const loading = useGlobalStore(state => state.loading);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'), [darkMode]);

    const menuClass = `px-2 py-1 select-none hover:opacity-50`
    return (
        <div className={`h-[calc(100vh_-_25px)] text-text bg-background border-border`}>
            {loading && <Loader />}
            <div className='w-full bg-card p-1 border-b-[1px] border-border h-[25px] flex flex-row justify-between items-center'>
                <div className='flex flex-row items-center gap-1'>
                    <FaCalculator />
                    <a className='text-text hover:opacity-50' target='_blank' href={`https://calc.bot/${id}`}>calc.bot/{id}</a>
                </div>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <AiOutlineMenu className='hover:opacity-50' />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className='bg-card text-text border-[1px] border-border min-w-[100px]'>
                            <DropdownMenu.Item
                                className={`${menuClass}`}
                                onSelect={() => { navigate('/') }}
                            >
                                New
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                className={`${menuClass}`}
                                onSelect={() => { navigate('/') }}
                            >
                                Open
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                className={`${menuClass}`}
                                onSelect={() => { navigate('/') }}
                            >
                                Save as
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                className={`${menuClass}`}
                                onSelect={() => { setDarkMode(!darkMode) }}
                            >
                                {darkMode ? 'Light mode ☀︎' : 'Dark mode ☾'}
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator>
                                <div className='w-full h-[1px] bg-border' />
                            </DropdownMenu.Separator>
                            <DropdownMenu.Item
                                className={`${menuClass}`}
                                onSelect={() => { navigate('/') }}
                            >
                                Log in
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                className={`${menuClass}`}
                                onSelect={() => { navigate('/') }}
                            >
                                Sign up
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator>
                                <div className='w-full h-[1px] bg-border' />
                            </DropdownMenu.Separator>
                            <DropdownMenu.Item
                                className={`${menuClass}`}
                                onSelect={() => { navigate('/') }}
                            >
                                About
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
            <Outlet />
        </div>
    )
}