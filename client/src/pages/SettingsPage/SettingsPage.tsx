import React, { ReactElement } from "react";
import SettingsForm from "./components/SettingsForm/SettingsForm";
import SettingsPageHeader from "./components/SettingsHeader/SettingsHeader";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export default function SettingsPage(): ReactElement {
  return (
    <WrapperPage>
      <SettingsPageHeader>
        <SettingsForm />
      </SettingsPageHeader>
    </WrapperPage>
  );
}
