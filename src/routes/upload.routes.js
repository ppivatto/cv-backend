import { Router } from "express";
import multer from "multer";
import { handleUpload } from "../controllers/upload.controller.js";

const router = Router();

// ⬅️ GUARDA EL PDF DIRECTO EN MEMORIA
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), handleUpload);

export default router;
