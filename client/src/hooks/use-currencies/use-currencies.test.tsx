import React from "react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useCurrencies } from "./use-currencies";
import currenciesList from "mocks/responses/currencies";

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {},
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function wrapper({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useCurrencies Hook tests", () => {
  it("Gets a list of currencies", async () => {
    const { result } = renderHook(() => useCurrencies(), { wrapper });
    await waitFor(() => result.current.isSuccess);

    await waitFor(() => {
      const currencies = result.current.data;
      expect(currencies?.length).toEqual(currenciesList.length);
    });
    await waitFor(() => {
      const currencies = result.current.data;
      expect(currencies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Canadian dollar" }),
          expect.objectContaining({ symbol: "$" }),
        ]),
      );
    });
  });
});
