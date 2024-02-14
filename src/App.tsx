import { Amplify } from "aws-amplify";
import * as Auth from "aws-amplify/auth"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Compose, Dashboard, Forgot, Home, Login, Note, Reset, Signup, Welcome } from '#src/routes';
import { Navigation } from '#src/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostHogProvider } from 'posthog-js/react'
const queryClient = new QueryClient();

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USERPOOLID,
      userPoolClientId: import.meta.env.VITE_USERPOOLWEBCLIENTID,
    },
  },
  API: {
    GraphQL: {
      endpoint: `${import.meta.env.VITE_GRAPHQL_URL}/v1/graphql`,
      defaultAuthMode: 'none',
    },
    REST: {
      public: {
        endpoint: `${import.meta.env.VITE_API_URL}/public`,
      },
      auth: {
        endpoint: `${import.meta.env.VITE_API_URL}/auth`,
      },
    },
  },
}, {
  API: {
    GraphQL: {
      headers: async () => {
        const jwtToken = (await Auth.fetchAuthSession()).tokens?.idToken?.toString();
        return { ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }) };
      },
    },
    REST: {
      headers: async ({ apiName }) => apiName === 'auth' ? { Authorization: `Bearer ${(await Auth.fetchAuthSession()).tokens?.idToken?.toString()}` } : { 'X-Api-Key': '1' }
    }
  }
});

const router = createBrowserRouter([
  {
    path: "",
    element: <Navigation />,
    children: [
      { path: ":id?", element: <Dashboard /> },
    ]
  },
]);

export const App = () => {
  return (
    <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_KEY} options={{ api_host: 'https://us.posthog.com' }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PostHogProvider>
  )
}