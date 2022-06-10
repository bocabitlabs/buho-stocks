/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import MarketsListTable from "./MarketsListTable";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("MarketsListTable tests", () => {
  it("renders expected texts when loading", async () => {
    renderWithRouterAndQueryClient(<MarketsListTable />);

    const element = screen.getByText(/No data/i);
    expect(element).toBeInTheDocument();
  });

  it("renders expected texts after loading", async () => {
    renderWithRouterAndQueryClient(<MarketsListTable />);

    await waitFor(() => {
      const element = screen.getByText("AMS");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Spain stock exchange (BME)");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Name");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Description");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Region");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Opening time");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Closing time");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Action");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const elements = screen.getAllByTestId("editButton");
      expect(elements).toHaveLength(7);
    });
    await waitFor(() => {
      const elements = screen.getAllByTestId("deleteButton");
      expect(elements).toHaveLength(7);
    });
  });
});
