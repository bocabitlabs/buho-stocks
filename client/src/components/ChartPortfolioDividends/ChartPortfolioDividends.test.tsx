import { screen, waitFor, render } from "@testing-library/react";
import ChartPortfolioDividends from "./ChartPortfolioDividends";
import { wrapper } from "utils/mock-providers";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...(actual as any),
    useParams: () => ({
      id: "1",
    }),
  };
});

describe("ChartPortfolioDividends tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders chart", async () => {
    render(<ChartPortfolioDividends />, { wrapper });

    const element = screen.getByTestId(/loader/i);
    expect(element).toBeInTheDocument();
  });
  it("renders expected texts after loading", async () => {
    render(<ChartPortfolioDividends />, { wrapper });

    await waitFor(() => {
      const element = screen.getByTestId("canvas");
      expect(element).toBeInTheDocument();
    });
  });
});
