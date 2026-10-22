# Handoff: Modcon Builders website

_Last updated: 22 Oct 2026_

The site was rebuilt from the live Wix pages (Home, Modcon One, Contact). Copy, images, fonts, colours and layout were taken from a capture of the live site (`reference/live/`), at desktop and mobile widths. See README.md for how to run it.

## Status

| Area | State |
|---|---|
| Next.js 14 + TS + Tailwind scaffold | Done. `npm run build` and `npm run lint` pass |
| Home (`/`) | Done: all live sections, live copy with typos fixed ("Explore Our", "permaculture farmland") |
| Modcon One (`/modcon-one`) | Done: all live sections, FAQ, map, both forms |
| Contact (`/contact`) | Done |
| Images | 31 photos and icons from the live site in `public/images/`, renamed by section |
| Logos | Header and footer logos extracted as SVG (`public/logo.svg`, `public/logo-wordmark.svg`) |
| Fonts | Satoshi self-hosted; Instrument Serif, Inter Tight and Syncopate via `next/font/google` |
| Contact forms | Send email via Resend. Validation and error handling tested; **a real send is untested** (needs your key) |
| Deploy | Not started. Waiting for your go-ahead |

## Needs a decision from you

1. **Resend.** Create an API key, verify the sending domain (`modconbuilders.com`) and set the three env vars (README → Contact forms).
2. **Hero font.** The live site uses Engravers Gothic, a commercial font. Syncopate is a free lookalike. If you hold a web licence for Engravers Gothic, add the file and swap it in `app/fonts.ts`.
3. **Copy that's wrong on the live site** and was copied as-is:
   - Modcon One wellness cards: the descriptions don't match their headings (for example, "Fully Equipped Gym" says "Sunlit interiors designed to keep your home bright…"), and Pool and Co-working share the same text.
   - "Daily Convenience Stores" repeats the "Premium Retail Outlets" text.
4. **Image placement on Modcon One.** The live villament and Syl Residences sections had their images hidden, so the bedroom, lounge and dining renders and the Syl tower photo were placed by best guess. Swap the paths in `content/site.ts` (`images.m1Villaments`, `images.m1SylTower`) if needed.
5. **Left out on purpose:**
   - Wix stock images and videos (`11062b_…` and similar), which are licensed only for Wix sites. The Modcon One hero sky video is replaced by a gradient, and the closing background reuses one of your own photos.
   - The live home page's hidden "Testimonials" and "As Seen In" blocks, which still contain Wix template text and fake logos.
6. **Hamburger menu.** The live menu contents couldn't be captured, so it links Home, About, Services, Projects, Modcon One and Contact.

## Before go-live

- [ ] Env vars set in Vercel, and a test email received from each of the three forms
- [ ] Check the pages on the `*.vercel.app` preview on a phone
- [ ] Point DNS to Vercel (ask first: this takes the Wix site offline for the domain)
