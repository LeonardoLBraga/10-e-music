import express from "express";
import { comprarIngresso } from "../controllers/comprar.controller.js";

const router = express.Router();
router.post("/", comprarIngresso);

export default router;
