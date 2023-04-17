import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CountrySelector from "./CountrySelector";
import { wrapper } from "utils/mock-providers";

describe("CountrySelector tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders expected texts when loading", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    // Mock function for onCreate
    const onChangeMock = vi.fn();

    render(<CountrySelector handleChange={onChangeMock} />, { wrapper });
    // eslint-disable-next-line testing-library/no-node-access
    const element = screen.getByTestId("country-selector").firstElementChild;
    if (!element) throw new Error("Element not found");
    await user.click(element);

    const option = screen.getByText("European Union");

    expect(screen.getByText("European Union")).toBeInTheDocument();
    await user.click(option);
    expect(onChangeMock).toHaveBeenCalledWith("eu", expect.anything());
  });
});
