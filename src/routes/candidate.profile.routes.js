import { Router } from "express";
import { getProfileById } from "../services/db.service.js";

const router = Router();

/**
 * GET /candidate-profile/:id
 * Perfil público (solo si está publicado)
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await getProfileById(id);

    if (!profile || !profile.published) {
      return res.status(404).json({
        success: false,
        error: "Perfil no encontrado",
      });
    }

    return res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("GET_PUBLIC_PROFILE_ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Error interno al obtener el perfil",
    });
  }
});

export default router;
