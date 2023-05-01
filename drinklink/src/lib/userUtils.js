// userUtils.js

import { sendPutRequest } from "./apiUtils";
import { sendPostRequest } from "./apiUtils";
import { sendGetRequest } from "./apiUtils";
import { sendDeleteRequest } from "./apiUtils";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Aktualisierung des Benutzerkontos
export async function updateAccount(username, oldPassword, newPassword) {
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

// Aktuelln Benuzter abfragen
export async function getCurrentUser() {
  try {
    const response = await sendGetRequest(`${serverUrl}/current-user`);

    if (response === null) {
      console.log("Benutzer nicht angemeldet");
      return null;
    }

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      return data;
    } else if (response.status === 401) {
      // Benutzer nicht angemeldet, aber keine Konsolenausgabe mehr
      return null;
    } else {
      console.error("Failed to fetch current user");
      return null;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des aktuellen Benutzers", error);
    return null;
  }
}

// Update des Bar-Besitzer-Status
export async function updateBarOwnerStatus(isBarOwner) {
  const response = await sendPutRequest(`${serverUrl}/set-bar-owner-status`, {
    isBarOwner,
  });

  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    alert("Bar-Besitzer-Status wurde erfolgreich aktualisiert!");
  } else {
    const error = await response.json();
    console.error(error);
    alert(
      "Fehler beim Aktualisieren des Bar-Besitzer-Status: " + error.error
    );
  }
}