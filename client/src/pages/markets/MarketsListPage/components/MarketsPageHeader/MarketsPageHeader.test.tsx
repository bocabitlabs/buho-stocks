/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen } from "@testing-library/react";
import MarketsPageHeader from "./MarketsPageHeader";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("CurrenciesPageHeader tests", () => {
  it("renders expected texts", async () => {
    renderWithRouterAndQueryClient(
      <MarketsPageHeader>
        <div>Page content</div>
      </MarketsPageHeader>,
    );

    const element = screen.getAllByText(/Markets/i);
    expect(element).toHaveLength(2);

    const body = screen.getByText(/Page Content/i);
    expect(body).toBeInTheDocument();
  });
});
