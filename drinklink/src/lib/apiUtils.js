// apiUtils.js

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

export async function sendDeleteRequest(url, options = {}) {
  const defaultOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  const requestOptions = { ...defaultOptions, ...options };
  const response = await fetch(url, requestOptions);
  return response;
}
