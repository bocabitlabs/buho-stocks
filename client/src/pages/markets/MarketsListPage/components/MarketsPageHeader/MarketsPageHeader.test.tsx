/* eslint-disable react/jsx-no-constructed-context-values */
import { screen, render } from "@testing-library/react";
import MarketsPageHeader from "./MarketsPageHeader";
import { wrapper } from "utils/mock-providers";

describe("CurrenciesPageHeader tests", () => {
  it("renders expected texts", async () => {
    render(
      <MarketsPageHeader>
        <div>Page content</div>
      </MarketsPageHeader>,
      { wrapper },
    );

    const element = screen.getAllByText(/Markets/i);
    expect(element).toHaveLength(2);

    const body = screen.getByText(/Page Content/i);
    expect(body).toBeInTheDocument();
  });
});
