import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { generateNonce, SiweMessage } from "siwe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory session-like store (for demo purposes, since no persistent DB was opted-in)
  const sessions: Record<string, any> = {};

  // SIWE Nonce
  app.get("/api/nonce", (req, res) => {
    const nonce = generateNonce();
    res.send(nonce);
  });

  // SIWE Verify
  app.post("/api/verify", async (req, res) => {
    try {
      const { message, signature } = req.body;
      const siweMessage = new SiweMessage(message);
      const { data: fields } = await siweMessage.verify({ signature });
      
      // Store user in "session"
      sessions[fields.address] = {
        address: fields.address,
        chainId: fields.chainId,
        loggedInAt: new Date().toISOString(),
      };

      res.json({ ok: true, address: fields.address });
    } catch (e) {
      res.status(400).json({ ok: false, error: String(e) });
    }
  });

  // Analytics Data Mock Endpoints
  app.get("/api/analytics/overview", (req, res) => {
    res.json({
      totalVolume: "$1.2B",
      activeWallets: "45.2K",
      trendingTokens: [
        { name: "ETH", price: "$2,840", change: "+2.4%" },
        { name: "SOL", price: "$145", change: "+5.1%" },
        { name: "POL", price: "$0.42", change: "-1.2%" },
      ],
      ecosystemGrowth: [
        { name: "Ethereum", value: 85 },
        { name: "Solana", value: 92 },
        { name: "Base", value: 120 },
        { name: "Polygon", value: 78 },
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
