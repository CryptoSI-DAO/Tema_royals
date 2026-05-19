import { z } from "zod";
import type { SupabaseClient } from "../types";
import { nonEmptyString, optionalUrlString } from "./shared";

export type StaffInput = {
  name: string;
  role: string;
  department: string | null;
  bio: string | null;
  imageUrl: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  languagesSpoken: string[];
  joinedDate: string | null;
};

const StaffInputSchema = z.object({
  name: nonEmptyString,
  role: nonEmptyString,
  department: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  imageUrl: optionalUrlString,
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  languagesSpoken: z.array(z.string()).optional(),
  joinedDate: z.string().nullable().optional(),
});

export async function createStaff(supabase: SupabaseClient, input: StaffInput) {
  const validated = StaffInputSchema.parse(input);

  return supabase.from("staff").insert({
    name: validated.name,
    role: validated.role,
    department: validated.department || null,
    bio: validated.bio || null,
    image_url: validated.imageUrl || null,
    email: validated.email || null,
    phone: validated.phone || null,
    nationality: validated.nationality || null,
    languages_spoken: validated.languagesSpoken ?? [],
    joined_date: validated.joinedDate || null,
    is_active: true,
  });
}

export async function updateStaff(
  supabase: SupabaseClient,
  id: string,
  input: StaffInput
) {
  const validated = StaffInputSchema.parse(input);

  return supabase
    .from("staff")
    .update({
      name: validated.name,
      role: validated.role,
      department: validated.department || null,
      bio: validated.bio || null,
      image_url: validated.imageUrl || null,
      email: validated.email || null,
      phone: validated.phone || null,
      nationality: validated.nationality || null,
      languages_spoken: validated.languagesSpoken ?? [],
      joined_date: validated.joinedDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export async function deleteStaff(supabase: SupabaseClient, id: string) {
  return supabase.from("staff").delete().eq("id", id);
}
