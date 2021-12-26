import React, { ReactElement } from "react";
import SettingsForm from "./components/SettingsForm/SettingsForm";
import SettingsPageHeader from "./components/SettingsHeader/SettingsHeader";

export default function SettingsPage(): ReactElement {
  return (
    <SettingsPageHeader>
      <SettingsForm />
    </SettingsPageHeader>
  );
}
