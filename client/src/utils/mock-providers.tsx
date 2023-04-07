/* eslint-disable import/no-extraneous-dependencies */
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const queryClient = new QueryClient();

export const wrapper = ({ children }: any) => (
  <MemoryRouter initialEntries={["/"]}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </MemoryRouter>
);

// re-export everything
export * from "@testing-library/react";

// override render method

export default wrapper;
