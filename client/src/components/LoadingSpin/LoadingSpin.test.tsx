import LoadingSpin from "./LoadingSpin";
import { customRender, screen } from "test-utils";

describe("LoadingSpin component", () => {
  test("renders with default text 'Loading...'", () => {
    customRender(<LoadingSpin />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders with custom text", () => {
    customRender(<LoadingSpin text="Custom text" />);
    expect(screen.getByText("Custom text")).toBeInTheDocument();
  });

  test("renders with translated text", () => {
    customRender(<LoadingSpin text="common.loading" />);
    expect(screen.getByText("common.loading")).toBeInTheDocument();
  });
});
