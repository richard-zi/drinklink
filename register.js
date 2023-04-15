// register.js

import { sendPostRequest } from "./utils.js";

const serverUrl = "http://localhost:3000";

async function register(username, password) {
  const response = await sendPostRequest(`${serverUrl}/register`, {
    username,
    password,
  });
  if (response.status === 201) {
    const data = await response.json();
    console.log(data);
    alert("Erfolgreiche Registrierung!");
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Registrierung: " + error.error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("register-username").value;
      const password = document.getElementById("register-password").value;
      await register(username, password);
    });
});
