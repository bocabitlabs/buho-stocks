import { useAllMarkets } from "./use-markets";
import allMarkets from "mocks/responses/markets/allMarkets";
import { renderHook, waitFor } from "test-utils";
import { wrapper } from "test-utils/render";

describe("useAllMarkets Hook tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Gets a list of markets", async () => {
    const { result } = renderHook(() => useAllMarkets(), { wrapper });
    await waitFor(() => result.current.isSuccess);

    await waitFor(() => {
      const currencies = result.current.data;
      expect(currencies?.length).toEqual(allMarkets.length);
    });
    await waitFor(() => {
      const currencies = result.current.data;
      expect(currencies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "AMS" }),
          expect.objectContaining({ region: "de" }),
          expect.objectContaining({ timezone: "CET" }),
          expect.objectContaining({ openTime: "09:00:00" }),
          expect.objectContaining({ closeTime: "17:30:00" }),
          expect.objectContaining({
            dateCreated: "2022-01-04T13:19:29.197299Z",
          }),
          expect.objectContaining({
            lastUpdated: "2022-03-19T21:15:40.616060Z",
          }),
          expect.objectContaining({ id: 3 }),
        ]),
      );
    });
  });
});
