const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./auth"); // ← wichtig!

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/", authRoutes); // ← wichtig!

app.get("/", (req, res) => {
  res.send("✅ Proxy-Server läuft");
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy-Server läuft auf Port ${PORT}`);
});
