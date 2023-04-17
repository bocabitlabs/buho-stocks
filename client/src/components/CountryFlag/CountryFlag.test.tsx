import { render, screen } from "@testing-library/react";
import CountryFlag from "./CountryFlag";

describe("CountryFlag component", () => {
  test("renders null when an invalid code prop is provided", () => {
    render(<CountryFlag code="invalid" />);
    expect(screen.queryByTestId("country-flag")).toBeNull();
  });

  test("renders flag when a valid code prop is provided", () => {
    render(<CountryFlag code="US" />);
    expect(screen.getByTestId("country-flag")).toBeInTheDocument();
  });

  test("renders flag with maxHeight style of 20", () => {
    render(<CountryFlag code="US" />);
    expect(screen.getByTestId("country-flag")).toHaveStyle({
      maxHeight: "20px",
    });
  });
});
