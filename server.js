// Importiere benötigte Module
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// Lade Umgebungsvariablen aus der .env-Datei
require("dotenv").config({ path: "process.env" });

// Erstelle eine Express-App und konfiguriere sie
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS konfigurieren
app.use(cors());

// Sitzungsverwaltung konfigurieren
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 Stunden
    },
  })
);

// Erstelle eine Prisma-Instanz
const prisma = new PrismaClient();

// Füge Exit-Mechanismus hinzu
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  prisma.$disconnect();
  process.exit(0);
});

// Middleware, um zu überprüfen, ob ein Benutzer angemeldet ist
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// Registrierungsrouten-Handler
app.post("/register", async (req, res) => {
  // ... (Keine Änderungen an diesem Teil)

  // Füge den neuen Benutzer in die Datenbank ein
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    console.log(`User registered successfully: ${username}`);
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error, please try again." });
  }
});

// Login-Routen-Handler
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Prüfe, ob Benutzername und Passwort vorhanden sind
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Suche nach dem Benutzer in der Datenbank
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // Prüfe, ob der Benutzer existiert und das Passwort übereinstimmt
    if (!user) {
      console.log(`Invalid login attempt: ${username}`);
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Invalid login attempt: ${username}`);
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Wenn der Benutzer gefunden wurde und das Passwort korrekt ist, speichere die Benutzer-ID in der Sitzung
    console.log(`Successful login: ${username}`);
    req.session.userId = user.id;
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error, please try again." });
  }
});

// Logout-Routen-Handler
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error, please try again." });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

// Beispielgeschützte Route
app.get("/protected", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

// Starte den Server und lausche auf Port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
