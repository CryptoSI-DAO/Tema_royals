import { z } from "zod";
import type { SupabaseClient } from "../types";
import { nonEmptyString, optionalUrlString } from "./shared";

export type OwnerInput = {
  name: string;
  title: string;
  bio: string | null;
  imageUrl: string;
  email: string | null;
  phone: string | null;
  ownershipStake: string | null;
  joinedDate: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
};

const OwnerInputSchema = z.object({
  name: nonEmptyString,
  title: nonEmptyString,
  bio: z.string().nullable().optional(),
  imageUrl: optionalUrlString,
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  ownershipStake: z.string().nullable().optional(),
  joinedDate: z.string().nullable().optional(),
  websiteUrl: optionalUrlString,
  linkedinUrl: optionalUrlString,
  instagramUrl: optionalUrlString,
});

export async function createOwner(supabase: SupabaseClient, input: OwnerInput) {
  const validated = OwnerInputSchema.parse(input);

  return supabase.from("owners").insert({
    name: validated.name,
    title: validated.title,
    bio: validated.bio || null,
    image_url: validated.imageUrl || null,
    email: validated.email || null,
    phone: validated.phone || null,
    ownership_stake: validated.ownershipStake || null,
    joined_date: validated.joinedDate || null,
    website_url: validated.websiteUrl || null,
    linkedin_url: validated.linkedinUrl || null,
    instagram_url: validated.instagramUrl || null,
    is_active: true,
  });
}

export async function updateOwner(
  supabase: SupabaseClient,
  id: string,
  input: OwnerInput
) {
  const validated = OwnerInputSchema.parse(input);

  return supabase
    .from("owners")
    .update({
      name: validated.name,
      title: validated.title,
      bio: validated.bio || null,
      image_url: validated.imageUrl || null,
      email: validated.email || null,
      phone: validated.phone || null,
      ownership_stake: validated.ownershipStake || null,
      joined_date: validated.joinedDate || null,
      website_url: validated.websiteUrl || null,
      linkedin_url: validated.linkedinUrl || null,
      instagram_url: validated.instagramUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export async function deleteOwner(supabase: SupabaseClient, id: string) {
  return supabase.from("owners").delete().eq("id", id);
}
