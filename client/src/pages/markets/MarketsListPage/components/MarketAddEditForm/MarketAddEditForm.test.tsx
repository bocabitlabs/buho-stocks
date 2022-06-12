/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import { screen, waitFor } from "@testing-library/react";
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
  /*
  it("renders expected texts after loading", async () => {
    renderWithRouterAndQueryClient(<MarketsListTable />);

    await waitFor(() => {
      const element = screen.getByText("AMS");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Spain stock exchange (BME)");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Name");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Description");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Region");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Opening time");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Closing time");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.getByText("Action");
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const elements = screen.getAllByTestId("editButton");
      expect(elements).toHaveLength(7);
    });
    await waitFor(() => {
      const elements = screen.getAllByTestId("deleteButton");
      expect(elements).toHaveLength(7);
    });
  }); */
});
