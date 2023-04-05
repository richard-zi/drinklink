// Importiere benötigte Module
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// Lade Umgebungsvariablen aus der .env-Datei
dotenv.config();

// Erstelle eine Prisma-Client-Instanz
const prisma = new PrismaClient();

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

// Middleware, um zu überprüfen, ob ein Benutzer angemeldet ist
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// Füge Exit-Mechanismus hinzu
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  prisma.$disconnect(); // Trenne die Prisma-Verbindung
  process.exit(0);
});

// Registrierungsrouten-Handler
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        username: username,
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

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { username: username },
    });

    if (!user) {
      console.log(`Invalid login attempt: ${username}`);
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Invalid login attempt: ${username}`);
      return res.status(401).json({ error: "Invalid username or password." });
    }

    console.log(`Successful login: ${username}`);
    req.session.userId = user.id;
    res
      .status(200)
      .json({
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
