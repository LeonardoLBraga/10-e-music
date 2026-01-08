import { Router } from "express";
import { getStatusPedido } from "../controllers/pedido.controller.js";

const router = Router();

router.get("/", getStatusPedido);

export default router;
