import { ReactElement } from "react";
import { Grid } from "@mantine/core";
import PortfoliosPageHeader from "./components/HomePageHeader/HomePageHeader";
import PortfolioList from "./components/PortfolioList/PortfolioList";

export default function HomePage(): ReactElement {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <PortfoliosPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <PortfolioList />
      </Grid.Col>
    </Grid>
  );
}
