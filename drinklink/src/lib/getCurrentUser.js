// getCurrentUser.js
import { sendGetRequest } from "./api-utils.js";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

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
