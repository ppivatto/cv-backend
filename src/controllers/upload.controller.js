import { uploadToSupabase } from "../services/supabase.service.js";
import { extractText } from "../services/extract.service.js";

export const handleUpload = async (req, res) => {
  try {
    const fileName = req.file.originalname;
    const fileBuffer = req.file.buffer;

    // 1) Extraer texto del archivo
    const extractedText = await extractText(fileName, fileBuffer);

    // 2) Subir el archivo a Supabase
    const data = await uploadToSupabase(fileName, fileBuffer);

    res.status(200).json({
      success: true,
      message: "Upload + extract success",
      supabase: data,
      text: extractedText,
    });

  } catch (error) {
    res.status(500).json({ error: "Upload/extract error" });
  }
};
