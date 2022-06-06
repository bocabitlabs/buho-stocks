/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import CurrenciesListTable from "./CurrenciesListTable";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("CurrenciesPage tests", () => {
  it("renders expected texts when loading", async () => {
    renderWithRouterAndQueryClient(<CurrenciesListTable />);

    const element = screen.getByText(/Fetching data.../i);
    expect(element).toBeInTheDocument();
  });

  it("renders expected texts after loading", async () => {
    renderWithRouterAndQueryClient(<CurrenciesListTable />);

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
      const element = screen.getByText("AUD");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const elements = screen.getAllByText("$");
      expect(elements).toHaveLength(2);
    });
  });
});
