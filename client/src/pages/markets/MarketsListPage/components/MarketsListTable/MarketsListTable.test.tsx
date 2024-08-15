import { MRT_Localization_EN } from "mantine-react-table/locales/en/index.esm.mjs";
import MarketsListTable from "./MarketsListTable";
import { customRender, waitFor, screen } from "test-utils";

describe("MarketsListTable tests", () => {
  it("renders expected texts after loading", async () => {
    expect(1).toBe(1);
    customRender(<MarketsListTable mrtLocalization={MRT_Localization_EN} />);

    await waitFor(() => {
      // const element = screen.getByText("mrt-table-paper");
      const element = screen.getByLabelText("Show/Hide filters");
      expect(element).toBeInTheDocument();
    });

    // await waitFor(() => {
    //   const element = screen.getByText("Name");
    //   expect(element).toBeInTheDocument();
    // });

    // await waitFor(() => {
    //   const element = screen.getByText("Description");
    //   expect(element).toBeInTheDocument();
    // });

    // await waitFor(() => {
    //   const element = screen.getByText("tabler-icon-search");
    //   expect(element).toBeInTheDocument();
    // });

    // await waitFor(() => {
    //   const element = screen.getByText("Opening time");
    //   expect(element).toBeInTheDocument();
    // });

    // await waitFor(() => {
    //   const element = screen.getByText("Closing time");
    //   expect(element).toBeInTheDocument();
    // });
  });
});
