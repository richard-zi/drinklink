// Importiere benötigte Module und erstelle eine neue Express-Router-Instanz
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { isAuthenticated, asyncHandler } = require("./middleware");
const { registerHandler, loginHandler, logoutHandler } = require("./handler/authHandler");
const { createBookingHandler } = require("./handler/bookingHandler");
const { updateUserHandler, getCurrentUserHandler, setBarOwnerStatusHandler} = require("./handler/userHandler");
const { createBarHandler, updateBarHandler, getBarHandler, deleteBarHandler, } = require("./handler/barHandler");

const router = express.Router();

// Routen mit asyncHandler hinzu
// authHandler routes
router.post("/signup", asyncHandler(registerHandler));
router.post("/login", asyncHandler(loginHandler));
router.post("/logout", logoutHandler);

// bookingHandler routes
router.post("/booking", isAuthenticated, asyncHandler(createBookingHandler));

// userHandler routes
router.put("/user", isAuthenticated, asyncHandler(updateUserHandler));
router.get("/current-user", asyncHandler(getCurrentUserHandler));
router.put("/set-bar-owner-status", isAuthenticated, asyncHandler(setBarOwnerStatusHandler));

// barHandler routes
router.post("/bar", isAuthenticated, asyncHandler(createBarHandler));
router.put("/bar/:id", isAuthenticated, asyncHandler(updateBarHandler));
router.get("/bar", isAuthenticated, asyncHandler(getBarHandler));
router.delete("/bar/:id", isAuthenticated, asyncHandler(deleteBarHandler));

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
