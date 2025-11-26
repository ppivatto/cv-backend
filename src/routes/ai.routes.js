import { Router } from "express";
import { analyzeText } from "../controllers/ai.controller.js";

const router = Router();

router.post("/analyze", analyzeText);

export default router;