import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export const uploadToSupabase = async (filePath, fileBuffer, userId = "anon") => {
  try {
    const fileName = filePath.split("/").pop();      // ← ahora SI existe
    const safeUserId = String(userId).trim() || "anon";

    // ej: "pablopivatto/1732750000000-CV.pdf"
    const storedPath = `${safeUserId}/${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from("cv-files")
      .upload(storedPath, fileBuffer, {
        upsert: true,
        contentType: getMimeType(fileName)
      });

    if (error) throw error;

    // obtener url pública
    const { data: publicUrlData } = supabase.storage
      .from("cv-files")
      .getPublicUrl(storedPath);

    const publicUrl = publicUrlData.publicUrl;

    return { ...data, publicUrl, path: storedPath };
  } catch (err) {
    console.error("Supabase upload error:", err);
    throw err;
  }
};

function getMimeType(name) {
  const ext = name.toLowerCase().split(".").pop();
  switch (ext) {
    case "pdf": return "application/pdf";
    case "doc": return "application/msword";
    case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "txt": return "text/plain";
    default: return "application/octet-stream";
  }
}
