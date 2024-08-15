import CountrySelector from "./CountrySelector";
import { customRender, userEvent, screen } from "test-utils";

describe("CountrySelector tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders expected texts when loading", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    // Mock function for onCreate
    const onChangeMock = vi.fn();

    customRender(
      <CountrySelector
        fieldName={"country"}
        onChange={onChangeMock}
        value=""
      />,
    );
    const element = screen.getByTestId("country-selector");
    if (!element) throw new Error("Element not found");
    await user.click(element);

    const option = screen.getByText("European Union");

    expect(screen.getByText("European Union")).toBeInTheDocument();
    await user.click(option);
    expect(onChangeMock).toHaveBeenCalledWith("eu", expect.anything());
  });
});
