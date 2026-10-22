# AGENTS.md

Notes for anyone (person or agent) changing this site. Read README.md and HANDOFF.md first.

## Commands

```bash
npm run dev         # local dev server
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # vitest (contact API)
npm run build       # production build, what Vercel runs
```

Run `typecheck`, `lint`, `test` and `build` before every commit.

## Where things live

- `content/site.ts`: all copy, links, contact details and image paths. In titles, `*word*` = gold italic accent, `**word**` = bold.
- `app/(site)/`: Home and Contact (shared header, footer, WhatsApp button). `app/modcon-one/`: the Modcon One landing page with its own header, footer and phone action bar.
- `components/`: shared UI. `RichText` renders the content markers (pass `words` for the word-by-word reveal).
- `app/globals.css`: design helpers and the motion primitives. `tailwind.config.ts`: colours and fonts.
- `app/api/contact/route.ts`: the one form endpoint (Resend), tested in `tests/`.

## Rules

1. Honest content only: every number, price, award or claim comes from Modcon or the live site. Missing facts stay out (or "ask us"), never guessed.
2. Colours and fonts come from `tailwind.config.ts` tokens; don't hard-code new hex values in components.
3. Copy changes go in `content/site.ts`, not in components.
4. Motion uses the CSS primitives in `globals.css`: add `data-reveal` for fade-in-blur, `style={{ '--i': index }}` to stagger siblings, `<RichText words />` for word-by-word headings. Everything must stay readable with JavaScript off and with reduced motion on.
5. Tap targets are at least 44px; every image has alt text (or `alt=""` when decorative); colour is never the only cue.
6. No horizontal scrolling at 360, 390, 768, 1024 or 1440px. Check with screenshots before shipping.
7. Never commit secrets. Resend keys live in `.env.local` and Vercel environment variables.
8. Ask before changing DNS, deploying to production, or deleting anything from the Wix site.
