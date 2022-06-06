/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen } from "@testing-library/react";
import { BuySellLabel } from "./BuySellLabel";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("BuySellLabel tests", () => {
  it("renders buy label", async () => {
    renderWithRouterAndQueryClient(<BuySellLabel value="BUY" />);

    const element = screen.getByText(/BUY/i);
    expect(element).toBeInTheDocument();
  });

  it("renders sell label", async () => {
    renderWithRouterAndQueryClient(<BuySellLabel value="SELL" />);

    const element = screen.getByText(/SELL/i);
    expect(element).toBeInTheDocument();
  });
});
