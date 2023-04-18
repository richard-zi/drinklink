// LoginPage.js
import { useState } from "react";
import { useRouter } from "next/router";
import { sendPostRequest } from "../lib/api-utils";

const serverUrl = "http://localhost:4000";

async function login(username, password) {
  const response = await sendPostRequest(`${serverUrl}/login`, {
    username,
    password,
  });
  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    alert(`Erfolgreiche Anmeldung! Willkommen ${data.user.username}`);
    return true;
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Anmeldung: " + error.error);
    return false;
  }
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await login(username, password)) {
      router.push("/");
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-username">Benutzername:</label>
        <input
          type="text"
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="login-password">Passwort:</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Anmelden</button>
      </form>
    </>
  );
}
