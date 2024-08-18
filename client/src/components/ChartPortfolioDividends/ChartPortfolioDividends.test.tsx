import ChartPortfolioDividends from "./ChartPortfolioDividends";
import { customRender, screen, waitFor } from "test-utils";

describe("ChartPortfolioDividends tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders ChartPortfolioDividends", async () => {
    customRender(<ChartPortfolioDividends data={[]} baseCurrencyCode={""} />);

    const element = screen.getByTestId(/loader/i);
    expect(element).toBeInTheDocument();
  });
  it("renders expected texts after loading", async () => {
    customRender(
      <ChartPortfolioDividends
        data={[
          {
            year: 2021,
            dividends: 100,
            company: {
              id: 1,
              name: "Company 1",
              ticker: "C1",
              baseCurrency: "USD",
              dividendsCurrency: "USD",
            },
            invested: 1000,
            dividendsYield: 0.1,
            sharesCount: 10,
            portfolioCurrency: "USD",
            accumulatedInvestment: 1000,
            accumulatedDividends: 100,
            portfolioValue: 1100,
            returnValue: 100,
            returnPercent: 0.1,
            returnWithDividends: 200,
            returnWithDividendsPercent: 0.2,
          },
          {
            year: 2022,
            dividends: 200,
            company: {
              id: 2,
              name: "Company 2",
              ticker: "C2",
              baseCurrency: "USD",
              dividendsCurrency: "USD",
            },
            invested: 2000,
            dividendsYield: 0.1,
            sharesCount: 20,
            portfolioCurrency: "USD",
            accumulatedInvestment: 2000,
            accumulatedDividends: 200,
            portfolioValue: 2200,
            returnValue: 200,
            returnPercent: 0.1,
            returnWithDividends: 400,
            returnWithDividendsPercent: 0.2,
          },
        ]}
        baseCurrencyCode={"USD"}
      />,
    );

    await waitFor(() => {
      const element = screen.getByTestId("chart");
      expect(element).toBeInTheDocument();
    });
  });
});
