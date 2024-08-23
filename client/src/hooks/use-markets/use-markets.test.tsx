import { MRT_PaginationState } from "mantine-react-table";
import { useMarkets } from "./use-markets";
import {
  page1Markets,
  page2Markets,
} from "mocks/responses/markets/paginatedMarkets";
import { renderHook, waitFor } from "test-utils";
import { wrapper } from "test-utils/render";

describe("useMarkets Hook tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Gets a list of markets first page", async () => {
    const pagination: MRT_PaginationState = {
      pageIndex: 0,
      pageSize: 4,
    };

    const { result } = renderHook(() => useMarkets({ pagination }), {
      wrapper,
    });
    await waitFor(() => result.current.isSuccess);

    await waitFor(() => {
      const marketsData = result.current.data;
      expect(marketsData?.results.length).toEqual(page1Markets.results.length);
    });

    await waitFor(() => {
      const marketsData = result.current.data;
      expect(marketsData?.count).toBeDefined();
    });
    await waitFor(() => {
      const marketsData = result.current.data;
      expect(marketsData?.results).toBeDefined();
    });

    await waitFor(() => {
      const marketsData = result.current.data;

      expect(marketsData?.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "AMS",
            region: "nl",
            timezone: "Europe/Amsterdam",
            id: 5,
          }),
          expect.objectContaining({
            timezone: "Europe/Madrid",
            name: "BME",
            region: "es",
          }),
          expect.objectContaining({
            openTime: "08:00:00",
            closeTime: "16:30:00",
            region: "gb",
          }),
        ]),
      );
    });
  });

  it("Gets a list of markets second page", async () => {
    const pagination: MRT_PaginationState = {
      pageIndex: 1,
      pageSize: 4,
    };

    const { result } = renderHook(() => useMarkets({ pagination }), {
      wrapper,
    });
    await waitFor(() => result.current.isSuccess);

    await waitFor(() => {
      const marketsData = result.current.data;
      expect(marketsData?.results.length).toEqual(page2Markets.results.length);
    });

    await waitFor(() => {
      const marketsData = result.current.data;
      expect(marketsData?.count).toBeDefined();
    });
    await waitFor(() => {
      const marketsData = result.current.data;
      expect(marketsData?.results).toBeDefined();
    });

    await waitFor(() => {
      const marketsData = result.current.data;

      expect(marketsData?.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "NYSE", region: "us" }),
          expect.objectContaining({ timezone: "CET", region: "de" }),
        ]),
      );
    });
  });
});
