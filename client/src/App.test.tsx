/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import App from "./App";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("App tests", () => {
  it("renders expected texts when not authenticated", async () => {
    renderWithRouterAndQueryClient(<App />);

    const element = screen.getByText(/Login in.../i);
    expect(element).toBeInTheDocument();
  });

  it("renders expected texts when authenticated", async () => {
    expect(1).toBe(1);
    renderWithRouterAndQueryClient(<App />);
    await waitFor(() => {
      const elements = screen.getAllByText(/Buho Stocks/i);
      expect(elements).toHaveLength(2);
    });
    await waitFor(() => {
      const element = screen.getByText(/Bocabitlabs.../i);
      expect(element).toBeInTheDocument();
    });
  });
});
