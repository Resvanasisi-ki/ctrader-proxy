const express = require("express");
const router = express.Router();

router.get("/callback", (req, res) => {
  const code = req.query.code;
  res.send(`<h2>Code empfangen:</h2><p>${code || "Kein Code vorhanden"}</p>`);
});

module.exports = router;
