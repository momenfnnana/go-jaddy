import {QueryClient} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
