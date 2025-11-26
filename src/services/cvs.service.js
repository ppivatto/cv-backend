import { supabase } from "./supabase.service.js";

export const saveCvRecord = async ({ user_id = null, file_url, text }) => {
  try {
    const { data, error } = await supabase
      .from("cvs")
      .insert([{ user_id, file_url, text }])
      .select()
      .single();

    if (error) throw error;

    return data;

  } catch (err) {
    console.error("Save CV Error:", err);
    throw err;
  }
};

export const getAllCvs = async () => {
  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};