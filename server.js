const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const CTRADER_WS = "wss://demo.ctraderapi.com:5035";
let ws;

const ACCOUNT_ID = "1234567"; // ← Hier deine echte ID
const ACCESS_TOKEN = "dein_oauth_token"; // ← Hier dein echter Token

function connectToCTrader() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(CTRADER_WS);
    ws.on("open", () => {
      console.log("✅ Verbunden mit cTrader");
      resolve();
    });
    ws.on("message", (msg) => {
      console.log("🔁", msg.toString());
    });
    ws.on("error", (err) => {
      console.error("❌ WebSocket-Fehler:", err);
      reject(err);
    });
  });
}

async function sendMarketOrder({ symbol, volume, side }) {
  const direction = side.toUpperCase() === "BUY" ? 1 : 2;

  const order = {
    payloadType: "CREATE_ORDER",
    payload: {
      accountId: ACCOUNT_ID,
      symbolName: symbol,
      orderType: "MARKET",
      tradeSide: direction,
      volume: volume * 100000,
    },
    token: ACCESS_TOKEN,
  };

  ws.send(JSON.stringify(order));
}

app.post("/trade", async (req, res) => {
  const { symbol, side, volume } = req.body;
  if (!symbol || !side || !volume) {
    return res.status(400).json({ error: "Fehlende Parameter" });
  }

  try {
    if (!ws || ws.readyState !== 1) await connectToCTrader();
    await sendMarketOrder({ symbol, volume, side });
    res.json({ status: "✅ Order gesendet", symbol, side, volume });
  } catch (err) {
    console.error("❌ Fehler:", err);
    res.status(500).json({ error: "Senden fehlgeschlagen" });
  }
});

// 🧠 Ganz wichtig: Diese Route MUSS **vor** app.listen() stehen!
app.get('/callback', (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No code provided");
  }
  res.send(`<h2>Authorization Code erhalten:</h2><p style="font-size:18px;"><strong>${code}</strong></p>`);
});

// ✅ Jetzt ganz am Ende:
app.listen(PORT, () => {
  console.log(`🚀 Proxy-Server läuft auf Port ${PORT}`);
});
