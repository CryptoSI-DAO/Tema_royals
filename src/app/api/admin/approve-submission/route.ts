import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { z } from "zod";
import type { Database } from "@/types/database";

const PlayerEditedFieldsSchema = z.object({
  name: z.string().min(1).optional(),
  pos: z.string().min(1).optional(),
  second_pos: z.string().nullable().optional(),
  height: z.string().nullable().optional(),
  squad_number: z.number().int().min(1).max(99).nullable().optional(),
  image_url: z.string().url().nullable().optional(),
});

const StaffEditedFieldsSchema = z.object({
  name: z.string().min(1).optional(),
  staff_role: z.string().min(1).optional(),
  department: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
});

const ApproveRequestSchema = z.object({
  submission_id: z.string().uuid("submission_id must be a valid UUID."),
  edited_fields: z.union([PlayerEditedFieldsSchema, StaffEditedFieldsSchema]).optional(),
});

export async function POST(request: Request) {
  try {
    // ── 1. Parse & validate input ──────────────────────────────────────────
    const parsed = ApproveRequestSchema.safeParse(
      await request.json().catch(() => null)
    );

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request body." },
        { status: 400 }
      );
    }

    const { submission_id: submissionId, edited_fields: editedFields } =
      parsed.data;

    // ── 2. Verify caller is admin or club ────────────────────────────────────
    const cookieStore = await cookies();

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {
            // Server-side API routes don't need to set cookies
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return Response.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!callerProfile || !["admin", "club"].includes(callerProfile.role)) {
      return Response.json(
        { error: "Only admins and club staff can approve submissions." },
        { status: 403 }
      );
    }

    // ── 3. Fetch submission with service role ────────────────────────────────
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return Response.json(
        { error: "Server misconfiguration: service role key not set." },
        { status: 500 }
      );
    }

    const adminClient = createAdminClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    const { data: submission, error: fetchError } = await adminClient
      .from("player_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      return Response.json(
        { error: "Submission not found." },
        { status: 404 }
      );
    }

    if (submission.status !== "pending") {
      return Response.json(
        { error: `Submission is already ${submission.status}.` },
        { status: 400 }
      );
    }

    // ── 4. Create auth user ──────────────────────────────────────────────────
    const userEmail = submission.email || null;
    const userPhone = submission.phone || null;

    if (!userEmail && !userPhone) {
      return Response.json(
        { error: "Submission has neither email nor phone." },
        { status: 400 }
      );
    }

    if (!submission.proposed_password) {
      return Response.json(
        { error: "Submission has no password — it may have already been processed." },
        { status: 400 }
      );
    }

    const createParams: Parameters<typeof adminClient.auth.admin.createUser>[0] = {
      password: submission.proposed_password,
      email_confirm: true,
      phone_confirm: true,
    };

    if (userEmail) {
      createParams.email = userEmail;
    }
    if (userPhone) {
      createParams.phone = userPhone;
    }

    const { data: newUser, error: createError } =
      await adminClient.auth.admin.createUser(createParams);

    if (createError) {
      return Response.json(
        { error: `Failed to create user: ${createError.message}` },
        { status: 400 }
      );
    }

    // ── 5. Determine submission type and create the appropriate record ────────
    const isStaff = submission.submission_type === "staff";
    const targetRole = isStaff ? "staff" : "player";
    const resolvedName = editedFields?.name || submission.name;

    // Update profile role
    const { error: profileError } = await adminClient
      .from("profiles")
      .update({
        role: targetRole,
        full_name: resolvedName,
      })
      .eq("id", newUser.user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
      // Continue — profile exists with role=fan, can be updated later
    }

    if (isStaff) {
      // ── 5a. Create staff row ──────────────────────────────────────────────
      const staffEdited = editedFields as z.infer<typeof StaffEditedFieldsSchema> | undefined;

      const { data: newStaff, error: staffError } = await adminClient
        .from("staff")
        .insert({
          name: resolvedName,
          role: staffEdited?.staff_role || submission.staff_role || "Staff",
          department: staffEdited?.department ?? submission.department ?? null,
          bio: staffEdited?.bio ?? submission.bio ?? null,
          image_url: staffEdited?.image_url ?? submission.image_url,
          email: submission.email,
          phone: submission.phone,
          user_id: newUser.user.id,
          is_active: true,
        })
        .select("id")
        .single();

      if (staffError || !newStaff) {
        console.error("Staff creation error:", staffError);
        await adminClient.auth.admin.deleteUser(newUser.user.id);
        return Response.json(
          { error: `Staff creation failed — user rolled back: ${staffError?.message}` },
          { status: 500 }
        );
      }

      // Update submission status
      const { error: updateError } = await adminClient
        .from("player_submissions")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: session.user.id,
          created_staff_id: newStaff.id,
          created_user_id: newUser.user.id,
          proposed_password: null,
          ...(staffEdited?.name && { name: staffEdited.name }),
          ...(staffEdited?.staff_role && { staff_role: staffEdited.staff_role }),
          ...(staffEdited?.department !== undefined && { department: staffEdited.department }),
          ...(staffEdited?.bio !== undefined && { bio: staffEdited.bio }),
          ...(staffEdited?.image_url !== undefined && { image_url: staffEdited.image_url }),
        })
        .eq("id", submissionId);

      if (updateError) {
        console.error("Submission update error:", updateError);
      }

      return Response.json(
        {
          success: true,
          staff: {
            id: newStaff.id,
            name: resolvedName,
            user_id: newUser.user.id,
          },
          identifier: userEmail || userPhone,
        },
        { status: 200 }
      );
    } else {
      // ── 5b. Create player row ──────────────────────────────────────────────
      const playerEdited = editedFields as z.infer<typeof PlayerEditedFieldsSchema> | undefined;
      const playerPos = playerEdited?.pos || submission.pos;

      if (!playerPos) {
        await adminClient.auth.admin.deleteUser(newUser.user.id);
        return Response.json(
          { error: "Player submission has no position specified." },
          { status: 400 }
        );
      }

      const rawHeight = playerEdited?.height ?? submission.height;
      const parsedHeightCm = rawHeight ? parseInt(rawHeight, 10) : null;

      const { data: newPlayer, error: playerError } = await adminClient
        .from("players")
        .insert({
          name: resolvedName,
          pos: playerPos,
          second_pos: playerEdited?.second_pos ?? submission.second_pos,
          height_cm: isNaN(parsedHeightCm as number) ? null : parsedHeightCm,
          image_url: playerEdited?.image_url ?? submission.image_url,
          squad_number: playerEdited?.squad_number ?? submission.squad_number,
          user_id: newUser.user.id,
          is_active: true,
        })
        .select("id")
        .single();

      if (playerError || !newPlayer) {
        console.error("Player creation error:", playerError);
        await adminClient.auth.admin.deleteUser(newUser.user.id);
        return Response.json(
          { error: `Player creation failed — user rolled back: ${playerError?.message}` },
          { status: 500 }
        );
      }

      // Update submission status
      const { error: updateError } = await adminClient
        .from("player_submissions")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: session.user.id,
          created_player_id: newPlayer.id,
          created_user_id: newUser.user.id,
          proposed_password: null,
          ...(playerEdited?.name && { name: playerEdited.name }),
          ...(playerEdited?.pos && { pos: playerEdited.pos }),
          ...(playerEdited?.second_pos !== undefined && { second_pos: playerEdited.second_pos }),
          ...(playerEdited?.height !== undefined && { height: playerEdited.height }),
          ...(playerEdited?.squad_number !== undefined && { squad_number: playerEdited.squad_number }),
          ...(playerEdited?.image_url !== undefined && { image_url: playerEdited.image_url }),
        })
        .eq("id", submissionId);

      if (updateError) {
        console.error("Submission update error:", updateError);
      }

      return Response.json(
        {
          success: true,
          player: {
            id: newPlayer.id,
            name: resolvedName,
            user_id: newUser.user.id,
          },
          identifier: userEmail || userPhone,
        },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("approve-submission API error:", err);
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
