const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/callback", (req, res) => {
  const code = req.query.code || "Kein Code übergeben";
  res.send(`<h2>Authorization Code erhalten:</h2><p><strong>${code}</strong></p>`);
});

app.listen(PORT, () => {
  console.log(`🚀 Test-Server läuft auf Port ${PORT}`);
});
