import { I18nextProvider } from "react-i18next";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as testingLibraryRender } from "@testing-library/react";
import i18n from "i18n";
import { theme } from "theme";

const queryClient = new QueryClient();

export const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider theme={theme}>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  </MantineProvider>
);

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper,
  });
}
