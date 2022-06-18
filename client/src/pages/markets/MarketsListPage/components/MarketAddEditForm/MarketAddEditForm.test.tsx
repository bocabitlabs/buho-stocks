/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MarketAddEditForm from "./MarketAddEditForm";
import { renderWithRouterAndQueryClient } from "utils/test-utils";

describe("MarketsListTable tests", () => {
  it("renders expected texts when loading", async () => {
    // Mock function for onCreate
    const onCreate = jest.fn();
    const onCancel = jest.fn();
    renderWithRouterAndQueryClient(
      <MarketAddEditForm
        title="Add a market"
        isModalVisible
        okText="OK"
        onCreate={onCreate}
        onCancel={onCancel}
      />,
    );

    let element = screen.getByText(/Add a market/i);
    expect(element).toBeInTheDocument();

    element = screen.getByText(/Name/i);
    expect(element).toBeInTheDocument();

    element = screen.getByText(/Description/i);
    expect(element).toBeInTheDocument();

    element = screen.getByText(/OK/i);
    expect(element).toBeInTheDocument();

    element = screen.getByText(/Cancel/i);
    expect(element).toBeInTheDocument();

    element = screen.getByText(/Country/i);
    expect(element).toBeInTheDocument();

    element = screen.getByText(/Opening time/i);
    expect(element).toBeInTheDocument();

    element = screen.getByText(/Closing time/i);
    expect(element).toBeInTheDocument();

    element = screen.getByText(/Timezone/i);
    expect(element).toBeInTheDocument();
  });

  it("renders expected texts when user fills the form", async () => {
    const user = userEvent.setup();

    // Mock function for onCreate
    const onCreate = jest.fn();
    const onCancel = jest.fn();
    renderWithRouterAndQueryClient(
      <MarketAddEditForm
        title="Add a market"
        isModalVisible
        okText="OK"
        onCreate={onCreate}
        onCancel={onCancel}
      />,
    );
    await user.type(screen.getByLabelText("Name"), "Amsterdam Stock Exchange");
    expect(screen.getByLabelText("Name")).toHaveValue(
      "Amsterdam Stock Exchange",
    );

    /*     await user.selectOptions(screen.getByTestId("country-selector"), "eu");
    act(() => {
      const element = screen.getByText(/eu/i);
      expect(element).toBeInTheDocument();

      // expect(screen.getByText("country-selector")).toHaveValue("eu");
    }); */
  });
});
