import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export const uploadToSupabase = async (filePath, fileBuffer) => {
  const fileName = filePath.split('/').pop(); // nombre del archivo

  // 1) Subir archivo
  const { data, error } = await supabase.storage
    .from('cv-files')
    .upload(fileName, fileBuffer, {
      upsert: true,
      contentType: getMimeType(fileName)
    });

  if (error) throw error;

  // 2) Obtener URL pública (NO async)
  const {
    data: { publicUrl }
  } = supabase.storage
    .from('cv-files')
    .getPublicUrl(fileName);

  function getMimeType(name) {
  const ext = name.toLowerCase().split(".").pop();
  switch (ext) {
    case "pdf": return "application/pdf";
    case "doc": return "application/msword";
    case "docx": 
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "txt": return "text/plain";
    default: return "application/octet-stream";
  }
}  

  // 3) Retornar todo lo útil
  return { ...data, publicUrl };
};
