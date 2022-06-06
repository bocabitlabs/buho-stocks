/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen } from "@testing-library/react";
import CurrenciesPageHeader from "./CurrenciesPageHeader";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("CurrenciesPageHeader tests", () => {
  it("renders expected texs", async () => {
    renderWithRouterAndQueryClient(
      <CurrenciesPageHeader>
        <div>Page content</div>
      </CurrenciesPageHeader>,
    );

    const element = screen.getByText(/Home/i);
    expect(element).toBeInTheDocument();

    const elements = screen.getAllByText(/Currencies/i);
    expect(elements).toHaveLength(2);

    const body = screen.getByText(/Page Content/i);
    expect(body).toBeInTheDocument();
  });
});
