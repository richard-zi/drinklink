const { StatusCodes } = require("http-status-codes");

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

module.exports = {
  isAuthenticated,
  asyncHandler,
};
