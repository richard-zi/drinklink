// Importiere benötigte Module
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');

// Lade Umgebungsvariablen aus der .env-Datei
require('dotenv').config({ path: './.env' });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);


// Erstelle eine Express-App und konfiguriere sie
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS konfigurieren
app.use(cors());

// Sitzungsverwaltung konfigurieren
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 Stunden
    },
  })
);

// Erstelle eine Datenbankverbindung
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Verbinde mit der Datenbank
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Middleware, um zu überprüfen, ob ein Benutzer angemeldet ist
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Registrierungsrouten-Handler
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Prüfe, ob Benutzername und Passwort vorhanden sind
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Hash das Passwort
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Füge den neuen Benutzer in die Datenbank ein
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error, please try again.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again.' });
  }
});

// Login-Routen-Handler
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Prüfe, ob Benutzername und Passwort vorhanden sind
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Suche nach dem Benutzer in der Datenbank
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error, please try again.' });
    }

    // Prüfe, ob der Benutzer existiert und das Passwort übereinstimmt
if (results.length === 0) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }
  
  const user = results[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }
  
  // Wenn der Benutzer gefunden wurde und das Passwort korrekt ist, speichere die Benutzer-ID in der Sitzung
  req.session.userId = user.id;
  res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
});

// Logout-Routen-Handler
app.post('/logout', (req, res) => {
req.session.destroy((err) => {
if (err) {
console.error(err);
return res.status(500).json({ error: 'Server error, please try again.' });
}
res.status(200).json({ message: 'Logout successful' });
});
});

// Beispielgeschützte Route
app.get('/protected', isAuthenticated, (req, res) => {
res.status(200).json({ message: 'Protected route accessed' });
});

// Starte den Server und lausche auf Port 3000
app.listen(3000, () => {
console.log('Server is running on port 3000');
})
});