/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { ReactElement } from "react-markdown/lib/react-markdown";

interface IWrapperProps {
  children: ReactElement;
}

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {},
});

/**
 * Render a component with React Router support
 * @param {*} ui
 * @param {*} param1
 */
function renderWithRouter(
  ui: ReactElement,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},
) {
  function Wrapper({ children }: IWrapperProps) {
    return <MemoryRouter>{children}</MemoryRouter>;
  }
  return {
    ...render(ui, { wrapper: Wrapper }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function renderWithRouterAndQueryClient(
  ui: ReactElement,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},
) {
  function Wrapper({ children }: IWrapperProps) {
    return (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  return {
    ...render(ui, { wrapper: Wrapper }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { renderWithRouter, renderWithRouterAndQueryClient };
