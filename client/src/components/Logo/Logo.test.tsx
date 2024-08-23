import Logo from "./Logo";
import { customRender, screen } from "test-utils";

describe("Logo tests", () => {
  it("renders the logo", async () => {
    customRender(<Logo />);

    const element = screen.getByText(/Buho Stocks/i);
    expect(element).toBeInTheDocument();
  });
});
