import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChartPortfolioReturns from "./ChartPortfolioReturns";
import { wrapper } from "utils/mock-providers";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

jest.mock("hooks/use-benchmarks/use-benchmarks", () => ({
  useBenchmarks: jest.fn(() => ({
    data: [
      {
        id: "1",
        name: "Benchmark 1",
      },
      {
        id: "2",
        name: "Benchmark 2",
      },
    ],
    isFetching: false,
  })),
}));

jest.mock("hooks/use-stats/use-portfolio-stats", () => ({
  usePortfolioAllYearStats: jest.fn(() => ({
    data: [
      { year: "2019", returnPercent: 10, returnWithDividendsPercent: 15 },
      { year: "2020", returnPercent: 5, returnWithDividendsPercent: 8 },
      { year: "2021", returnPercent: 8, returnWithDividendsPercent: 12 },
    ],
  })),
}));

jest.mock("hooks/use-benchmarks/use-benchmark-values", () => ({
  useBenchmarkValues: jest.fn(() => ({
    data: {
      years: [
        { year: "2019", returnPercentage: 11 },
        { year: "2020", returnPercentage: 6 },
        { year: "2021", returnPercentage: 7 },
      ],
    },
    isFetching: false,
  })),
}));

describe("ChartPortfolioReturns", () => {
  test("renders the chart with correct data", async () => {
    render(<ChartPortfolioReturns />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText("Portfolio Returns")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Return Percent")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Return + dividends")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("2019")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("2020")).toBeInTheDocument();
      // expect(screen.getByText("2021")).toBeInTheDocument();
      // expect(screen.getByText("10%")).toBeInTheDocument();
      // expect(screen.getByText("5%")).toBeInTheDocument();
      // expect(screen.getByText("8%")).toBeInTheDocument();
      // expect(screen.getByText("15%")).toBeInTheDocument();
      // expect(screen.getByText("8%")).toBeInTheDocument();
      // expect(screen.getByText("12%")).toBeInTheDocument();
    });
  });

  test("renders the benchmark select", async () => {
    render(<ChartPortfolioReturns />, { wrapper });
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Select a index")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Benchmark 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Benchmark 2")).toBeInTheDocument();
    });
  });

  test("updates the chart when a benchmark is selected", async () => {
    render(<ChartPortfolioReturns />, { wrapper });
    const select = screen.getByPlaceholderText("Select a index");
    userEvent.selectOptions(select, "1");
    await waitFor(() => {
      expect(screen.queryByText("Benchmark 2")).not.toBeInTheDocument();
      // expect(screen.getByText("6%")).toBeInTheDocument();
      // expect(screen.getByText("7%")).toBeInTheDocument();
    });
  });
});
