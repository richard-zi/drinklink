// getCurrentUser.js
import { sendGetRequest } from "./utils.js";

const serverUrl = "http://localhost:3000";

export async function getCurrentUser() {
  try {
    const response = await sendGetRequest(`${serverUrl}/current-user`);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      return data;
    } else if (response.status === 401) {
      console.log("Benutzer nicht angemeldet");
      return null;
    } else {
      throw new Error("Failed to fetch current user");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des aktuellen Benutzers", error);
    return null;
  }
}
