// logout.js

import { sendPostRequest } from "./apiUtils.js";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

async function logout() {
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

export { logout };
