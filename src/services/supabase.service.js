import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
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
      contentType: 'application/pdf'
    });

  if (error) throw error;

  // 2) Obtener URL pública (NO async)
  const {
    data: { publicUrl }
  } = supabase.storage
    .from('cv-files')
    .getPublicUrl(fileName);

  // 3) Retornar todo lo útil
  return { ...data, publicUrl };
};
