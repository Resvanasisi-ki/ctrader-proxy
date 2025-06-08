const express = require("express");
const axios = require("axios");
const router = express.Router();

const CLIENT_ID = "15441"; // DEIN echter Client ID
const CLIENT_SECRET = "tXqSrzpEXskjGFtmVhHBzJ7vHnINnmS1fQcwDBL1PLPzwj7fQ7"; // DEIN echter Secret
const REDIRECT_URI = "https://ctrader-proxy.onrender.com/callback";

router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Code fehlt");

  try {
    const response = await axios.post("https://connect.spotware.com/api/token", null, {
      params: {
        grant_type: "authorization_code",
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    res.send(`
      <h2>✅ Zugriffstoken erhalten</h2>
      <p><strong>Access Token:</strong> ${access_token}</p>
      <p><strong>Refresh Token:</strong> ${refresh_token}</p>
      <p><strong>Gültig (Sekunden):</strong> ${expires_in}</p>
    `);
  } catch (err) {
    console.error("❌ Fehler beim Token-Abruf:", err.response?.data || err.message);
    res.status(500).send("Token konnte nicht abgerufen werden");
  }
});

module.exports = router;
