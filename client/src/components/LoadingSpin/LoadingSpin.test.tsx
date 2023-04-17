import { render, screen } from "@testing-library/react";
import LoadingSpin from "./LoadingSpin";

describe("LoadingSpin component", () => {
  test("renders with default text 'Loading...'", () => {
    render(<LoadingSpin />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders with custom text", () => {
    render(<LoadingSpin text="Custom text" />);
    expect(screen.getByText("Custom text")).toBeInTheDocument();
  });

  test("renders with translated text", () => {
    render(<LoadingSpin text="common.loading" />);
    expect(screen.getByText("common.loading")).toBeInTheDocument();
  });
});
