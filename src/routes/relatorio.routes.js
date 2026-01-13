import express from "express";
import { adminAuth } from "../middlewares/relatorioAuth.js";
import { exportarIngressosExcel } from "../controllers/relatorio.controller.js";

const router = express.Router();

router.get("/ingressos/excel", adminAuth, exportarIngressosExcel);

export default router;