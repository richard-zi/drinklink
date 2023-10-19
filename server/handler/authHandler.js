const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Handler zum Registrieren neuer Benutzer
async function registerHandler(req, res) {
  const { username, password } = req.body;

  // Überprüfe, ob Benutzername und Passwort vorhanden sind
  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Username and password are required." });
  }

  // Überprüfen, ob der Benutzername bereits existiert
  const existingUser = await prisma.users.findUnique({
    where: { username: username },
  });

  if (existingUser) {
    return res.status(StatusCodes.CONFLICT).json({
      error: "Username already exists. Please choose a different username.",
    });
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
    .json({
      message: "User registered successfully.",
      user: { username: newUser.username },
    });
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

module.exports = {
  registerHandler,
  loginHandler,
  logoutHandler,
};
