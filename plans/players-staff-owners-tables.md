# Players, Staff & Owners — Table Schema Plan

## Overview

Create three tables in the Tema Royals Supabase project (`pianuabczoyqrxnfrbvv`): `players`, `staff`, and `owners`. All tables include RLS policies following the existing pattern.

---

## `players` Table

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | Full name |
| `pos` | `text` | NOT NULL | Primary position |
| `second_pos` | `text` | nullable | Secondary position |
| `squad_number` | `integer` | nullable | Jersey number |
| `height_cm` | `integer` | nullable | Height in cm |
| `weight_kg` | `integer` | nullable | Weight in kg |
| `date_of_birth` | `date` | nullable | |
| `nationality` | `text` | nullable | |
| `languages_spoken` | `text[]` | nullable, default `'{}'` | Array of languages |
| `foot` | `text` | nullable, CHECK IN ('Left','Right','Both') | Enum |
| `image_url` | `text` | nullable | Profile photo |
| `joined_date` | `date` | nullable | When they joined |
| `previous_club` | `text` | nullable | Last club |
| `bio` | `text` | nullable | Short biography |
| `favourite_song` | `text` | nullable | Walkout / favourite song |
| `instagram_url` | `text` | nullable | Instagram link |
| `facebook_url` | `text` | nullable | Facebook link |
| `is_active` | `boolean` | NOT NULL, default `true` | Currently in squad? |
| `user_id` | `uuid` | nullable, FK → auth.users | Login account link |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |

---

## `staff` Table

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | Full name |
| `role` | `text` | NOT NULL | e.g. Head Coach, Physio |
| `department` | `text` | nullable | Free text — Coaching, Medical, etc. |
| `bio` | `text` | nullable | Background / qualifications |
| `image_url` | `text` | nullable | Profile photo |
| `email` | `text` | nullable | Contact email |
| `phone` | `text` | nullable | Contact phone |
| `nationality` | `text` | nullable | |
| `languages_spoken` | `text[]` | nullable, default `'{}'` | Array of languages |
| `joined_date` | `date` | nullable | When they joined |
| `is_active` | `boolean` | NOT NULL, default `true` | Currently active? |
| `user_id` | `uuid` | nullable, FK → auth.users | Login account link |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |

---

## `owners` Table

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | Full name |
| `title` | `text` | NOT NULL | e.g. Chairman, CEO, Director |
| `bio` | `text` | nullable | Background / role description |
| `image_url` | `text` | nullable | Profile photo |
| `email` | `text` | nullable | Contact email |
| `phone` | `text` | nullable | Contact phone |
| `ownership_stake` | `text` | nullable | e.g. 51% |
| `joined_date` | `date` | nullable | When they joined the board |
| `website_url` | `text` | nullable | Personal/company website |
| `linkedin_url` | `text` | nullable | LinkedIn profile |
| `instagram_url` | `text` | nullable | Instagram profile |
| `is_active` | `boolean` | NOT NULL, default `true` | Currently involved? |
| `user_id` | `uuid` | nullable, FK → auth.users | Login account link |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |

---

## Entity Relationship Diagram

```mermaid
erDiagram
    auth_users ||o--o| players : user_id
    auth_users ||o--o| staff : user_id
    auth_users ||o--o| owners : user_id

    players {
        uuid id PK
        text name
        text pos
        text second_pos
        integer squad_number
        integer height_cm
        integer weight_kg
        date date_of_birth
        text nationality
        text_array languages_spoken
        text foot
        text image_url
        date joined_date
        text previous_club
        text bio
        text favourite_song
        text instagram_url
        text facebook_url
        boolean is_active
        uuid user_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    staff {
        uuid id PK
        text name
        text role
        text department
        text bio
        text image_url
        text email
        text phone
        text nationality
        text_array languages_spoken
        date joined_date
        boolean is_active
        uuid user_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    owners {
        uuid id PK
        text name
        text title
        text bio
        text image_url
        text email
        text phone
        text ownership_stake
        date joined_date
        text website_url
        text linkedin_url
        text instagram_url
        boolean is_active
        uuid user_id FK
        timestamptz created_at
        timestamptz updated_at
    }
```

---

## RLS Strategy

Following the existing pattern from `docs/supabase/02-schema-and-rls.md`:

- **Public**: SELECT on all three tables — public roster pages
- **Editors** (admin, club, creator roles): INSERT, UPDATE, DELETE
- **Owners**: Full access via their user_id link

---

## Migration SQL

All three tables will be created in a single migration. The SQL will:

1. Create `players` table with all columns and constraints
2. Create `staff` table with all columns and constraints
3. Create `owners` table with all columns and constraints
4. Enable RLS on all three tables
5. Create public SELECT policies
6. Create editor management policies

---

## Post-Migration Tasks

After the tables are created:

1. Update `src/types/database.ts` to include the new `owners` table type and updated `players`/`staff` types
2. Update `src/lib/team-site-data.ts` data loaders
3. Update dashboard components for the new fields
4. Add an `owners` section to the dashboard
5. Create a public owners/board page
