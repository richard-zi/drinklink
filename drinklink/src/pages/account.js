// AccountPage.js

import { useState } from "react";
import { sendPutRequest } from "../lib/api-utils";
import Head from "next/head";

const serverUrl = "http://localhost:4000";

async function updateAccount(username, oldPassword, newPassword) {
  const response = await sendPutRequest(`${serverUrl}/user`, {
    username,
    oldPassword,
    newPassword,
  });

  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    alert("Benutzerdaten wurden erfolgreich aktualisiert!");
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Aktualisierung der Benutzerdaten: " + error.error);
  }
}

export default function AccountPage() {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateAccount(username, oldPassword, newPassword);
  };

  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Benutzerkonto</title>
    </Head>
      <h1>Benutzerkonto</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Neuer Benutzername:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="old-password">Altes Passwort:</label>
        <input
          type="password"
          id="old-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <br />
        <label htmlFor="new-password">Neues Passwort:</label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <br />
        <button type="submit">Änderungen speichern</button>
      </form>
    </>
  );
}
