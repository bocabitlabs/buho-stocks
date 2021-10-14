import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [userData, setUserData] = useState();
  const [token, setToken] = useState("")
  const [markets, setMarkets] = useState("")

  const storedToken = localStorage.getItem('token');

  const registerUser = () => {
    const data = {
      username: "pepe",
      password: "ABCD12345!",
      password2: "ABCD12345!",
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@fakeemail.com"
    }
    fetch('/auth/register/', { method: 'POST', headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }, body: JSON.stringify(data) })
  .then(response => response.json())
  .then(data => {console.log(data); setUserData(data)});
  }

  const getToken = () => {
    const data = {
      username: "pepe",
      password: "ABCD12345!"
    }
    fetch('/auth/api-token-auth/', { method: 'POST', headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }, body: JSON.stringify(data) })
  .then(response => response.json())
  .then(data => {console.log(data);
    setToken(data);
    localStorage.setItem('token', data.token);
  });
  }

  const getMarkets = () => {
    const storedToken = localStorage.getItem('token');
    console.log(storedToken)

    fetch('/api/v1/markets/', { method: 'GET', headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token '+ storedToken
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }})
  .then(response => response.json())
  .then(data => {console.log(data); setToken(data)});
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={registerUser}>Register User</button>
        <button onClick={getToken}>Get token</button>
        <button onClick={getMarkets}>Get markets</button>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          {JSON.stringify(token)}
          {JSON.stringify(markets)}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
