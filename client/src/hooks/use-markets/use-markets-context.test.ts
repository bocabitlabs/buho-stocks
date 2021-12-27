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
        // eslint-disable-next-line no-promise-executor-return
        changeLanguage: () => new Promise(() => ({}))
      }
    };
  }
}));

const mockedGetValue = jest.fn();
const mockedPostValue = jest.fn();
const mockedPutValue = jest.fn();
const mockedDeleteValue = jest.fn();

jest.mock("hooks/use-api/use-api-hook", () => ({
  useApi: () => ({
    get: async () => mockedGetValue,
    post: mockedPostValue,
    put: mockedPutValue,
    delete: mockedDeleteValue
  })
}));

jest.mock("react-router", () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}));

describe("useMarketsContext tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("verifies that is loading is false when the component loads", () => {
    const { result } = renderHook(() => useMarketsContext());
    expect(result.current.isLoading).toBe(false);
  });

  it("verifies that it loads with no markets", () => {
    const { result } = renderHook(() => useMarketsContext());
    expect(result.current.markets.length).toBe(0);
  });

  it("verifies that it loads with no market", () => {
    const { result } = renderHook(() => useMarketsContext());
    expect(result.current.market).toBe(null);
  });

  it("verifies that getAll returns the markets", async () => {
    mockedGetValue.mockReturnValue(returnAllExample);
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());

    act(() => {
      result.current.getAll();
    });
    await waitForNextUpdate();
    expect(result.current.markets).toBe(returnAllExample);
  });

  it("verifies that getById returns the market 1", async () => {
    mockedGetValue.mockReturnValue(returnAllExample[0]);
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());
    act(() => {
      result.current.getById(1);
    });
    await waitForNextUpdate();
    expect(result.current.market).toBe(returnAllExample[0]);
  });

  it("creates a market and returns changes", async () => {
    mockedPostValue.mockReturnValue(returnAllExample[0]);
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());
    act(() => {
      result.current.create(marketFormProps);
    });
    await waitForNextUpdate();
    expect(result.current.market).toBe(returnAllExample[0]);
  });

  it("updates a market and returns changes", async () => {
    mockedGetValue.mockReturnValue(returnAllExample[0]);
    mockedPutValue.mockReturnValue(returnAllExample[0]);
    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());
    act(() => {
      result.current.update(1, marketFormProps);
    });
    await waitForNextUpdate();
    expect(result.current.market).toEqual(returnAllExample[0]);
  });

  it("deletes a market", async () => {
    mockedGetValue.mockReturnValue(returnAllExample);
    mockedDeleteValue.mockReturnValue(returnAllExample[0]);

    const { result, waitForNextUpdate } = renderHook(() => useMarketsContext());
    act(() => {
      result.current.deleteById(1);
    });
    await waitForNextUpdate();
    expect(result.current.market).toEqual(null);
  });
});
