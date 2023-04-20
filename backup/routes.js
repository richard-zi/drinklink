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
  res
    .status(StatusCodes.CREATED)
    .json({ message: "User registered successfully." });
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
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid username or password." });
  }

  // Vergleiche das eingegebene Passwort mit dem gespeicherten Passwort
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log(`Invalid login attempt: ${username}`);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid username or password." });
  }

  // Setze den Benutzer in der Session und sende eine erfolgreiche Antwort
  console.log(`Successful login: ${username}`);
  req.session.userId = user.id;
  res.status(StatusCodes.OK).json({
    message: "Login successful",
    user: { id: user.id, username: user.username },
  });
}

// Handler zum Abmelden von Benutzern
function logoutHandler(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error, please try again." });
    }
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
  });
}

// Handler zum Erstellen einer neuen Buchung
async function createBookingHandler(req, res) {
  const { date, people } = req.body;
  const userId = req.session.userId; // Extrahieren Sie die Benutzer-ID aus dem authentifizierten Benutzer

  try {
    const newBooking = await prisma.booking.create({
      data: {
        date: new Date(date),
        time: new Date(date),
        people: parseInt(people, 10),
        userId: userId, // Verwenden Sie die Benutzer-ID in der Buchungserstellung
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again." });
  }
}

// Handler zum Aktualisieren von Benutzerdaten
async function updateUserHandler(req, res) {
  const userId = req.session.userId;
  const { username, newPassword, oldPassword } = req.body;

  const user = await prisma.users.findUnique({ where: { id: userId } });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }

  if (oldPassword) {
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Old password is incorrect" });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }

  if (username) {
    await prisma.users.update({
      where: { id: userId },
      data: { username: username },
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "User data updated successfully" });
}

// Handler zum Abrufen des aktuellen Benutzers
async function getCurrentUserHandler(req, res) {
  const userId = req.session.userId;

  if (!userId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "User not logged in" });
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }

  res.status(StatusCodes.OK).json(user);
}

// Füge die Routen mit asyncHandler hinzu
router.post("/register", asyncHandler(registerHandler));
router.post("/login", asyncHandler(loginHandler));
router.post("/logout", logoutHandler);
router.post("/booking", isAuthenticated, asyncHandler(createBookingHandler));
router.put("/user", isAuthenticated, asyncHandler(updateUserHandler));
router.get("/current-user", asyncHandler(getCurrentUserHandler));

// Route für geschützten Bereich, die nur von authentifizierten Benutzern aufgerufen werden kann
router.get("/protected", isAuthenticated, (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Protected route accessed" });
});

// Error-Handling-Middleware für das Verarbeiten von Fehlern in Routen
router.use((err, req, res, next) => {
  console.error(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Server error, please try again." });
});

// Exportiere den Router, damit er in anderen Dateien verwendet werden kann
module.exports = router;
