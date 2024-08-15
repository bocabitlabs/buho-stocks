import MarketsPageHeader from "./MarketsPageHeader";
import { customRender, screen } from "test-utils";

describe("CurrenciesPageHeader tests", () => {
  it("renders expected texts", async () => {
    customRender(<MarketsPageHeader />);

    const element = screen.getAllByText(/Markets/i);
    expect(element).toHaveLength(1);

    const el1 = screen.getByText(/Add Market/i);
    expect(el1).toBeInTheDocument();
  });
});
