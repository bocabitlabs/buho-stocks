import React, { ReactElement } from "react";
import { Grid } from "@mantine/core";
import SettingsForm from "./components/SettingsForm/SettingsForm";
import SettingsPageHeader from "./components/SettingsHeader/SettingsHeader";

export default function SettingsPage(): ReactElement {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <SettingsPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <SettingsForm />
      </Grid.Col>
    </Grid>
  );
}
