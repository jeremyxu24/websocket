import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Disable refetch on window focus globally
        },
    },
});

export { queryClient, QueryClientProvider };
