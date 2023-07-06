// apiUtils.js

// Funktion zum Senden einer POST-Anfrage an die angegebene URL mit den übergebenen Daten
export async function sendPostRequest(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return response;
  } catch (err) {
    console.error(err);
    alert("Fehler bei der Anfrage");
  }
}

// Funktion zum Senden einer GET-Anfrage an die angegebene URL
export async function sendGetRequest(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return response;
  } catch (err) {
    console.error(err);
    alert("Fehler bei der Anfrage");
  }
}

// Funktion zum Senden einer PUT-Anfrage an die angegebene URL
export async function sendPutRequest(url, payload) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return response;
  } catch (err) {
    console.error(err);
    alert("Fehler bei der Anfrage");
  }
}

// Funktion zum Senden einer DELETE-Anfrage an die angegebene URL mit optionalen Einstellungen
export async function sendDeleteRequest(url, options = {}) {
  const defaultOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  // Kombinieren der Standardoptionen mit den übergebenen Optionen
  const requestOptions = { ...defaultOptions, ...options };

  // Senden der DELETE-Anfrage mit den entsprechenden Optionen
  const response = await fetch(url, requestOptions);
  return response;
}
