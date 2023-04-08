// login.js

import { sendPostRequest } from './utils.js';

const serverUrl = 'https://dev.nrdc.io';

async function login(username, password) {
    const response = await sendPostRequest(`${serverUrl}/login`, { username, password });
    if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        alert(`Erfolgreiche Anmeldung! Willkommen ${data.user.username}`);
    } else {
        const error = await response.json();
        console.error(error);
        alert('Fehler bei der Anmeldung: ' + error.error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        await login(username, password);
    });
});
