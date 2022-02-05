/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import CurrenciesPage from "./CurrenciesPage";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("CurrenciesPage tests", () => {
  it("renders expected texts when loading", async () => {
    renderWithRouterAndQueryClient(<CurrenciesPage />);

    const element = screen.getByText(/Fetching data.../i);
    expect(element).toBeInTheDocument();

    const elements = screen.getAllByText(/Currencies/i);
    expect(elements).toHaveLength(2);
  });

  it("renders expected texts after loading", async () => {
    renderWithRouterAndQueryClient(<CurrenciesPage />);

    await waitFor(() => {
      const element = screen.getByText("Australian dollar");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Canadian dollar");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Code");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Symbol");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Countries");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("AUD");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const elements = screen.getAllByText("$");
      expect(elements).toHaveLength(2);
    });
  });
});
