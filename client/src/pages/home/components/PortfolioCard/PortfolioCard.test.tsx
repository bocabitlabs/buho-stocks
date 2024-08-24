import { BrowserRouter } from "react-router-dom";
import PortfolioCard from "./PortfolioCard";
import { portfolioListMock } from "mocks/responses/portfolios/portfolioList";
import { customRender, screen } from "test-utils";

describe("PortfolioCard", () => {
  const mockProps = portfolioListMock[0];

  it("renders portfolio name", () => {
    customRender(
      <BrowserRouter>
        <PortfolioCard
          currencyCode={mockProps.baseCurrency.code}
          name={mockProps.name}
          id={mockProps.id}
          companies={mockProps.companies}
        />
      </BrowserRouter>,
    );

    const portfolioName = screen.getByText("My first portfolio");
    expect(portfolioName).toBeInTheDocument();
  });

  it("renders companies count", () => {
    customRender(
      <BrowserRouter>
        <PortfolioCard
          currencyCode={mockProps.baseCurrency.code}
          name={mockProps.name}
          id={mockProps.id}
          companies={mockProps.companies}
        />
      </BrowserRouter>,
    );

    const company1 = screen.getByText("3 companies");

    expect(company1).toBeInTheDocument();
  });

  it("renders currency code", () => {
    customRender(
      <BrowserRouter>
        <PortfolioCard
          currencyCode={mockProps.baseCurrency.code}
          name={mockProps.name}
          id={mockProps.id}
          companies={mockProps.companies}
        />
      </BrowserRouter>,
    );

    const currencyCode = screen.getByTestId("country-flag");
    expect(currencyCode).toBeInTheDocument();
  });
});
