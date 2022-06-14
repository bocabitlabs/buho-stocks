/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CountrySelector from "./CountrySelector";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("CountrySelector tests", () => {
  it("renders expected texts when loading", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    // Mock function for onCreate
    const onChangeMock = jest.fn();
    renderWithRouterAndQueryClient(
      <CountrySelector handleChange={onChangeMock} />,
    );

    const element = screen.getByRole("combobox");

    await user.click(element);

    const option = screen.getByText("European Union");

    expect(screen.getByText("European Union")).toBeInTheDocument();
    await user.click(option);
    expect(onChangeMock).toHaveBeenCalledWith("eu", expect.anything());
  });
});
