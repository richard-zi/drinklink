// Importiere benötigte Module
const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const routes = require("./backup/routes_old");

// Lade Umgebungsvariablen aus der .env-Datei
dotenv.config();

// Erstelle eine Prisma-Client-Instanz
const prisma = new PrismaClient();

// Erstelle eine Express-App und konfiguriere sie
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Füge die Routen hinzu
app.use(routes);

// Füge Exit-Mechanismus hinzu
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  prisma.$disconnect(); // Trenne die Prisma-Verbindung
  process.exit(0);
});

// Environment-Variable für den Port
const PORT = process.env.PORT || 3000;

// Starte den Server und lausche auf den Port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
