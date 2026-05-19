# Tema Royals Image Plan

This file tracks the image assets needed to make this Tema Royals site feel complete and specific to the club.

The site currently uses two real uploaded brand assets:

- `public/temaroyalslogo.jpg`
- `public/temahero.png`

Most other public-facing imagery still comes from placeholder URLs in `src/lib/placeholder-images.json` or seeded player/staff URLs in `src/lib/team-site-data.ts`. Replace those placeholders with approved Tema Royals photography and product assets as they become available.

## Current Image Usage

| Area | Current source | Used by | Status |
| --- | --- | --- | --- |
| Navbar logo | `public/temaroyalslogo.jpg` | `src/components/navbar.tsx` | Real asset in use |
| Footer logo | `public/temaroyalslogo.jpg` | `src/components/footer-content.tsx` | Real asset in use |
| Metadata icon | `public/temaroyalslogo.jpg` | `src/app/layout.tsx` | Real asset in use |
| Home hero | `public/temahero.png` via `hero-stadium` in `src/lib/placeholder-images.json` | `src/app/page.tsx` | Real asset in use |
| Home shop tile | `public/TemaRoyalsJersey.png` | `src/app/page.tsx` | Real asset in use |
| Home squad tile | `player-2` in `src/lib/placeholder-images.json` | `src/app/page.tsx` | Placeholder |
| Partnership feature image | `public/temahero.png` via `hero-stadium` in `src/lib/placeholder-images.json` | `src/app/partnership/page.tsx` | Real asset in use |
| Merch jersey image | `public/TemaRoyalsJersey.png` | `src/app/merch/page.tsx` | Real asset in use |
| Merch away kit image | `public/TemaRoyalsAwaykit.png` | `src/app/merch/page.tsx` | Real asset in use |
| Merch cap image | `public/temaroyalscap.png` | `src/app/merch/page.tsx` | Real asset in use |
| Player cards | `imageUrl` on player records | `src/app/players/page.tsx`, dashboard | Placeholder until real player records are updated |
| Staff cards | `imageUrl` on staff records | `src/app/staff/page.tsx`, dashboard | Placeholder until real staff records are updated |

## Naming Rules

- Use lowercase filenames.
- Use hyphens instead of spaces.
- Prefer `.jpg` for photography.
- Prefer `.png` for transparent logos.
- Keep one final approved version per filename.
- Avoid screenshots, WhatsApp exports, and social-media-compressed images.

## Recommended Public Structure

```text
public/images/branding/
public/images/home/
public/images/merch/
public/images/partnership/
public/images/tickets/
public/images/contact/
public/images/fixtures/
public/images/sponsors/
```

The current logo can stay at `public/temaroyalslogo.jpg`, but future brand assets should use the structured folders above.

## Brand Assets

| Filename | Suggested size | Priority | Description |
| --- | --- | --- | --- |
| `temaroyalslogo.jpg` | 960x960 | Done | Current crest used by navbar, footer, and metadata. |
| `images/branding/tema-royals-crest-transparent.png` | 1200x1200 | High | Transparent-background crest for cleaner use on colored sections and merchandise layouts. |
| `images/branding/tema-royals-crest-white.png` | 1200x1200 | Medium | One-color white crest for dark photo overlays. |
| `images/branding/tema-royals-wordmark-blue.png` | 2000x600 | Medium | Horizontal wordmark for wide placements. |
| `images/branding/favicon-512.png` | 512x512 | Medium | Simplified icon for browser/app usage. The current JPEG works, but a crisp square PNG would be better. |
| `images/branding/og-default.jpg` | 1200x630 | Medium | Default social sharing card using the crest, blue/white identity, and a football image. |

## Home Page Assets

| Filename | Suggested size | Replaces | Description |
| --- | --- | --- | --- |
| `images/home/home-hero-stadium.jpg` | 2400x1400 | `hero-stadium` placeholder | Wide matchday or training-ground image representing Tema Royals. Needs clear negative space for the hero headline. |
| `images/home/home-hero-mobile.jpg` | 1200x1600 | Optional mobile crop | Vertical version of the hero image so the important subject stays visible on phones. |
| `images/home/home-shop-tile.jpg` | 1600x1200 | `merch-kit` placeholder on homepage | Product-led image of a Tema Royals shirt, scarf, or official merchandise. |
| `images/home/home-squad-tile.jpg` | 1600x1200 | `player-2` placeholder on homepage | Strong player or squad image for the “Meet the squad” tile. |
| `images/home/home-social-instagram-placeholder.jpg` | 1080x1080 | Social placeholder block | Branded square graphic for Instagram feed empty state. |
| `images/home/home-social-x-placeholder.jpg` | 1600x900 | Social placeholder block | Branded X/Twitter graphic for feed empty state. |

## Players And Staff

Player and staff imagery is data-driven through `imageUrl` fields, not fixed filenames. For local assets, use these conventions before entering the URLs in Supabase or seeded data.

| Asset type | Suggested size | Path convention | Description |
| --- | --- | --- | --- |
| Player portrait | 800x1000 | `images/players/player-first-last.jpg` | Consistent portrait crop, ideally in kit or training wear. |
| Player action image | 1600x1000 | `images/players/player-first-last-action.jpg` | Optional action image for future profile pages or social cards. |
| Staff portrait | 800x1000 | `images/staff/staff-first-last.jpg` | Consistent staff portrait crop with neutral background. |

## Merch Page Assets

The merch page currently reuses one placeholder image for every product. Replace this with product-specific Tema Royals images.

| Filename | Suggested size | Description |
| --- | --- | --- |
| `images/merch/royals-home-kit.jpg` | 2000x2000 | Home kit product image with crest and trim clearly visible. |
| `images/merch/royals-away-kit.jpg` | 2000x2000 | Away kit product image using the same lighting/style as the home kit. |
| `images/merch/royals-scarf.jpg` | 2000x2000 | Scarf image showing pattern and club identity. |
| `images/merch/royals-training-top.jpg` | 2000x2000 | Training top product image. |
| `images/merch/royals-hoodie.jpg` | 2000x2000 | Hoodie product image with clear chest branding. |
| `images/merch/royals-cap.jpg` | 2000x2000 | Cap image showing logo embroidery. |

## Partnership Assets

The partnership page currently renders sponsor names as text, but logo files should be prepared for a more polished partner grid.

| Filename | Suggested size | Description |
| --- | --- | --- |
| `images/partnership/partnership-hero.jpg` | 2400x1400 | Premium image showing supporters, matchday, hospitality, or branded club activity. |
| `images/partnership/media-kit-cover.jpg` | 1600x900 | Cover image for future sponsor/media kit CTA. |
| `images/sponsors/sponsor-tema-port-logistics.png` | 1200x600 | Transparent-background sponsor logo. |
| `images/sponsors/sponsor-gold-coast-energy.png` | 1200x600 | Transparent-background sponsor logo. |
| `images/sponsors/sponsor-community-trust-bank.png` | 1200x600 | Transparent-background sponsor logo. |
| `images/sponsors/sponsor-royal-beverages.png` | 1200x600 | Transparent-background sponsor logo. |
| `images/sponsors/sponsor-webara-studio.png` | 1200x600 | Transparent-background sponsor logo. |
| `images/sponsors/sponsor-touchline-creator.png` | 1200x600 | Transparent-background sponsor logo. |

## Tickets, Fixtures, And Contact

These pages are mostly text/UI-led today, but these assets should be prepared for future page upgrades.

| Filename | Suggested size | Page | Description |
| --- | --- | --- | --- |
| `images/tickets/tickets-hero-matchday.jpg` | 2400x1400 | Tickets | Supporters entering or gathering around a Tema Royals matchday. |
| `images/tickets/tickets-stadium-map.png` | 1800x1400 | Tickets | Practical stadium/seating or access map. |
| `images/tickets/tickets-season-pass.jpg` | 1600x900 | Tickets | Fan lifestyle image for season ticket promotion. |
| `images/fixtures/fixtures-hero.jpg` | 2400x1400 | Fixtures | Season schedule or match action image. |
| `images/fixtures/fixture-next-match-promo.jpg` | 1600x900 | Fixtures | Upcoming fixture promo image. |
| `images/fixtures/fixture-latest-result-promo.jpg` | 1600x900 | Fixtures | Completed fixture recap image. |
| `images/fixtures/highlights-thumb-default.jpg` | 1280x720 | Dashboard/media | Default video thumbnail fallback. |
| `images/contact/stadium-exterior.jpg` | 2000x1200 | Contact | Exterior of the stadium, office, or training base. |
| `images/contact/location-map-card.jpg` | 1600x900 | Contact | Branded map/location image for visitors. |

## Launch Priority

If creating assets in phases, do this first:

1. Transparent crest: `images/branding/tema-royals-crest-transparent.png`
2. Home hero: `images/home/home-hero-stadium.jpg`
3. Player portraits for the first-team seeded or live records
4. Staff portraits for coaching/management records
5. Merch product images for the six listed products
6. Partnership hero image
7. Sponsor logos
8. Tickets hero image
9. Fixtures hero image
10. Social sharing image: `images/branding/og-default.jpg`

## Implementation Notes

- To replace homepage and merch placeholders, update `src/lib/placeholder-images.json`.
- To replace seeded player and staff placeholders, update `src/lib/team-site-data.ts` or the corresponding Supabase records.
- **Player, staff, owner, and partner images** are uploaded via the dashboard to the `team-images` Supabase Storage bucket. The upload helper is in `src/lib/upload-image.ts` and the reusable UI component is `src/components/image-upload-field.tsx`.
- The `image_url` / `logo_url` database columns store the Supabase Storage public URL after upload.
- The `team-images` bucket is public (anyone can read), but only admin and club roles can upload, update, or delete files (enforced via RLS policies on `storage.objects`).
- File constraints: 5 MB max, JPEG/PNG/WebP only.
- Bucket folder structure: `players/`, `staff/`, `owners/`, `partners/` — each file gets a UUID-based filename.
- Keep the blue/white crest colors consistent across all edited images so the site feels like one club.
