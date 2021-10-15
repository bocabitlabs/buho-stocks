import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { useLocation } from "react-router-dom";
import { LocationState } from "types/location";

export function LoginPage() {
  let location = useLocation<LocationState>();
  let auth = useAuthContext();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    const username = "pepe";
    const password = "popo";
    auth.signin(username, password, from);
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}