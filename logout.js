// logout.js
import { sendPostRequest } from "./utils.js";

const serverUrl = "http://localhost:3000";

async function logout() {
  const response = await sendPostRequest(`${serverUrl}/logout`);
  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    alert("Erfolgreiche Abmeldung");
    // Weiterleitung zur Startseite nach erfolgreicher Abmeldung
    window.location.href = "./index.html";
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Abmeldung: " + error.error);
  }
}

export { logout };
