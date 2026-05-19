import { z } from "zod";
import type { SupabaseClient } from "../types";
import { nonEmptyString, optionalUrlString } from "./shared";

export type PlayerInput = {
  name: string;
  pos: string;
  secondPos: string;
  squadNumber: number | null;
  heightCm: number | null;
  weightKg: number | null;
  dateOfBirth: string | null;
  nationality: string | null;
  languagesSpoken: string[];
  foot: "Left" | "Right" | "Both" | null;
  imageUrl: string;
  joinedDate: string | null;
  previousClub: string | null;
  bio: string | null;
  favouriteSong: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
};

const PlayerInputSchema = z.object({
  name: nonEmptyString,
  pos: nonEmptyString,
  secondPos: z.string(),
  squadNumber: z.number().nullable().optional(),
  heightCm: z.number().nullable().optional(),
  weightKg: z.number().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  languagesSpoken: z.array(z.string()).optional(),
  foot: z.enum(["Left", "Right", "Both"]).nullable().optional(),
  imageUrl: optionalUrlString,
  joinedDate: z.string().nullable().optional(),
  previousClub: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  favouriteSong: z.string().nullable().optional(),
  instagramUrl: optionalUrlString,
  facebookUrl: optionalUrlString,
});

export async function createPlayer(supabase: SupabaseClient, input: PlayerInput) {
  const validated = PlayerInputSchema.parse(input);

  return supabase.from("players").insert({
    name: validated.name,
    pos: validated.pos,
    second_pos: validated.secondPos || null,
    squad_number: validated.squadNumber ?? null,
    height_cm: validated.heightCm ?? null,
    weight_kg: validated.weightKg ?? null,
    date_of_birth: validated.dateOfBirth || null,
    nationality: validated.nationality || null,
    languages_spoken: validated.languagesSpoken ?? [],
    foot: validated.foot ?? null,
    image_url: validated.imageUrl || null,
    joined_date: validated.joinedDate || null,
    previous_club: validated.previousClub || null,
    bio: validated.bio || null,
    favourite_song: validated.favouriteSong || null,
    instagram_url: validated.instagramUrl || null,
    facebook_url: validated.facebookUrl || null,
    is_active: true,
  });
}

export async function updatePlayer(
  supabase: SupabaseClient,
  id: string,
  input: PlayerInput
) {
  const validated = PlayerInputSchema.parse(input);

  return supabase
    .from("players")
    .update({
      name: validated.name,
      pos: validated.pos,
      second_pos: validated.secondPos || null,
      squad_number: validated.squadNumber ?? null,
      height_cm: validated.heightCm ?? null,
      weight_kg: validated.weightKg ?? null,
      date_of_birth: validated.dateOfBirth || null,
      nationality: validated.nationality || null,
      languages_spoken: validated.languagesSpoken ?? [],
      foot: validated.foot ?? null,
      image_url: validated.imageUrl || null,
      joined_date: validated.joinedDate || null,
      previous_club: validated.previousClub || null,
      bio: validated.bio || null,
      favourite_song: validated.favouriteSong || null,
      instagram_url: validated.instagramUrl || null,
      facebook_url: validated.facebookUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export async function deletePlayer(supabase: SupabaseClient, id: string) {
  return supabase.from("players").delete().eq("id", id);
}
