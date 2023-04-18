// RegisterPage.js
import { useState } from 'react';
import { sendPostRequest } from '../lib/api-utils';
import Head from 'next/head';

const serverUrl = "http://localhost:4000";

async function register(username, password) {
  const response = await sendPostRequest(`${serverUrl}/register`, {
    username,
    password,
  });
  if (response.status === 201) {
    const data = await response.json();
    console.log(data);
    alert('Erfolgreiche Registrierung!');
  } else {
    const error = await response.json();
    console.error(error);
    alert('Fehler bei der Registrierung: ' + error.error);
  }
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(username, password);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registrierung</title>
      </Head>
      <h1>Registrierung</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="register-username">Benutzername:</label>
        <input
          type="text"
          id="register-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="register-password">Passwort:</label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Registrieren</button>
      </form>
    </>
  );
}
