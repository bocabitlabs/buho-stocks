import { useAuthContext } from "hooks/use-auth/use-auth-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";
import React, { ReactElement } from "react";


export default function HomePage(): ReactElement {
  const auth = useAuthContext();

  const signout = () => {
    auth.signout();
  };

  return (
    <WrapperPage>
      HOME
      <button onClick={signout}>Signout</button>
    </WrapperPage>
  );
}
