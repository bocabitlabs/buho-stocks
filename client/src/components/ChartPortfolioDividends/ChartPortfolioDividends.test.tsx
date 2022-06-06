/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import ChartPortfolioDividends from "./ChartPortfolioDividends";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "1",
  }),
}));

describe("ChartPortfolioDividends tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders chart", async () => {
    renderWithRouterAndQueryClient(<ChartPortfolioDividends />);

    const element = screen.getByTestId(/loader/i);
    expect(element).toBeInTheDocument();
  });
  it("renders expected texts after loading", async () => {
    renderWithRouterAndQueryClient(<ChartPortfolioDividends />);

    await waitFor(() => {
      const element = screen.getByTestId("canvas");
      expect(element).toBeInTheDocument();
    });
  });
});
