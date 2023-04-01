const serverUrl = 'http://localhost:3000';

// Fügt einen Event-Listener zum Login-Formular hinzu, der auf das "submit"-Event reagiert
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    // Verhindert das Neuladen der Seite

    // Liest die Benutzername- und Passwortwerte aus den Formularfeldern
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        // Sendet eine POST-Anfrage an den '/login'-Endpunkt des Servers
        const response = await fetch(`${serverUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Überprüft, ob die Anfrage erfolgreich war
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            alert(`Erfolgreiche Anmeldung! Willkommen ${data.user.username}`);
        } else {
            const error = await response.json();
            console.error(error);
            alert('Fehler bei der Anmeldung: ' + error.error);
        }
    } catch (err) {
        console.error(err);
        alert('Fehler bei der Anmeldung');
    }
});

// Fügt einen Event-Listener zum Registrierungsformular hinzu, der auf das "submit"-Event reagiert
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    // Verhindert das Neuladen der Seite
// Liest die Benutzername- und Passwortwerte aus den Formularfeldern
const username = document.getElementById('register-username').value;
const password = document.getElementById('register-password').value;

try {
    // Sendet eine POST-Anfrage an den '/register'-Endpunkt des Servers
    const response = await fetch(`${serverUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    // Überprüft, ob die Anfrage erfolgreich war
    if (response.status === 201) {
        const data = await response.json();
        console.log(data);
        alert('Erfolgreiche Registrierung!');
    } else {
        const error = await response.json();
        console.error(error);
        alert('Fehler bei der Registrierung: ' + error.error);
    }
} catch (err) {
    console.error(err);
    alert('Fehler bei der Registrierung');
}
});

// Event-Listener für die geschützte Route
document.getElementById('protected-route-btn').addEventListener('click', async () => {
    try {
        const response = await fetch(`${serverUrl}/protected`);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            alert('Geschützte Route aufgerufen!');
        } else {
            const error = await response.json();
            console.error(error);
            alert('Fehler beim Zugriff auf die geschützte Route: ' + error.error);
        }
    } catch (err) {
        console.error(err);
        alert('Fehler beim Zugriff auf die geschützte Route');
    }
});

// Event-Listener für den Logout-Button
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        const response = await fetch(`${serverUrl}/logout`, {
            method: 'POST',
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            alert('Erfolgreich abgemeldet!');
        } else {
            const error = await response.json();
            console.error(error);
            alert('Fehler beim Abmelden: ' + error.error);
        }
    } catch (err) {
        console.error(err);
        alert('Fehler beim Abmelden');
    }
});

// Der obige Code fügt Event-Listener zu den Login- und Registrierungsformularen hinzu. Wenn ein Benutzer das
// Login- oder Registrierungsformular absendet, wird eine POST-Anfrage an den Server gesendet,
// um den Benutzer entweder anzumelden oder zu registrieren.
// Wenn die Anfrage erfolgreich ist, zeigt das Skript eine entsprechende Erfolgsmeldung an.
// Andernfalls wird eine Fehlermeldung angezeigt.
