# Modcon Builders website

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind rebuild of [modconbuilders.com](https://www.modconbuilders.com), which currently runs on Wix.

## Run it

Needs Node 22 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # add your Resend key (see below)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run typecheck && npm run lint && npm test
```

See AGENTS.md for the house rules.

## Where things live

```
app/
  layout.tsx              fonts, site-wide metadata, JSON-LD
  fonts.ts                Satoshi (self-hosted), Instrument Serif, Syncopate, Inter Tight
  (site)/layout.tsx       header, footer and WhatsApp button for Home + Contact
  (site)/page.tsx         Home (9 sections, numbered in comments)
  (site)/contact/page.tsx Contact page + form
  modcon-one/             Modcon One landing page with its own header and footer
  api/contact/route.ts    form endpoint, sends email with Resend
components/               Header, Footer, ContactForm, Faq, HeroSlideshow, RichText, ...
content/site.ts           ALL copy, links, contact details and image paths
public/images/            photos and icons, named by section
reference/live/           screenshots and data captured from the live Wix site (for comparison only)
```

To change wording, edit `content/site.ts`. In titles, `*word*` renders as the gold italic accent and `**word**` as bold.

## Design system

- Colours (`tailwind.config.ts`): `gold #A39B8A`, `ink #4A4B4F`, `body #5E5E5E`, `muted #8E8E8E`, `paper #ECECEC`, `navy #021559` (footer headings), `sand #E8D9B5` (Modcon One wellness cards).
- Fonts: `font-sans` Satoshi (body and headings), `font-accent` Instrument Serif Italic (gold words), `font-display` Syncopate (hero, contact heading), `font-form` Inter Tight (forms), `font-helvetica` (Modcon One page).
- Helpers in `app/globals.css`: `.container-content` (1008px column), `.eyebrow`, `.h-section`, `.accent`, `.btn-pill`, `.btn-outline`, `.card`.
- Motion (CSS ports of motion-primitives, off when the visitor prefers reduced motion): `data-reveal` fades an element in with a blur as it scrolls into view, an inline `--i` staggers siblings, `<RichText words />` reveals headings word by word with a shimmer on gold accent words, the hero photos drift slowly, and buttons spring on press.
- Phones: Modcon One has a sticky action bar (call, WhatsApp, book a visit); Home and Contact keep the floating WhatsApp button.

## Contact forms

All three forms (contact page, Modcon One quick visit and Modcon One booking) post to `/api/contact`, which emails the enquiry through [Resend](https://resend.com).

| Variable | What it is |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Where enquiries go (comma-separate several) |
| `CONTACT_FROM_EMAIL` | Sender. Must be on a domain verified in Resend; `onboarding@resend.dev` only works for testing |

Set these in `.env.local` for local work and in Vercel → Project → Settings → Environment Variables for production. Never commit keys.

## Deploy (Vercel)

The project is ready for Vercel as-is: no `vercel.json` is needed, Node 22 is pinned in `package.json`, and `.vercelignore` skips the reference capture.

1. In Vercel, **Add New → Project** and import `sumanthrb94-sudo/modconbuilders`. Framework preset: Next.js. Leave the build and output settings at their defaults.
2. Add the three environment variables above (Production and Preview).
3. Test on the `*.vercel.app` URL, including sending each form.
4. Only then point the `modconbuilders.com` DNS at Vercel and remove the domain from Wix.

## SEO and security

`app/sitemap.ts`, `app/robots.ts` and `app/icon.svg` generate `/sitemap.xml`, `/robots.txt` and the favicon. `next.config.mjs` adds basic security headers.

## Helper workflows (GitHub Actions, run manually)

- **Capture live site** (`scripts/capture-live-site.mjs`): re-screenshots the Wix site at desktop and mobile widths and saves its text styles and images into `reference/live/`.
- **Fetch fonts**: downloads the Satoshi variable font from Fontshare into `app/fonts/`.
