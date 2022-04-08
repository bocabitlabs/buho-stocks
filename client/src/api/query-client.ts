import { QueryCache, QueryClient } from "react-query";
import { toast } from "react-toastify";

const queryCache = new QueryCache({
  onError: (error: any) => {
    if (error.request.status === 401) {
      localStorage.removeItem("token");
      toast.error("Your session has expired. Please log in again.", {
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
      });
    }
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 60 seconds
    },
  },
  queryCache,
});

export default queryClient;
