/* eslint-disable react/jsx-no-constructed-context-values */
import { screen, waitFor, render } from "@testing-library/react";
import App from "./App";
import { wrapper } from "utils/mock-providers";

describe("App tests", () => {
  it("renders expected texts when authenticated", async () => {
    expect(1).toBe(1);
    render(<App />, { wrapper });
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
