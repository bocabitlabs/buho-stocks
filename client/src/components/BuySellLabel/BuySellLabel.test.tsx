import { BuySellLabel } from "./BuySellLabel";
import { customRender, screen } from "test-utils";

describe("BuySellLabel tests", () => {
  it("renders buy label", async () => {
    customRender(<BuySellLabel value="BUY" />);

    const element = screen.getByText(/BUY/i);
    expect(element).toBeInTheDocument();
  });

  it("renders sell label", async () => {
    customRender(<BuySellLabel value="SELL" />);

    const element = screen.getByText(/SELL/i);
    expect(element).toBeInTheDocument();
  });
});
