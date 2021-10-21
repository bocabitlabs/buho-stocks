import { AuthContext } from "contexts/auth";
import { SettingsContext } from "contexts/settings";
import MainRouter from "MainRouter";
import React, { ReactElement, useContext } from "react";

export default function Main(): ReactElement {
  const authContext = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);

  return (
    <AuthContext.Provider value={authContext}>
      <SettingsContext.Provider value={settingsContext}>
        <MainRouter />
      </SettingsContext.Provider>
    </AuthContext.Provider>
  );
}
