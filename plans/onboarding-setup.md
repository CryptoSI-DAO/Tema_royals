# Player & Staff Onboarding — Implementation Plan

## Summary

Set up the full player/staff self-registration and admin approval flow. The admin logs in with specific credentials, sets a keyword for registration access, and players/staff can sign themselves up. Admin approves submissions and toggles active status. Public pages pull live data from Supabase.

## Current State

### Already Built (Frontend)
- **Login page** ([`/login`](src/app/login/page.tsx)) — email/phone + password auth
- **Register page** ([`/register`](src/app/register/page.tsx)) — gate password mechanism, player form, image upload, password
- **Dashboard** ([`/dashboard`](src/app/dashboard/page.tsx)) — role-based with submissions moderation
- **Approve API** ([`approve-submission/route.ts`](src/app/api/admin/approve-submission/route.ts)) — creates auth user + player row
- **Reject API** ([`reject-submission/route.ts`](src/app/api/admin/reject-submission/route.ts)) — marks submission rejected
- **Public pages** — [`/players`](src/app/players/page.tsx), [`/staff`](src/app/staff/page.tsx) pull from Supabase
- **Submissions section** ([`submissions-section.tsx`](src/app/dashboard/components/submissions-section.tsx)) — moderation queue with settings

### Database State (Supabase project: `pianuabczoyqrxnfrbvv`)
- **Existing tables**: profiles, players, staff, owners (4 tables with RLS)
- **Missing tables**: site_settings, player_submissions, fixtures, goals, partnerships, fixture_media, fan_purchases
- **Functions**: has_editor_access, has_role, is_admin, is_admin_or_club, handle_new_user
- **Auth trigger**: NOT wired up — handle_new_user function exists but no trigger on auth.users
- **Storage buckets**: NONE
- **Auth users**: NONE

### What Needs Building
1. Missing database tables + RLS policies
2. Auth trigger wiring
3. Storage bucket for registration uploads
4. Admin user creation
5. Registration page extension for staff role
6. Approval flow extension for staff submissions

---

## Architecture Flow

```mermaid
flowchart TB
    subgraph Admin Setup
        A1[Admin logs in with cryptosi@protonmail.com]
        A2[Admin sets keyword in site_settings]
        A1 --> A2
    end

    subgraph Self-Registration
        B1[Player/Staff visits /register]
        B2[Enters keyword to unlock form]
        B3[Selects role: Player or Staff]
        B4a[Player form: name, position, height, etc.]
        B4b[Staff form: name, role, department, bio]
        B5[Submits with email/phone + password]
        B1 --> B2 --> B3
        B3 --> B4a
        B3 --> B4b
        B4a --> B5
        B4b --> B5
    end

    subgraph Moderation
        C1[Submission enters pending queue]
        C2[Admin reviews in dashboard]
        C3a[Approve: creates auth user + player/staff row]
        C3b[Reject: marks as rejected]
        C1 --> C2
        C2 --> C3a
        C2 --> C3b
    end

    subgraph Public Pages
        D1[/players pulls active players from Supabase]
        D2[/staff pulls active staff from Supabase]
    end

    B5 --> C1
    C3a --> D1
    C3a --> D2
```

---

## Phase 1: Database Setup

### 1a. Create `site_settings` table

```sql
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  club_name text not null default 'Tema Royals SC',
  short_name text,
  primary_color text,
  accent_color text,
  stadium_name text,
  contact_email text,
  contact_phone text,
  registration_open boolean not null default true,
  registration_password text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 1b. Create `player_submissions` table

Extended with `submission_type` column to support both player and staff registrations:

```sql
create table if not exists public.player_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null default 'player' check (submission_type in ('player', 'staff')),
  name text not null,
  email text,
  phone text,
  -- Player fields
  pos text,
  second_pos text,
  height text,
  squad_number integer,
  -- Staff fields
  staff_role text,
  department text,
  bio text,
  -- Common
  image_url text,
  proposed_password text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  reviewer_notes text,
  created_player_id uuid references public.players(id),
  created_staff_id uuid references public.staff(id),
  created_user_id uuid references auth.users(id)
);
```

### 1c. Create remaining tables

Create `fixtures`, `goals`, `partnerships`, `fixture_media`, `fan_purchases` tables as defined in [`database.ts`](src/types/database.ts) types. These are needed by the dashboard queries.

### 1d. Wire up auth trigger

```sql
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 1e. Create storage bucket

```sql
insert into storage.buckets (id, name, public)
values ('registration-uploads', 'registration-uploads', true);

create policy "Public read uploads"
  on storage.objects for select
  using (bucket_id = 'registration-uploads');

create policy "Authenticated upload"
  on storage.objects for insert
  with check (bucket_id = 'registration-uploads' and auth.role() = 'authenticated');
```

### 1f. RLS policies on new tables

```sql
-- site_settings: public read, editor manage
alter table public.site_settings enable row level security;
create policy "Public read site settings" on public.site_settings for select using (true);
create policy "Editors manage site settings" on public.site_settings for all using (has_editor_access()) with check (has_editor_access());

-- player_submissions: public insert, editor read/manage
alter table public.player_submissions enable row level security;
create policy "Public submit registrations" on public.player_submissions for insert with check (true);
create policy "Editors manage submissions" on public.player_submissions for all using (has_editor_access()) with check (has_editor_access());
```

### 1g. Insert initial site_settings

```sql
insert into public.site_settings (club_name, short_name, registration_open)
values ('Tema Royals SC', 'Royals', true);
```

---

## Phase 2: Admin User Setup

Create the admin auth user via Supabase Admin API:

```sql
-- This will be done via the Supabase Auth Admin API in code
-- Email: cryptosi@protonmail.com
-- Password: Talent81
-- Then set profile role to 'admin'
```

This will be executed as a migration or through the Supabase MCP tool.

---

## Phase 3: Extend Registration Page

### Changes to [`/register/page.tsx`](src/app/register/page.tsx)

1. **Add role selector** — Toggle between "Player" and "Staff" after passing the gate
2. **Conditional form fields**:
   - **Player** (existing): name, email, phone, pos, second_pos, height, squad_number, image, password
   - **Staff** (new): name, email, phone, staff_role (e.g., Coach, Manager, Physio), department, bio, image, password
3. **Update submission** — Include `submission_type: 'player' | 'staff'` in the insert

### Staff-specific form fields
- `staff_role` — Required text input (e.g., Head Coach, Assistant Coach, Physiotherapist, Team Manager)
- `department` — Optional text input (e.g., Coaching, Medical, Operations)
- `bio` — Optional textarea

---

## Phase 4: Update Approval Flow

### Changes to [`approve-submission/route.ts`](src/app/api/admin/approve-submission/route.ts)

1. Check `submission_type` on the submission record
2. **If player** (existing flow): create player row with position data
3. **If staff** (new flow): create staff row with role, department, bio
4. Update profile role accordingly ('player' or 'staff')
5. Set `created_staff_id` for staff submissions

### Changes to [`submissions-section.tsx`](src/app/dashboard/components/submissions-section.tsx)

1. Display submission type badge (Player/Staff) in the moderation queue
2. Show type-specific fields in the review/edit dialog
3. Filter tabs: All / Pending Players / Pending Staff

---

## Phase 5: Update TypeScript Types

Update [`database.ts`](src/types/database.ts) to add:
- `submission_type` field to `player_submissions` Row/Insert/Update
- `staff_role`, `department`, `bio` fields to `player_submissions`
- `created_staff_id` field to `player_submissions`

---

## Phase 6: End-to-End Testing

1. Admin login with cryptosi@protonmail.com / Talent81
2. Admin sets registration keyword in dashboard settings
3. Player registers with keyword → submits form
4. Staff registers with keyword → submits form
5. Admin approves both in moderation queue
6. Verify player appears on `/players` page
7. Verify staff appears on `/staff` page
8. Admin toggles `is_active` → verify visibility changes
9. Approved user can log in with their chosen credentials

---

## Files to Modify

| File | Change |
|------|--------|
| [`src/types/database.ts`](src/types/database.ts) | Add submission_type, staff fields to player_submissions |
| [`src/app/register/page.tsx`](src/app/register/page.tsx) | Add role selector, staff form fields, submission_type |
| [`src/app/api/admin/approve-submission/route.ts`](src/app/api/admin/approve-submission/route.ts) | Handle staff submission approval |
| [`src/app/dashboard/components/submissions-section.tsx`](src/app/dashboard/components/submissions-section.tsx) | Display submission type, staff fields in review |

## Database Migrations

All Phase 1 changes will be applied via Supabase migrations using the MCP tool.
