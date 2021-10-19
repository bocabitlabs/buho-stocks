import ApiClient from "api/api-client";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";
import React, { ReactElement } from "react";


export default function HomePage(): ReactElement {
  const auth = useAuthContext();

  const getMarkets = () => {
    new ApiClient().getMarkets();
  };

  const getSettings = () => {
    new ApiClient().getSettings();
  };

  const signout = () => {
    auth.signout();
  };

  return (
    <WrapperPage>
      HOME
      <button onClick={getMarkets}>Get markets</button>
      <button onClick={getSettings}>Get Settings</button>
      <button onClick={signout}>Signout</button>
    </WrapperPage>
  );
}
