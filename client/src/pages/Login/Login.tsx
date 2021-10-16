import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { LoginForm } from "./components/LoginForm/LoginForm";

export function LoginPage() {
  let auth = useAuthContext();

  let login = () => {
    const username = "pepe";
    const password = "popo";
    auth.signin(username, password);
  };

  return (
    <div>
      <LoginForm/>
      <p>You must log in to view the app</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}