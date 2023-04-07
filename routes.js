const express = require("express");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
}

function asyncHandler(handler) {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}

async function registerHandler(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Username and password are required." });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

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

async function loginHandler(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Username and password are required." });
  }

  const user = await prisma.users.findUnique({
    where: { username: username },
  });

  if (!user) {
    console.log(`Invalid login attempt: ${username}`);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid username or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log(`Invalid login attempt: ${username}`);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid username or password." });
  }

  console.log(`Successful login: ${username}`);
  req.session.userId = user.id;
  res.status(StatusCodes.OK).json({
    message: "Login successful",
    user: { id: user.id, username: user.username },
  });
}

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

async function bookHandler(req, res) {
  const { date, time, people } = req.body;
  const userId = req.session.userId;

  const newBooking = await prisma.booking.create({
    data: {
      date: new Date(date),
      time: new Date(time),
      people: people,
      userId: userId,
    },
  });

  console.log(`Booking created successfully: ${newBooking.id}`);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Booking created successfully.", booking: newBooking });
}

async function getUserBookingsHandler(req, res) {
  const userId = req.session.userId;

  const bookings = await prisma.booking.findMany({
    where: { userId: userId },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  res.status(StatusCodes.OK).json({ bookings });
}

// Füge die Routen mit asyncHandler hinzu
router.post("/register", asyncHandler(registerHandler));
router.post("/login", asyncHandler(loginHandler));
router.post("/logout", logoutHandler);
router.get("/protected", isAuthenticated, (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Protected route accessed" });
});
router.post("/book", isAuthenticated, asyncHandler(bookHandler));
router.get("/bookings", isAuthenticated, asyncHandler(getUserBookingsHandler));

// Error-Handling-Middleware
router.use((err, req, res, next) => {
  console.error(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Server error, please try again." });
});

module.exports = router;
