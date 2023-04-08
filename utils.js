// utils.js

export async function sendPostRequest(url, payload) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return response;
    } catch (err) {
        console.error(err);
        alert('Fehler bei der Anfrage');
    }
}
