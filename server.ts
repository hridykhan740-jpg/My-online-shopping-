import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "E-commerce API is active" });
  });

  // bKash Payment Simulation
  app.post("/api/payments/bkash/create", (req, res) => {
    const { amount, orderId } = req.body;
    res.json({
      success: true,
      paymentID: `BKASH_${Math.random().toString(36).substring(7)}`,
      bkashURL: "/payment-simulation/bkash"
    });
  });

  // Nagad Payment Simulation
  app.post("/api/payments/nagad/create", (req, res) => {
    const { amount, orderId } = req.body;
    res.json({
      success: true,
      paymentID: `NAGAD_${Math.random().toString(36).substring(7)}`,
      nagadURL: "/payment-simulation/nagad"
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
    console.log(`NovaMart Server running on http://localhost:${PORT}`);
  });
}

startServer();
