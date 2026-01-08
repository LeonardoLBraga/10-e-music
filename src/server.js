import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import comprarRoutes from "./routes/comprar.routes.js";
import estoqueRoutes from "./routes/estoque.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import pedidoRoutes from "./routes/pedido.routes.js";

import { inicializarEstoque } from "./repositories/estoque.repository.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// CORS CONFIG
// ======================

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://one0-e-music.onrender.com"
];
//trocar aqui pela URL da sua API em produção

app.use(cors({
  origin: (origin, callback) => {
    // Permite Postman, webhook Mercado Pago, etc
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
}));

app.use(express.json());
app.use(express.static("public"));

await inicializarEstoque(process.env.INGRESSO_TOTAL);

app.use("/api/comprar", comprarRoutes);
app.use("/api/estoque", estoqueRoutes);
app.use("/webhook/mercadopago", webhookRoutes);
app.use("/api/pedido/status", pedidoRoutes);


app.use((req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});


app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Servidor iniciado com sucesso");
  console.log("=================================");
  console.log("🌍 Ambiente:", process.env.NODE_ENV || "development");
  console.log("🌐 Porta:", PORT);
  console.log("🔗 Backend:", process.env.BACKEND_URL);
  console.log("🖥️ Frontend:", process.env.FRONTEND_URL);
  console.log("💰 Preço ingresso:", process.env.INGRESSO_PRECO);
  console.log("🎟️ Ingresso total:", process.env.INGRESSO_TOTAL);
  console.log(
    "💳 Mercado Pago:",
    process.env.MP_ACCESS_TOKEN ? "OK" : "❌ NÃO CONFIGURADO"
  );
  console.log("🔔 Webhook: /webhook/mercadopago");
  console.log("=================================");
});

