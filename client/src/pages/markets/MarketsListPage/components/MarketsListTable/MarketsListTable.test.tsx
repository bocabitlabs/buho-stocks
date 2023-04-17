import { screen, waitFor, render } from "@testing-library/react";
import MarketsListTable from "./MarketsListTable";
import { wrapper } from "utils/mock-providers";

describe("MarketsListTable tests", () => {
  it("renders expected texts after loading", async () => {
    expect(1).toBe(1);
    render(<MarketsListTable />, { wrapper });

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
  });
});
