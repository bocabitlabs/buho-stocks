import { useAuthContext } from "hooks/use-auth/use-auth-context";
import React, { ReactElement } from "react";
import { useHistory } from "react-router";

interface Props {}

export default function RegisterForm({}: Props): ReactElement {
  let auth = useAuthContext();
  let history = useHistory();

  if(auth.isAuthenticated){
    history.replace("/app");
  }

  const registerUser = () => {
    const data = {
      username: "pepe",
      password: "ABCD12345!",
      password2: "ABCD12345!",
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@fakeemail.com"
    };

    fetch("/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        history.replace("/login");
      });
  };

  return (
    <div>
      <button onClick={registerUser}>Register User</button>
    </div>
  );
}
