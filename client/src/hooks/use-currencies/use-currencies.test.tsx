import { useAllCurrencies } from "./use-currencies";
import currenciesList from "mocks/responses/currencies";
import { renderHook, waitFor } from "test-utils";
import { wrapper } from "test-utils/render";

describe("useCurrencies Hook tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Gets a list of currencies", async () => {
    const { result } = renderHook(() => useAllCurrencies(), { wrapper });
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
