import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18n";

const queryClient = new QueryClient();

type WrapperProps = {
  children: React.ReactNode;
};

export const wrapper = ({ children }: WrapperProps) => (
  <I18nextProvider i18n={i18n}>
    <MemoryRouter initialEntries={["/"]}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  </I18nextProvider>
);

// re-export everything
export * from "@testing-library/react";

// override render method

export default wrapper;
