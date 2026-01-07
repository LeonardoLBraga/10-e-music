import express from "express";
import { getEstoque } from "../controllers/estoque.controller.js";

const router = express.Router();
router.get("/", getEstoque);

export default router;
