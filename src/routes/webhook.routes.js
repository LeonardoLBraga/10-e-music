import { Router } from "express";
import { webhookMercadoPago } from "../controllers/webhook.controller.js";

const router = Router();
router.post("/", webhookMercadoPago);

export default router;
