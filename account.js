// account.js

import { sendPutRequest } from "./utils.js";

const serverUrl = "http://localhost:3000";

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

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("update-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const oldPassword = document.getElementById("old-password").value;
      const newPassword = document.getElementById("new-password").value;
      await updateAccount(username, oldPassword, newPassword);
    });
});
