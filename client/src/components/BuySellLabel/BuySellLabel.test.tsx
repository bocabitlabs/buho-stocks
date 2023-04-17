import { screen, render } from "@testing-library/react";
import { BuySellLabel } from "./BuySellLabel";

describe("BuySellLabel tests", () => {
  it("renders buy label", async () => {
    render(<BuySellLabel value="BUY" />);

    const element = screen.getByText(/BUY/i);
    expect(element).toBeInTheDocument();
  });

  it("renders sell label", async () => {
    render(<BuySellLabel value="SELL" />);

    const element = screen.getByText(/SELL/i);
    expect(element).toBeInTheDocument();
  });
});
