const express = require("express");
const router = express.Router();

// GET TODAY'S MENU
router.get("/", (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
