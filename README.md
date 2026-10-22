# Modcon Builders website

Next.js 14 (App Router) + TypeScript + Tailwind rebuild of [modconbuilders.com](https://www.modconbuilders.com), which currently runs on Wix.

## Run it

```bash
npm install
cp .env.example .env.local   # add your Resend key (see below)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run lint
```

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
- Helpers in `app/globals.css`: `.container-content` (1008px column), `.eyebrow`, `.h-section`, `.accent`, `.btn-pill`, `.btn-outline`, `.card`. Add `data-reveal` to any element to fade it in on scroll.

## Contact forms

All three forms (contact page, Modcon One quick visit and Modcon One booking) post to `/api/contact`, which emails the enquiry through [Resend](https://resend.com).

| Variable | What it is |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Where enquiries go (comma-separate several) |
| `CONTACT_FROM_EMAIL` | Sender. Must be on a domain verified in Resend; `onboarding@resend.dev` only works for testing |

Set these in `.env.local` for local work and in Vercel → Project → Settings → Environment Variables for production. Never commit keys.

## Deploy (Vercel)

1. Import the GitHub repo in Vercel. Framework: Next.js, no extra settings.
2. Add the three environment variables above.
3. Test on the `*.vercel.app` URL, including sending each form.
4. Only then point the `modconbuilders.com` DNS at Vercel and remove the domain from Wix.

## Helper workflows (GitHub Actions, run manually)

- **Capture live site** (`scripts/capture-live-site.mjs`): re-screenshots the Wix site at desktop and mobile widths and saves its text styles and images into `reference/live/`.
- **Fetch fonts**: downloads the Satoshi variable font from Fontshare into `app/fonts/`.
