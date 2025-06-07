const express = require("express");
const axios = require("axios");
const open = require("open");

const app = express();
const port = process.env.PORT || 3000;

// Spotware credentials
const CLIENT_ID = "DEINE_CLIENT_ID_HIER";
const CLIENT_SECRET = "DEIN_CLIENT_SECRET_HIER";
const REDIRECT_URI = "https://ctrader-proxy.onrender.com/callback";

app.get("/auth", (req, res) => {
  const authUrl = `https://connect.spotware.com/apps/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=trading`;
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) return res.send("❌ Kein Code vorhanden.");

  try {
    const tokenResponse = await axios.post("https://connect.spotware.com/apps/token", null, {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });

    const { access_token } = tokenResponse.data;

    // Hole die Accounts
    const accounts = await axios.get("https://api.spotware.com/connect/tradingaccounts", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const account = accounts.data[0];

    res.send(`
      ✅ <b>Access Token:</b> ${access_token}<br>
      🆔 <b>Account ID:</b> ${account.ctidTraderAccountId}
    `);
  } catch (error) {
    res.send("❌ Fehler beim Token-Tausch: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`OAuth App läuft auf Port ${port}`);
  open(`http://localhost:${port}/auth`);
});
