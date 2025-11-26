import express from "express";
import { saveCvRecord } from "../services/cvs.service.js";

const router = express.Router();

// POST /cvs/save
router.post("/save", async (req, res) => {
  try {
    const { user_id, file_url, text } = req.body;

    if (!file_url || !text) {
      return res.status(400).json({
        success: false,
        message: "file_url y text son obligatorios.",
      });
    }

    const result = await saveCvRecord({ user_id, file_url, text });

    return res.json({
      success: true,
      message: "CV guardado correctamente",
      data: result,
    });

  } catch (error) {
    console.error("ERROR /cvs/save =>", error);
    return res.status(500).json({
      success: false,
      message: "Error guardando CV",
      error: error.message,
    });
  }
});

export default router;