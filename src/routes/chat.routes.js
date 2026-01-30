import { Router } from "express";
import {
  recruiterChat,
  getChatHistory,
  recruiterSuggestions,
} from "../controllers/chat.controller.js";

const router = Router();

/**
 * POST /chat/recruiter/:profileId
 * Body: { message: "pregunta del reclutador" }
 */
router.post("/recruiter/:profileId", recruiterChat);

/**
 * GET /chat/:profileId/history
 * Devuelve el historial completo del chat
 */
router.get("/:profileId/history", getChatHistory);

router.post("/recruiter/:profileId/suggestions", recruiterSuggestions);

export default router;