const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, (req, res) => {
  // ...
});

module.exports = router;
