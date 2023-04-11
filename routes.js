// Importiere benötigte Module und erstelle eine neue Express-Router-Instanz
const express = require("express");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Middleware zur Überprüfung der Authentifizierung
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
}

// Funktion, die einen Handler für die Fehlerbehandlung von asynchronen Routen einhüllt
function asyncHandler(handler) {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Handler zum Registrieren neuer Benutzer
async function registerHandler(req, res) {
  const { username, password } = req.body;

  // Überprüfe, ob Benutzername und Passwort vorhanden sind
  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Username and password are required." });
  }

  // Erstelle ein gehashtes Passwort
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Speichere den neuen Benutzer in der Datenbank
  const newUser = await prisma.users.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });
  console.log(`User registered successfully: ${username}`);
  res.status(StatusCodes.CREATED).json({ message: "User registered successfully." });
}

// Handler zum Einloggen von Benutzern
async function loginHandler(req, res) {
  const { username, password } = req.body;

  // Überprüfe, ob Benutzername und Passwort vorhanden sind
  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Username and password are required." });
  }

  // Suche den Benutzer in der Datenbank
  const user = await prisma.users.findUnique({
    where: { username: username },
  });

  // Überprüfe, ob der Benutzer existiert
  if (!user) {
    console.log(`Invalid login attempt: ${username}`);
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid username or password." });
  }

  // Vergleiche das eingegebene Passwort mit dem gespeicherten Passwort
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log(`Invalid login attempt: ${username}`);
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid username or password." });
  }

  // Setze die Benutzer-ID in der Session und sende eine erfolgreiche Antwort
  console.log(`Successful login: ${username}`);
  req.session.userId = user.id;
  res
    .status(StatusCodes.OK)
    .json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
}

// Handler zum Abmelden von Benutzern
function logoutHandler(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error, please try again." });
    }
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
    });
    }
    
    // Füge die Routen mit asyncHandler hinzu
    router.post("/register", asyncHandler(registerHandler));
    router.post("/login", asyncHandler(loginHandler));
    router.post("/logout", logoutHandler);
    
    // Route für geschützten Bereich, die nur von authentifizierten Benutzern aufgerufen werden kann
    router.get("/protected", isAuthenticated, (req, res) => {
    res.status(StatusCodes.OK).json({ message: "Protected route accessed" });
    });
    
    // Error-Handling-Middleware für das Verarbeiten von Fehlern in Routen
    router.use((err, req, res, next) => {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error, please try again." });
    });
    
    // Exportiere den Router, damit er in anderen Dateien verwendet werden kann
    module.exports = router;
