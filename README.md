# Creative Shot — بورتفوليو أحمد

Next.js 16 App Router + TypeScript + React. A complete bilingual portfolio with Arabic RTL and English LTR, a responsive front end, and a server-side contact endpoint.

## التشغيل

Use Node.js **22.18+** (Node 24 LTS recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The root redirects to `/ar`; English starts at `/en`.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## الصفحات والمحتوى

Both `/ar` and `/en` have home, work, videos, services, about, and contact routes. All ten services have independent pages under `/[locale]/services/[service]`. Home contains previews of each main section. Every service also has a dedicated navigation tab. The language switch preserves the current section.

- 10 static Behance project collections with translated titles and category filtering. Video-only and mixed reel projects from the previous 12-item collection are excluded from the static gallery.
- Separate Video Motion page with the 17 preserved Vimeo videos, lazy players and direct links. Optional automatic refresh is described below.
- The supplied photo is bundled locally as a JPEG.
- Counters animate once into view to the real numbers: 3, 5, 25+, 4, 13+, 60+, 24+, and 3+ websites. Values remain accessible to screen readers and motion is disabled under reduced-motion preferences.
- Art direction, creative design, graphic design, UI/UX, identity, visualization, video, frontend development, marketing, and social management.
- Contact: ahmed.samy.abdellattif@gmail.com / +966 53 524 2000, with telephone and WhatsApp links.
- Creative Shot wordmark and CS browser icon; white/olive/lime palette; H1–H4 scale, accessible focus and motion; 10 equal compact services on home, larger services inside; four separate discipline links and icon-led animated counters.

Content, project categories, media links, and translated services: `src/lib/content.ts`. Page copy: `src/components/site.tsx`. Form/menu/filter translations: `src/components/interactive.tsx`. Shared styling: `src/app/globals.css`.

## خط RB

**RB is prepared but not bundled:** no licensed RB font file or exact family version was provided. The running design uses **Cairo**, packaged locally with Arabic/Latin glyphs and weights 400/600/700. There is no Google Fonts network request.

To enable RB:
1. Place licensed webfont files at `public/fonts/RB-Regular.woff2` and `public/fonts/RB-Bold.woff2`.
2. Uncomment the two `@font-face` rules at the beginning of `src/app/globals.css`.
3. Verify that the supplied family supports Arabic and English and map its actual available weights. The `--font` stack already prefers RB.

H1, H2, H3, H4 use the `--h1` … `--h4` variables. Arabic has its own line-height and avoids Latin letter-spacing. Portrait cropping is presentation-only; the original supplied composition remains in the bundled image.

## الباك إند ونموذج التواصل

`POST /api/contact` validates JSON, origin, field lengths, email, service choices, and a honeypot. It limits bodies to 20 KB, uses a bounded in-memory rate limiter (4 requests / 15 minutes), and calls Resend using a server-only API key. Client-supplied recipient/from/subject fields are ignored. Inquiry text is sent as plain text; provider errors never report success. The app does not persist messages in a database or provide an admin CMS.

Copy `.env.example` to `.env.local`, then set:

- `SITE_URL`: exact public origin, e.g. `https://your-domain.com` (for local development use the exact host and port you visit).
- `RESEND_API_KEY`: server-side Resend API key.
- `CONTACT_FROM`: a sender address on a domain verified in your Resend account.
- `CONTACT_TO`: defaults to Ahmed's supplied Gmail address.

Restart/redeploy after configuration. Without the email credentials, the UI explicitly disables form submission and offers working email, phone, and WhatsApp links. No real email was sent during development. Provider configuration and final email delivery must be verified with your own account before launch.

The in-memory limiter is a basic single-instance safeguard: it resets on restart and is not shared across serverless instances. Use a durable shared rate limiter or your hosting provider's request protections for a public production deployment, and configure the trusted reverse proxy to overwrite forwarding headers.

Resend API reference: https://resend.com/docs/api-reference/emails/send-email

## GitHub والنشر

Upload this project's contents to a GitHub repository. Do not commit `.env.local`, API keys, `node_modules`, or `.next` (covered by `.gitignore`).

Deploy to a Next.js-capable Node/serverless host with `npm ci`, `npm run build`, and `npm start` where applicable; configure the environment variables above in the host dashboard. For a GitHub-connected Next.js host, import the repository and choose this project as the root directory.

**GitHub Pages cannot run this version's contact backend.** Keep the source on GitHub and deploy the app on a Next.js-capable host. The previous plain HTML project remains separate and unchanged. This project has not been published or pushed to a remote repository.

Next.js deployment reference: https://nextjs.org/docs/app/getting-started/deploying

## Media & editing

Vimeo and Behance content needs internet access and the owner's existing public/embedding permissions. External services can change or restrict content. Direct links remain available. Behance images have an accessible fallback if the CDN fails. Add future work to the typed arrays in `src/lib/content.ts`, preserving both `en` and `ar` titles and a category matching a service slug.

## تحديث الأعمال / Media refresh

`src/lib/media.ts` reads data on the server; tokens are not included in the browser bundle.

### Vimeo

Set `VIMEO_ACCESS_TOKEN` to a read-only public token for the supplied Vimeo account. The site queries `/users/217490771/videos`, follows pagination (up to 2,000 entries), accepts only public videos, deduplicates IDs, and refreshes its cached data after one hour **when the next request arrives**. This is request-triggered refresh, not a scheduled background job. The bundled 17 videos are the fallback when unconfigured or if Vimeo fails. A successful empty public list is respected. Titles already translated remain bilingual; new video titles retain their source wording until an Arabic translation is added.

This integration is implemented but **not activated or tested against a real account token**. No secret was supplied. Token reference: https://help.vimeo.com/hc/en-us/articles/12427789081745-How-to-generate-a-personal-access-token

### Behance

A Behance profile URL alone is not an active automatic integration. Direct account synchronization has **not** been enabled. `BEHANCE_FEED_URL` optionally points to an owner-maintained HTTPS JSON feed. Use `public/design-feed.example.json` as its exact schema, and host the updated feed on a trusted HTTPS service. Entries require `kind: "static"`, bilingual titles, Behance project links and Behance CDN images. Non-static entries are excluded. The site refreshes this feed after one hour on the next visit and uses bundled designs if the feed fails. Updating this independent feed does not require rebuilding the site. The feed itself must be maintained manually or connected to an authorized content source; there is no scraping, automatic Behance account importer, or admin CMS hidden behind this feature.

Without a remote feed, add a project to the typed collection in `src/lib/content.ts` and rebuild. The 12 original entries remain archived in source for reference; only 10 static collections are shown.

## الألوان المعتمدة

| Purpose | HEX |
| --- | --- |
| Main background | `#FFFFFF` |
| Alternate background | `#F4F5EF` |
| Icon / soft background | `#F1F8E5` |
| Lime accent | `#D7FC70` |
| Button hover | `#E4FF9A` |
| Titles / numbers | `#354329` |
| Body text | `#59664B` |
| Borders | `#DDE5D2` |

Shadow: `rgba(53,67,41,0.08)`. No black site backgrounds; third-party media keeps its original content/player colors.

## أحجام الصور المقترحة

- Static work covers: 1600 × 1200 px (4:3).
- Video covers: 1920 × 1080 px (16:9).
- Featured banners: 1920 × 960 px (2:1).
- Prefer WebP, roughly 200–400 KB when visual quality permits. Keep important artwork within the center and minimize cover text for mobile readability.

The original RB font and email-provider configuration remain external prerequisites. The active font is Cairo until licensed RB files are supplied.
# Creative-Shot
