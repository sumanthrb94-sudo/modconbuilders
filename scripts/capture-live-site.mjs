// Captures the live Wix site as a reference for the rebuild:
// screenshots (desktop + mobile), text styles, image positions, fonts,
// and downloads the photos into reference/live/images/.
// Runs in GitHub Actions (see .github/workflows/capture-live-site.yml).
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(path.join(process.env.PW_DIR || process.cwd(), 'noop.js'));
const { chromium, devices } = require('playwright');

const BASE = 'https://www.modconbuilders.com';
const OUT = 'reference/live';
const IMG_OUT = 'reference/live/images';
const MAX_PAGES = 15;

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-'));

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, 400);
        y += 400;
        if (y >= document.documentElement.scrollHeight || y > 60000) resolve();
        else setTimeout(step, 200);
      };
      step();
    });
  });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
}

function collect() {
  const abs = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const images = [];
  document.querySelectorAll('img').forEach((img) =>
    images.push({ kind: 'img', src: img.currentSrc || img.src, alt: img.alt, ...abs(img) }),
  );
  document.querySelectorAll('*').forEach((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg.includes('url(')) images.push({ kind: 'bg', src: bg, ...abs(el) });
  });
  document.querySelectorAll('[data-image-info]').forEach((el) => {
    try {
      const info = JSON.parse(el.getAttribute('data-image-info'));
      images.push({ kind: 'wow', src: info?.imageData?.uri, ...abs(el) });
    } catch {}
  });
  document.querySelectorAll('video').forEach((v) =>
    images.push({ kind: 'video', src: v.currentSrc || v.src, poster: v.poster, ...abs(v) }),
  );
  const texts = [];
  const seen = new Set();
  document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,button,li,label,input,textarea').forEach((el) => {
    const t = (el.innerText || el.placeholder || el.value || '').trim();
    if (!t) return;
    const r = abs(el);
    if (r.w === 0 || r.h === 0) return;
    const key = t + r.y;
    if (seen.has(key)) return;
    seen.add(key);
    const cs = getComputedStyle(el);
    texts.push({
      tag: el.tagName, text: t.slice(0, 400), href: el.href || undefined,
      font: cs.fontFamily, size: cs.fontSize, weight: cs.fontWeight, style: cs.fontStyle,
      color: cs.color, bg: cs.backgroundColor, lh: cs.lineHeight, ls: cs.letterSpacing,
      tt: cs.textTransform, align: cs.textAlign, ...r,
    });
  });
  const links = [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, text: a.innerText.trim().slice(0, 100) }));
  const fonts = [...document.fonts].map((f) => ({ family: f.family, weight: f.weight, style: f.style, status: f.status }));
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    height: document.documentElement.scrollHeight,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    images, texts, links, fonts,
  };
}

function mediaIds(src) {
  if (!src) return [];
  const ids = [];
  const re = /(?:media\/)?([0-9a-f]{6}_[0-9a-f]{32}(?:~mv2)?(?:_d_\d+_\d+_s_\d+)?\.(?:jpe?g|png|webp|gif|avif|svg))/gi;
  for (const m of src.matchAll(re)) ids.push(m[1]);
  return ids;
}

async function shoot(page, file, height, width) {
  // Full page in viewport-height slices, as JPEG, so each image stays legible.
  const slice = 1200;
  const parts = [];
  for (let y = 0, i = 0; y < height && i < 40; y += slice, i++) {
    const h = Math.min(slice, height - y);
    const p = `${file}-${String(i).padStart(2, '0')}.jpg`;
    await page.screenshot({ path: p, type: 'jpeg', quality: 70, fullPage: true, clip: { x: 0, y, width, height: h } });
    parts.push(path.basename(p));
  }
  return parts;
}

async function capturePage(browser, pagePath, variant, fontUrls) {
  const ctxOpts = variant === 'mobile' ? { ...devices['iPhone 13'] } : { viewport: { width: 1440, height: 900 } };
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('response', (r) => {
    const u = r.url();
    if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(u) || (r.headers()['content-type'] || '').includes('font')) fontUrls.add(u);
  });
  await page.goto(BASE + pagePath, { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => console.log('goto warn', e.message));
  await autoScroll(page);
  const info = await page.evaluate(collect);
  const dir = path.join(OUT, slug(pagePath));
  await fs.mkdir(dir, { recursive: true });
  const width = variant === 'mobile' ? ctxOpts.viewport.width : 1440;
  info.screenshots = await shoot(page, path.join(dir, variant), info.height, width);
  await fs.writeFile(path.join(dir, `${variant}.json`), JSON.stringify(info, null, 2));
  if (variant === 'desktop') await fs.writeFile(path.join(dir, 'rendered.html'), await page.content());
  await ctx.close();
  return info;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(IMG_OUT, { recursive: true });
  const browser = await chromium.launch();
  const fontUrls = new Set();
  const queue = ['/', '/modcon-one', '/contact'];
  const done = new Set();
  const allIds = new Map(); // id -> [{page, variant, y, w, h, kind, heading}]

  while (queue.length && done.size < MAX_PAGES) {
    const p = queue.shift();
    if (done.has(p)) continue;
    done.add(p);
    for (const variant of ['desktop', 'mobile']) {
      console.log('capture', p, variant);
      let info;
      try {
        info = await capturePage(browser, p, variant, fontUrls);
      } catch (e) {
        console.log('FAIL capture', p, variant, e.message);
        continue;
      }
      const headings = info.texts.filter((t) => /^H[1-6]$/.test(t.tag)).sort((a, b) => a.y - b.y);
      for (const img of info.images) {
        for (const id of [...mediaIds(img.src), ...mediaIds(img.poster)]) {
          const near = headings.filter((h) => h.y <= img.y + img.h).pop();
          if (!allIds.has(id)) allIds.set(id, []);
          allIds.get(id).push({ page: p, variant, kind: img.kind, x: img.x, y: img.y, w: img.w, h: img.h, nearestHeadingAbove: near?.text?.slice(0, 80) });
        }
      }
      if (variant === 'desktop') {
        for (const l of info.links) {
          try {
            const u = new URL(l.href);
            if (u.hostname.endsWith('modconbuilders.com') && !done.has(u.pathname) && !queue.includes(u.pathname)) queue.push(u.pathname);
          } catch {}
        }
      }
    }
  }
  await browser.close();

  const manifest = [];
  for (const [id, uses] of allIds) {
    if (id.startsWith('11062b_')) {
      manifest.push({ id, skipped: 'Wix stock image (licensed for Wix sites only)', uses });
      continue;
    }
    const isSvg = id.endsWith('.svg');
    const url = isSvg
      ? `https://static.wixstatic.com/media/${id}`
      : `https://static.wixstatic.com/media/${id}/v1/fit/w_2400,h_2400,q_90/${id.replace(/\.(webp|avif)$/i, '.jpg')}`;
    const file = id.replace(/~/g, '-');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fs.writeFile(path.join(IMG_OUT, file), Buffer.from(await res.arrayBuffer()));
      manifest.push({ id, file, uses });
      console.log('OK', file);
    } catch (e) {
      manifest.push({ id, error: e.message, uses });
      console.log('FAIL', id, e.message);
    }
  }
  await fs.writeFile(path.join(OUT, 'images.json'), JSON.stringify(manifest, null, 2));
  await fs.writeFile(path.join(OUT, 'fonts.json'), JSON.stringify([...fontUrls], null, 2));
  await fs.writeFile(path.join(OUT, 'pages.json'), JSON.stringify([...done], null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
