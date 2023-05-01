// authUtils.js
import { sendPostRequest } from "./apiUtils.js";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Login eines Benutzers
export async function login(username, password) {
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

// Registrierung eines neuen Benutzers
export async function register(username, password) {
  const response = await sendPostRequest(`${serverUrl}/signup`, {
    username,
    password,
  });
  if (response.status === 201) {
    const data = await response.json();
    console.log(data);
    alert("Erfolgreiche Registrierung!");
    return true;
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Registrierung: " + error.error);
    return false;
  }
}

// Logout eines Benutzers
export async function logout() {
    const response = await sendPostRequest(`${serverUrl}/logout`);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      alert("Erfolgreiche Abmeldung");
      // Weiterleitung zur Startseite nach erfolgreicher Abmeldung
      window.location.href = "./";
    } else {
      const error = await response.json();
      console.error(error);
      alert("Fehler bei der Abmeldung: " + error.error);
    }
  }