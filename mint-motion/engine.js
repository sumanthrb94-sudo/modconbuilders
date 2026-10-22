/* mint-motion engine — builds ONE seekable GSAP timeline from window.SPEC (spec.js).
   Motion recipes ported from ibelick/motion-primitives (MIT): TextEffect fade-in-blur, TextShimmer,
   TextScramble, TextRoll, SlidingNumber, BorderTrail, GlowEffect, Spotlight. Composition format follows
   HyperFrames (window.__timelines.root, paused, seekable). Beat-snapped cuts per latent-spaces/brag.
   Exposes: __timelines.root, __duration, __cues, __ready, __W, __H, __poster (best still time). */
(function () {
  const W = window; W.__timelines = {}; W.__cues = []; W.__ready = false;
  const S = W.SPEC;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const md = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\*([^*]+)\*/g, "<em>$1</em>");
  const cue = (t, kind) => W.__cues.push({ t: +t.toFixed(3), kind });

  /* ---------- format + theme ---------- */
  const FMT = {
    vertical:  { w: 1080, h: 1920, k: 1,   scene: { left: 90, right: 160, top: 300, height: 1160 }, bug: [90, 214] },  // IG: top 210 / bottom 420 / right rail clear
    landscape: { w: 1920, h: 1080, k: .82, scene: { left: 170, right: 170, top: 150, height: 780 }, bug: [90, 64] },
    square:    { w: 1080, h: 1080, k: .74, scene: { left: 90, right: 90, top: 150, height: 800 }, bug: [90, 60] },
  }[S.format || "vertical"];
  W.__W = FMT.w; W.__H = FMT.h;
  document.documentElement.style.cssText += `width:${FMT.w}px;height:${FMT.h}px;--k:${FMT.k}`;
  document.body.style.cssText += `width:${FMT.w}px;height:${FMT.h}px`;
  const B = S.brand || {};
  const root = document.documentElement.style;
  Object.entries(B.colors || {}).forEach(([k, v]) => root.setProperty("--" + k, v));
  const fontLoads = [];
  (B.fonts || []).forEach(f => { const ff = new FontFace(f.role === "mono" ? "MM Mono" : "MM Display", `url(${f.src})`, { weight: String(f.weight || 400), style: f.style || "normal" }); fontLoads.push(ff.load().then(x => document.fonts.add(x)).catch(() => {})); });
  const logo = () => B.logo ? `<img class="logo" src="${B.logo}" alt="">` : `<span class="mono">${(B.name || "?").trim()[0]}</span>`;
  const bug = $("#bug"); bug.style.left = FMT.bug[0] + "px"; bug.style.top = FMT.bug[1] + "px";
  bug.innerHTML = `${logo()}<span>${md(B.name || "")}</span>${B.sub ? `<i>${md(B.sub)}</i>` : ""}`;

  /* ---------- beats (snap cuts to the music) ---------- */
  const beats = (S.beats || []).slice().sort((a, b) => a - b), strong = (S.strong || []).slice().sort((a, b) => a - b);
  function snap(t, list = beats, back = .12, fwd = .4) {
    let best = null; for (const b of list) { if (b >= t - back && b <= t + fwd && (best === null || Math.abs(b - t) < Math.abs(best - t))) best = b; }
    return best === null ? t : best;
  }

  /* ---------- text + motion-primitives ports ---------- */
  function split(node) {
    const words = [], kids = [...node.childNodes]; node.innerHTML = "";
    const make = (text, emph) => { const w = el("span", "word" + (emph ? " emph" : "")); for (const c of text) { const s = el("span", "ch"); s.textContent = c; w.appendChild(s); } node.appendChild(w); words.push(w); };
    kids.forEach(n => n.textContent.split(/\s+/).forEach(tok => tok && make(tok, n.nodeType !== 3)));
    return words;
  }
  function shimmer(tl, w, t, dur = 1.1) {
    w.dataset.t = w.textContent; w.style.setProperty("--spread", (w.textContent.length * 20) + "px");
    tl.fromTo(w, { "--so": 0 }, { "--so": 1, duration: .15, ease: "none" }, t).fromTo(w, { "--sx": "100%" }, { "--sx": "0%", duration: dur, ease: "none" }, t).to(w, { "--so": 0, duration: .25, ease: "none" }, t + dur - .2);
  }
  function spotTo(tl, node, t) { const r = node.getBoundingClientRect(); tl.to("#spot", { x: r.left + r.width / 2, y: r.top + r.height / 2, duration: .7, ease: "power2.out" }, t); }
  function speak(tl, node, t, o = {}) {   // TextEffect fade-in-blur, released word by word like speech
    const pace = o.pace || 1, words = split(node), fs = parseFloat(getComputedStyle(node).fontSize);
    words.forEach(w => {
      const chars = $$(".ch", w), emph = w.classList.contains("emph");
      if (emph) t += .1 * pace;
      if (o.roll) tl.fromTo(chars, { rotationX: -90, opacity: 0 }, { rotationX: 0, opacity: 1, duration: .55, ease: "power2.out", stagger: .06 }, t);
      else tl.fromTo(chars, { opacity: 0, y: fs * .26, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .7, ease: "power3.out", stagger: .028 }, t);
      if (!o.noSpot) spotTo(tl, w, t);
      if (emph) shimmer(tl, w, t + .45);
      t += (.14 + chars.length * .013) * pace + (/[.,?!:]/.test(w.textContent.slice(-1)) ? .22 * pace : 0) + (emph ? .08 * pace : 0);
    });
    return t;
  }
  const SCR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rnd = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  function scramble(tl, span, text, t, dur = .8) {
    const st = { p: 0 }, steps = Math.round(dur / .04); span.textContent = text;
    tl.fromTo(st, { p: 0 }, { p: 1, duration: dur, ease: "none", onUpdate: () => {
      const step = Math.floor(st.p * steps), prog = step / steps; let out = "";
      for (let i = 0; i < text.length; i++) out += (text[i] === " " || prog * text.length > i) ? text[i] : SCR[Math.floor(rnd(step, i) * SCR.length)];
      span.textContent = out; } }, t);
  }
  function eyebrow(sec, tl, text, t) {
    const e = el("div", "eyebrow"); e.appendChild(el("b")); const sp = el("span"); e.appendChild(sp); sec.appendChild(e);
    tl.from(e.querySelector("b"), { scaleX: 0, duration: .5, ease: "power3.inOut" }, t).from(e, { opacity: 0, duration: .25, ease: "none" }, t);
    scramble(tl, sp, text, t + .05); return e;
  }
  function trail(tl, card, t, dur = 2.2, radius = 26) {
    const tr = el("div", "trail"), dot = el("i"); dot.style.offsetPath = `rect(0 auto auto 0 round ${radius}px)`; tr.appendChild(dot); card.appendChild(tr);
    tl.to(dot, { opacity: 1, duration: .3, ease: "none" }, t).fromTo(dot, { offsetDistance: "0%" }, { offsetDistance: "100%", duration: dur, ease: "none" }, t).to(dot, { opacity: 0, duration: .4, ease: "none" }, t + dur - .4);
  }
  function sliding(tl, host, value, t, dur = 1.4) {
    const places = []; for (let p = 1; p <= Math.max(1, value); p *= 10) places.unshift(p);
    const digs = places.map(p => { const d = el("span", "dg"); d.dataset.place = p; for (let n = 0; n < 10; n++) { const s = el("span"); s.textContent = n; d.appendChild(s); } host.appendChild(d); return d; });
    const v = { x: 0 };
    const draw = () => digs.forEach(d => { const place = +d.dataset.place, h = d.clientHeight;
      const pv = place === 1 ? v.x % 10 : (Math.floor(v.x / place) + Math.min(1, Math.max(0, (v.x % place) - (place - 1)))) % 10;
      [...d.children].forEach((s, n) => { let off = (10 + n - pv) % 10, y = off * h; if (off > 5) y -= 10 * h; s.style.transform = `translateY(${y}px)`; }); });
    tl.call(draw, null, 0); tl.fromTo(v, { x: 0 }, { x: value, duration: dur, ease: "expo.out", onUpdate: draw }, t);
  }
  function glowRotate(tl, nodes, t, dur) { const g = { a: 0 }; tl.fromTo(g, { a: 0 }, { a: 360 * dur / 5, duration: dur, ease: "none", onUpdate: () => nodes.forEach(n => n.style.setProperty("--ga", g.a + "deg")) }, t); }
  function fadeIn(tl, nodes, t, o = {}) { return tl.fromTo(nodes, { opacity: 0, y: o.y ?? 40, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: o.d ?? .7, ease: "power3.out", stagger: o.stagger ?? .12 }, t); }
  function heading(sec, tl, s, t, size = "mid") {
    if (s.eyebrow) { eyebrow(sec, tl, s.eyebrow, t); t += .2; }
    if (s.title) { const h = el("div", "say " + (s.size || size), md(s.title)); sec.appendChild(h); t = speak(tl, h, t) + .1; }
    return t;
  }

  /* ---------- devices for real screenshots ---------- */
  const IMG = {};   // src -> {w,h}
  function device(item, width, vpH) {
    const d = el("div", `dev ${item.device || "browser"} fx-out`);
    d.style.width = width + "px";
    if ((item.device || "browser") === "browser") {
      d.innerHTML = `<div class="bar"><i></i><i></i><i></i><span>${md(item.url || S.url || "")}</span></div><div class="vp" style="height:${vpH}px"><img src="${item.src}" alt=""></div>`;
    } else {
      d.innerHTML = `<div class="scr"><div class="vp" style="height:${vpH}px"><img src="${item.src}" alt=""></div></div>`;
    }
    const inner = (item.device || "browser") === "browser" ? width : width - 28;
    const nat = IMG[item.src] || { w: 1, h: 1 };
    const imgH = nat.h * inner / nat.w;
    d._scroll = Math.max(0, imgH - vpH);
    return d;
  }
  function scrollShot(tl, d, t, dur, frac) {
    const img = d.querySelector("img"); if (!d._scroll) return;
    tl.fromTo(img, { y: 0 }, { y: -d._scroll * frac, duration: dur, ease: "power1.inOut" }, t);
  }

  /* ---------- scene builders: (sec, s, tl, t) -> time the scene is fully in ---------- */
  const SB = {};
  function linesBlock(sec, s, tl, t, size) {
    if (s.eyebrow) { eyebrow(sec, tl, s.eyebrow, t); t += .25; }
    const box = el("div", "lines"); sec.appendChild(box);
    const nodes = (s.lines || []).map(l => { const d = el("div", "say " + (s.size || size), md(l)); box.appendChild(d); return d; });
    nodes.forEach((n, i) => { if (i && s.dimPrev) tl.to(nodes.slice(0, i), { opacity: .4, duration: .5 }, t); t = speak(tl, n, t) + .12; });
    if (s.note) { const n = el("div", "note", md(s.note)); sec.appendChild(n); fadeIn(tl, n, t, { y: 20 }); t += .5; }
    return t;
  }
  SB.hook = (sec, s, tl, t) => linesBlock(sec, s, tl, t, "xl");
  SB.lines = (sec, s, tl, t) => linesBlock(sec, s, tl, t, "big");
  SB.list = (sec, s, tl, t) => {
    t = heading(sec, tl, s, t);
    const box = el("div", "list"); sec.appendChild(box);
    s.items.forEach((it, i) => {
      const r = el("div", "row card fx-out", `<span class="ix">${String(i + 1).padStart(2, "0")}</span><span class="tx">${md(it)}</span>${s.ticks === false ? "" : '<span class="tk"></span>'}`);
      box.appendChild(r); fadeIn(tl, r, t, { y: 30, d: .55 });
      const tk = r.querySelector(".tk"); if (tk) tl.from(tk, { scale: 0, duration: .4, ease: "back.out(2.4)" }, t + .25);
      if (i === s.items.length - 1) trail(tl, r, t + .2, 1.8);
      spotTo(tl, r, t); cue(t + .25, "tick"); t += s.step || .6;
    });
    return t + .2;
  };
  SB.stat = (sec, s, tl, t) => {
    if (s.eyebrow) { eyebrow(sec, tl, s.eyebrow, t); t += .2; }
    const b = el("div", "statnum fx-out", `<span class="v"></span>${s.suffix ? `<span class="suf">${md(s.suffix)}</span>` : ""}`); sec.appendChild(b);
    tl.fromTo(b, { opacity: 0, filter: "blur(14px)" }, { opacity: 1, filter: "blur(0px)", duration: .6, ease: "power2.out" }, t);
    if (s.text) scramble(tl, b.querySelector(".v"), s.text, t, .9); else sliding(tl, b.querySelector(".v"), s.value, t, 1.4);
    cue(t, "tick"); t += 1.1;
    if (s.label) { const l = el("div", "say mid", md(s.label)); sec.appendChild(l); t = speak(tl, l, t) + .1; }
    return t;
  };
  // one real screenshot in a browser or phone frame: tilts up into place, then scrolls the page
  SB.shot = (sec, s, tl, t) => {
    const vert = FMT.h > FMT.w, phone = s.device === "phone";
    if (!vert) { sec.style.flexDirection = "row"; sec.style.alignItems = "center"; sec.style.gap = "70px"; }
    const cap = el("div", "shotcap"); sec.appendChild(cap);
    if (!vert) { cap.style.flex = "1 1 0"; cap.style.minWidth = "0"; }
    t = heading(cap, tl, s, t, vert ? "mid" : "big");
    const width = phone ? (vert ? 470 : 380) : (vert ? 900 : 860);
    const vpH = phone ? (vert ? 900 : 700) : (vert ? (s.title ? 760 : 900) : 540);
    const d = device(s, width, vpH); d.style.flex = "none";
    if (vert && phone) d.style.alignSelf = "center";
    sec.appendChild(d);
    gsap.set(sec, { perspective: 1400 });
    tl.fromTo(d, { y: 140, rotationX: 16, opacity: 0, filter: "blur(10px)", transformOrigin: "50% 100%" }, { y: 0, rotationX: 0, opacity: 1, filter: "blur(0px)", duration: 1.0, ease: "power3.out" }, t - .25);
    trail(tl, d, t + .3, 2.2, phone ? 54 : 18);
    cue(t - .2, "whoosh");
    const hold = s.hold ?? 2.6;
    scrollShot(tl, d, t + .5, hold + .3, s.scroll ?? .55);
    tl.fromTo(d, { scale: 1 }, { scale: 1.03, duration: hold + .6, ease: "none" }, t + .4);
    s.hold = hold;
    return t + .4;
  };
  // 2–3 real screenshots side by side (phones or browsers), staggered
  SB.shots = (sec, s, tl, t) => {
    const vert = FMT.h > FMT.w;
    t = heading(sec, tl, s, t, "mid");
    const row = el("div", "shots"); sec.appendChild(row);
    const n = s.items.length, phone = (s.items[0].device || "phone") === "phone";
    const avail = vert ? 830 : 1580, gap = 28;
    const width = Math.min(Math.floor((avail - gap * (n - 1)) / n), phone ? (vert ? 400 : 330) : 760);
    const vpH = phone ? Math.round(width * 1.9) : Math.round(width * .62);
    const ds = s.items.map(it => { const d = device({ device: "phone", ...it }, width, Math.min(vpH, vert ? 760 : 560)); d.style.flex = "none"; row.appendChild(d); return d; });
    tl.fromTo(ds, { y: 180, opacity: 0, filter: "blur(10px)" }, { y: (i) => (n === 3 && i === 1 ? -30 : 0), opacity: 1, filter: "blur(0px)", duration: .9, ease: "back.out(1.3)", stagger: .14 }, t - .2);
    const hold = s.hold ?? 2.6;
    ds.forEach((d, i) => { scrollShot(tl, d, t + .5 + i * .1, hold, s.scroll ?? .5); });
    trail(tl, ds[Math.floor(n / 2)], t + .5, 2.2, phone ? 54 : 18);
    cue(t - .1, "whoosh");
    s.hold = hold;
    return t + .5;
  };
  SB.end = (sec, s, tl, t) => {
    sec.classList.add("end");
    const mark = B.logo ? `<img src="${B.logo}" alt="">` : `<span class="mono">${(B.name || "?").trim()[0]}</span>`;
    const lock = el("div", "lock", `<div class="mw"><div class="glowfx"></div>${mark}</div><div class="wm">${md(B.name || "")}</div>${B.sub ? `<div class="sub">${md(B.sub)}</div>` : ""}`);
    sec.appendChild(lock);
    const gl = lock.querySelector(".glowfx");
    tl.to("#flash", { opacity: .45, duration: .06, ease: "none" }, t).to("#flash", { opacity: 0, duration: .7, ease: "power2.out" }, t + .06);
    tl.from(lock.querySelector(".mw > :last-child"), { scale: 0, rotation: -90, duration: 1.0, ease: "back.out(1.6)" }, t).to(gl, { opacity: .85, duration: 1.2 }, t + .1);
    cue(t, "hit");
    let u = speak(tl, lock.querySelector(".wm"), t + .5, { roll: true, noSpot: true, pace: .8 });
    if (B.sub) tl.from(lock.querySelector(".sub"), { opacity: 0, y: 14, filter: "blur(6px)", duration: .7, ease: "expo.out" }, u);
    u += .35;
    const nodes = [gl];
    if (s.tagline) { const tg = el("div", "tag", md(s.tagline)); sec.appendChild(tg); u = speak(tl, tg, u, { noSpot: true }) + .1; }
    if (s.cta) {
      const w = el("div", "ctaw", `<div class="glowfx"></div><div class="cta">${md(s.cta)}<div class="sh"></div></div>`); sec.appendChild(w); nodes.push(w.querySelector(".glowfx"));
      tl.from(w.querySelector(".cta"), { y: 40, opacity: 0, scale: .85, duration: .8, ease: "back.out(1.7)" }, u).to(w.querySelector(".glowfx"), { opacity: .7, duration: .9 }, u + .1)
        .fromTo(w.querySelector(".sh"), { left: "-40%" }, { left: "130%", duration: .9, ease: "power3.inOut" }, u + .6);
      cue(u + .1, "ping"); u += .9;
    }
    if (s.url !== false && (s.url || S.url)) { const r = el("div", "url", md(s.url || S.url)); sec.appendChild(r); fadeIn(tl, r, u, { y: 10, d: .5 }); u += .4; }
    glowRotate(tl, nodes, t, 12);
    W.__poster = u + .3;
    return u;
  };

  /* ---------- assemble ---------- */
  function build() {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } }), stage = $("#stage");
    let t = .1;
    tl.fromTo("#bug", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .6, ease: "power2.out" }, .2);
    S.scenes.forEach((s, i) => {
      const sec = el("section", "scene"); Object.entries(FMT.scene).forEach(([k, v]) => sec.style[k] = v + "px"); stage.appendChild(sec);
      const isEnd = s.type === "end";
      if (i) t = isEnd ? snap(t, strong.length ? strong : beats, .1, .8) : snap(t);
      if (isEnd) { tl.to("#bug", { opacity: 0, duration: .3 }, t - .1); sec.style.left = FMT.scene.left + "px"; sec.style.right = FMT.scene.left + "px"; }
      tl.set(sec, { visibility: "visible" }, t).fromTo(sec, { scale: 1.035 }, { scale: 1, duration: 4, ease: "power1.out" }, t);
      if (i) cue(t, isEnd ? "toend" : "scene");
      const tin = SB[s.type](sec, s, tl, t);
      if (i === 0) W.__hookStill = tin + .2;
      if (isEnd) { t = tin + (s.hold ?? 2.4); return; }
      const tout = tin + (s.hold ?? 1.5);
      tl.to($$(".ch", sec), { opacity: 0, y: 24, filter: "blur(12px)", duration: .42, ease: "power2.in", stagger: { amount: .22, from: "end" } }, tout)
        .to($$(".fx-out, .eyebrow, .note, .statnum, .shots", sec), { opacity: 0, y: -30, filter: "blur(10px)", duration: .42, ease: "power2.in", stagger: .03 }, tout)
        .set(sec, { visibility: "hidden" }, tout + .6);
      t = tout + .5;
    });
    const dur = Math.ceil((t + .2) * 10) / 10;
    tl.to("#fadeout", { opacity: 1, duration: .5, ease: "power2.in" }, dur - .5);
    gsap.set("#glow", { x: FMT.w * .28, y: FMT.h * .32 });
    tl.fromTo("#grid", { x: 0, y: 0 }, { x: -108, y: -216, duration: dur, ease: "none" }, 0)
      .to("#glow", { x: FMT.w * .76, y: FMT.h * .68, duration: dur * .55, ease: "sine.inOut" }, 0)
      .to("#glow", { x: FMT.w * .5, y: FMT.h * .43, duration: dur * .45, ease: "sine.inOut" }, dur * .55)
      .to("#spot", { opacity: .28, duration: 1 }, .2);
    tl.to({}, { duration: .01 }, dur - .01);
    W.__duration = dur; W.__timelines.root = tl; W.__cues.sort((a, b) => a.t - b.t); W.__ready = true;
  }
  const srcs = [...new Set(S.scenes.flatMap(s => s.type === "shot" ? [s.src] : s.type === "shots" ? s.items.map(i => i.src) : []))];
  const imgLoads = srcs.map(src => new Promise(res => { const im = new Image(); im.onload = () => { IMG[src] = { w: im.naturalWidth, h: im.naturalHeight }; res(); }; im.onerror = () => { console.error("missing image " + src); res(); }; im.src = src; }));
  Promise.all([...fontLoads, ...imgLoads]).then(() => document.fonts.ready).then(build);
})();
