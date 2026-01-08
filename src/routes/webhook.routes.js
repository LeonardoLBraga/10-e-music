import { Router } from "express";
import { webhookMercadoPago } from "../controllers/webhook.controller.js";
import { validarWebhookMercadoPago } from "../middlewares/mercadopagoWebhook.middleware.js";

const router = Router();

router.post(
  "/",
  validarWebhookMercadoPago,
  webhookMercadoPago
);

export default router;
