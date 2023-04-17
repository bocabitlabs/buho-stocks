import { setLogger } from "react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useCurrencies } from "./use-currencies";
import currenciesList from "mocks/responses/currencies";
import { wrapper } from "utils/mock-providers";

describe("useCurrencies Hook tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  setLogger({
    log: console.log,
    warn: console.warn,
    error: () => {},
  });

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
