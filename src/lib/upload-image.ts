import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "team-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Upload an image file to the `team-images` Supabase Storage bucket.
 *
 * @param supabase  An authenticated Supabase client
 * @param file      The File object chosen by the user
 * @param folder    Sub-folder prefix, e.g. "players", "staff", "owners", "partners"
 * @returns         `{ url: string }` on success, or `{ error: string }` on failure
 */
export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  folder: string
): Promise<{ url: string | null; error: string | null }> {
  // Validate MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      url: null,
      error: `Unsupported file type "${file.type}". Use JPEG, PNG, or WebP.`,
    };
  }

  // Validate file size
  if (file.size > MAX_SIZE_BYTES) {
    return {
      url: null,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`,
    };
  }

  // Build a unique path: {folder}/{uuid}.{ext}
  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl, error: null };
}
