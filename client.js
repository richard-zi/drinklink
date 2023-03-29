const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        console.log(data.message);
        console.log(`Logged in as ${data.user.username}`);
    } else {
        console.error(data.error);
    }
});