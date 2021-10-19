import WrapperPage from "pages/WrapperPage/WrapperPage";
import React, { ReactElement } from "react";
import SettingsForm from "./components/SettingsForm/SettingsForm";
import SettingsPageHeader from "./components/SettingsHeader/SettingsHeader";

export default function SettingsPage(): ReactElement {
  return (
    <WrapperPage>
      <SettingsPageHeader>
        <SettingsForm />
      </SettingsPageHeader>
    </WrapperPage>
  );
}
