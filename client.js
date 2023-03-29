document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

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
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

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
