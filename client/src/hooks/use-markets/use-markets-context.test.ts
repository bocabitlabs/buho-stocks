import { renderHook, act } from "@testing-library/react-hooks";
import { useMarketsContext } from "./use-markets-context";
import { IMarket, IMarketFormFields } from "types/market";

const marketFormProps: IMarketFormFields = {
  name: "NYSE",
  color: "color1",
  region: "USA",
  openTime: "14:00",
  closeTime: "20:00",
  description: "description"
};

const returnAllExample: IMarket[] = [
  {
    id: 1,
    name: "NYSE",
    color: "color1",
    region: "USA",
    openTime: "14:00",
    closeTime: "20:00",
    description: "description",
    dateCreated: "2020-01-01",
    lastUpdated: "2020-01-01"
  },
  {
    id: 2,
    name: "NASDAQ",
    color: "color1",
    region: "USA",
    openTime: "14:00",
    closeTime: "20:00",
    description: "description",
    dateCreated: "2020-01-01",
    lastUpdated: "2020-01-01"
  }
];

jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => ({}))
      }
    };
  }
}));

jest.mock("react-router", () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}));

// jest.mock("services/markets/markets-service", () => ({
//   exportAll: () => returnAllExample,
//   getAll: async () => {console.log("getAll mock");return returnAllExample},
//   getById: () => returnAllExample[1],
//   getByName: () => returnAllExample[2],
//   create: () => ({ changes: 1 }),
//   deleteById: () => ({ changes: 1 }),
//   update: () => ({ changes: 1 })
// }));
jest.mock("services/markets/markets-service");

describe("useMarketsContext tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("verifies that is loading is false when the component loads", () => {
    const { result } = renderHook(() => useMarketsContext());
    expect(result.current.isLoading).toBe(false);
  });

  // it("verifies that it loads with 2 markets", () => {
  //   const { result } = renderHook(() => useMarketsContext());
  //   expect(result.current.markets.length).toBe(2);
  // });

  // it("verifies that it loads with no market", () => {
  //   const { result } = renderHook(() => useMarketsContext());
  //   expect(result.current.market).toBe(null);
  // });

  it("verifies that getAll returns the markets", async () => {
    const getAllMocked = jest.fn();
    getAllMocked.mockReturnValue({ result: returnAllExample });
    MarketsService.prototype.getAll = getAllMocked;
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());

    act(() => {
      result.current.getAll();
    });
    await waitForNextUpdate();
    expect(result.current.markets).toBe(returnAllExample);
  });

  it("verifies that getById returns the market 1", async () => {
    const getByIdMocked = jest.fn();
    getByIdMocked.mockReturnValue({ result: returnAllExample[0] });
    MarketsService.prototype.getById = getByIdMocked;
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());
    act(() => {
      result.current.getById(1);
    });
    await waitForNextUpdate();
    expect(result.current.market).toBe(returnAllExample[0]);
  });

  it("creates a market and returns changes", async () => {
    const createMocked = jest.fn();
    createMocked.mockReturnValue({ result: returnAllExample[0] });
    MarketsService.prototype.create = createMocked;
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());
    act(() => {
      result.current.create(marketFormProps);
    });
    await waitForNextUpdate();
    expect(result.current.market).toBe(returnAllExample[0]);
  });

  it("updates a market and returns changes", async () => {
    const updateMocked = jest.fn();
    updateMocked.mockReturnValue({ result: returnAllExample[0] });
    MarketsService.prototype.update = updateMocked;
    MarketsService.prototype.getById = updateMocked;
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());
    act(() => {
      result.current.update(1, marketFormProps);
    });
    await waitForNextUpdate();
    expect(result.current.market).toEqual(returnAllExample[0]);
  });

  it("deletes a market", async () => {
    const deleteMocked = jest.fn();
    const getAllMocked = jest.fn();
    getAllMocked.mockReturnValue({ result: returnAllExample });
    deleteMocked.mockReturnValue({ result: returnAllExample[0] });
    MarketsService.prototype.deleteById = deleteMocked;
    MarketsService.prototype.getAll = getAllMocked;
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());
    act(() => {
      result.current.deleteById(1);
    });
    await waitForNextUpdate();
    expect(result.current.market).toEqual(null);
  });
});
