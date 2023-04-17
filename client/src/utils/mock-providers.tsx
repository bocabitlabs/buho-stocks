/* eslint-disable import/no-extraneous-dependencies */
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import i18n from "i18n";

const queryClient = new QueryClient();

export const wrapper = ({ children }: any) => (
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
