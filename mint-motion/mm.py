#!/usr/bin/env python3
"""mint-motion toolkit. Run from the output folder (it holds reel.html, engine.js, theme.css, spec.js).

  mm.py assets                       fetch GSAP, fonts (Inter + JetBrains Mono), CC0 SFX            -> vendor/ fonts/ sfx/
  mm.py font <fontsource-slug> [w..] fetch a brand font from npm @fontsource (e.g. "plus-jakarta-sans" 500 600)
  mm.py music [--mood uplifting] [--style electronic] [--min 30]   pick + download a CC0 track, verify sha256 -> audio/music.ogg
  mm.py beats                        beat grid of audio/music.ogg -> beats.json (+ writes into spec.js if present)
  mm.py shots <url> [paths...]       real screenshots, desktop 1440x900 + mobile 390x844, full page -> shots/
  mm.py qc                           one still per scene + safe-zone guides + overflow check -> qc/sheet.png
  mm.py render [--name intro] [--fps 30]  frames -> mp4, music-led mix, -14 LUFS, hook still baked into frame 0 -> out/<name>.mp4, <name>-cover.jpg, <name>-poster.jpg
Requires: python3, numpy, playwright (chromium), ffmpeg, node/npm, git."""
import json, os, pathlib, re, shutil, subprocess, sys, tarfile, tempfile, urllib.request, hashlib, wave
HERE = pathlib.Path.cwd()

def sh(*a, **k): return subprocess.run(list(a), check=True, **k)

def npm_file(pkg, inner, dest):
    tmp = pathlib.Path(tempfile.mkdtemp())
    sh("npm", "pack", pkg, "--silent", cwd=tmp, stdout=subprocess.DEVNULL)
    tgz = next(tmp.glob("*.tgz"))
    with tarfile.open(tgz) as t:
        names = [n for n in t.getnames() if re.search(inner, n)]
        for n in names:
            f = t.extractfile(n); out = dest / pathlib.Path(n).name; out.parent.mkdir(parents=True, exist_ok=True); out.write_bytes(f.read())
    shutil.rmtree(tmp); return names

def cmd_assets(_):
    npm_file("gsap@3.12.5", r"package/dist/gsap\.min\.js$", HERE / "vendor")
    npm_file("@fontsource/inter@5", r"files/inter-latin-(500|600|700)-normal\.woff2$", HERE / "fonts")
    npm_file("@fontsource/inter@5", r"files/inter-latin-(400|600)-italic\.woff2$", HERE / "fonts")
    npm_file("@fontsource/jetbrains-mono@5", r"files/jetbrains-mono-latin-(500|700)-normal\.woff2$", HERE / "fonts")
    sfx = HERE / "sfx"; sfx.mkdir(exist_ok=True)
    tmp = pathlib.Path(tempfile.mkdtemp())
    sh("git", "clone", "-q", "--depth", "1", "https://github.com/Calinou/kenney-interface-sounds.git", str(tmp / "k"))
    for a, b in [("tick_002", "tick"), ("select_001", "select"), ("confirmation_001", "ping"), ("bong_001", "bong"), ("click_002", "click")]:
        src = next((tmp / "k").rglob(f"{a}.*")); shutil.copy(src, sfx / f"{b}{src.suffix}")
    sh("git", "clone", "-q", "--depth", "1", "--filter=blob:none", "--no-checkout", "https://github.com/lavenderdotpet/CC0-Public-Domain-Sounds.git", str(tmp / "c"))
    sh("git", "sparse-checkout", "set", "--no-cone", "/Micro Pack - Organic Wooshes/Swish 6.wav", "/Micro Pack - Organic Wooshes/Classic Swish 3.wav",
       "/BB_2HTC Samples Vol 4/Drums/2022-08-17 Approaching the Crash Site - Boom.wav", "/BB_2HTC Samples Vol 4/Drums/2022-04-16 Triple-C THICCC - Big Kick.wav",
       "/BB_2HTC Samples Vol 4/Drums/2023-03-23 Lunar Descent - Reverse.wav", "/BB_2HTC Samples Vol 4/Weird/2022-10-26 Fire in the Mist - Breath Riser.wav", cwd=tmp / "c")
    sh("git", "checkout", "-q", "HEAD", cwd=tmp / "c")
    m = {"Swish 6.wav": "whoosh.wav", "Classic Swish 3.wav": "swish.wav", "Approaching the Crash Site - Boom.wav": "boom.wav", "Big Kick.wav": "kick.wav", "Lunar Descent - Reverse.wav": "reverse.wav", "Breath Riser.wav": "riser.wav"}
    for f in (tmp / "c").rglob("*.wav"):
        for k, v in m.items():
            if f.name.endswith(k): shutil.copy(f, sfx / v)
    (sfx / "CREDITS.txt").write_text("CC0 1.0 (public domain): Kenney Interface Sounds (github.com/Calinou/kenney-interface-sounds); Ben Burnes 2HTC Samples Vol 4 + Micro Pack Organic Wooshes (github.com/lavenderdotpet/CC0-Public-Domain-Sounds).\n")
    shutil.rmtree(tmp); print("assets ok:", sorted(p.name for p in (HERE / "vendor").iterdir()), sorted(p.name for p in sfx.iterdir()))

def cmd_font(args):
    slug, weights = args[0], args[1:] or ["500", "600", "700"]
    pat = "|".join(weights)
    names = npm_file(f"@fontsource/{slug}@5", rf"files/{slug}-latin-({pat})-(normal|italic)\.woff2$", HERE / "fonts")
    print("\n".join(pathlib.Path(n).name for n in names))

def cmd_music(args):
    mood = args[args.index("--mood") + 1] if "--mood" in args else "uplifting"
    style = args[args.index("--style") + 1] if "--style" in args else "electronic"
    mn = float(args[args.index("--min") + 1]) if "--min" in args else 30
    base = "https://github.com/todd-apptivity/video-background-music"
    tmp = pathlib.Path(tempfile.mkdtemp())
    sh("git", "clone", "-q", "--depth", "1", "--filter=blob:none", "--no-checkout", base + ".git", str(tmp / "v"))
    man = json.loads(subprocess.run(["git", "show", "HEAD:manifest.json"], cwd=tmp / "v", capture_output=True, check=True).stdout)
    bad = {"dark", "sad", "scary", "angry", "tense", "melancholic"}
    c = [t for t in man["tracks"] if t.get("license") == "CC0-1.0" and t["durationS"] >= mn and not set(t.get("moods", [])) & bad
         and (mood in t.get("moods", []) or mood == "any") and (style in t.get("styles", []) or style == "any")]
    if not c: c = [t for t in man["tracks"] if t.get("license") == "CC0-1.0" and t["durationS"] >= mn and not set(t.get("moods", [])) & bad and set(t.get("moods", [])) & {"uplifting", "dreamy", "calm", "happy", "epic"}]
    c.sort(key=lambda t: (abs((t.get("bpm") or 110) - 110), -t["durationS"]))
    t = c[0]; url = f"{man.get('releaseBaseUrl', base + '/releases/download')}/{man.get('releaseTag', 'v1')}/{t['file']}"
    (HERE / "audio").mkdir(exist_ok=True); dst = HERE / "audio" / ("music" + pathlib.Path(t["file"]).suffix)
    urllib.request.urlretrieve(url, dst)
    h = hashlib.sha256(dst.read_bytes()).hexdigest()
    if h != t["sha256"]: dst.unlink(); sys.exit(f"checksum mismatch for {t['file']}")
    (HERE / "audio" / "MUSIC-CREDITS.txt").write_text(f"{t['title']} — {t['license']} (public domain), source: {t['source']}, via {base} release {man.get('releaseTag')}. sha256 {h}\n")
    print(json.dumps({"file": str(dst.name), "title": t["title"], "bpm": t.get("bpm"), "moods": t.get("moods"), "styles": t.get("styles"), "duration": t["durationS"], "others": [x["id"] for x in c[1:6]]}))
    shutil.rmtree(tmp)

def load_audio(path, sr, ss=0.0, t=None, mono=False):
    cmd = ["ffmpeg", "-loglevel", "error", "-ss", str(ss)] + (["-t", str(t)] if t else []) + ["-i", str(path), "-f", "f32le", "-ac", "1" if mono else "2", "-ar", str(sr), "-"]
    import numpy as np
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)
    return x if mono else x.reshape(-1, 2).copy()

def cmd_beats(_):
    import numpy as np
    music = next((HERE / "audio").glob("music.*")); sr, hop = 22050, 512
    x = load_audio(music, sr, mono=True)
    n = len(x) // hop; frames = x[: n * hop].reshape(n, hop) * np.hanning(hop)
    spec = np.abs(np.fft.rfft(frames, axis=1))
    flux = np.maximum(0, np.diff(np.log1p(spec), axis=0)).sum(1); flux = np.concatenate([[0], flux]); flux -= flux.mean(); flux /= flux.std() + 1e-9
    fps = sr / hop
    ac = np.correlate(flux, flux, "full")[len(flux) - 1:]
    lags = np.arange(len(ac)); bpm = 60 * fps / np.maximum(lags, 1)
    ok = (bpm >= 80) & (bpm <= 160); lag = lags[ok][np.argmax(ac[ok])]; period = lag / fps
    best = max(range(int(lag)), key=lambda p: flux[p::int(lag)].sum())
    beats = [round(b / fps, 3) for b in np.arange(best, len(flux), lag)]
    vals = np.array([flux[int(b * fps)] for b in beats]); thr = np.percentile(vals, 75)
    strong = [b for b, v in zip(beats, vals) if v >= thr]
    out = {"bpm": round(60 / period, 1), "beats": beats, "strong": strong}
    (HERE / "beats.json").write_text(json.dumps(out))
    sp = HERE / "spec.js"
    if sp.exists():
        s = sp.read_text(); s = re.sub(r"\n?/\*beats\*/.*$", "", s, flags=re.S)
        sp.write_text(s + f"\n/*beats*/ window.SPEC.beats = {json.dumps(beats)}; window.SPEC.strong = {json.dumps(strong)};\n")
    print(json.dumps({"bpm": out["bpm"], "n_beats": len(beats), "first": beats[:6]}))

def cmd_shots(args):
    from playwright.sync_api import sync_playwright
    url, paths = args[0].rstrip("/"), (args[1:] or ["/"])
    out = HERE / "shots"; out.mkdir(exist_ok=True); res = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for name, vp, mob in [("desktop", {"width": 1440, "height": 900}, False), ("mobile", {"width": 390, "height": 844}, True)]:
            ctx = b.new_context(viewport=vp, device_scale_factor=2 if mob else 1, is_mobile=mob, has_touch=mob)
            pg = ctx.new_page()
            for path in paths:
                pg.goto(url + path, wait_until="networkidle", timeout=60000)
                for _ in range(12): pg.mouse.wheel(0, vp["height"]); pg.wait_for_timeout(250)   # trigger lazy/scroll-in content
                pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(600)
                pg.evaluate("""() => document.querySelectorAll('*').forEach(e => { const p = getComputedStyle(e).position; if (p === 'fixed') e.style.position = 'absolute'; else if (p === 'sticky') e.style.position = 'relative'; })""")
                slug = re.sub(r"[^a-z0-9]+", "-", path.lower()).strip("-") or "home"
                f = out / f"{slug}-{name}.png"
                pg.screenshot(path=str(f), full_page=True)
                h = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(f)], capture_output=True, text=True).stdout.strip()
                if int(h.split(",")[1]) > 9000:   # keep the top of very long pages
                    sh("ffmpeg", "-y", "-loglevel", "error", "-i", str(f), "-vf", f"crop=iw:min(ih\\,{9000 if not mob else 9000}):0:0", str(f) + ".png"); os.replace(str(f) + ".png", f)
                res.append({"file": f"shots/{f.name}", "size": h, "title": pg.title()})
            ctx.close()
        b.close()
    print(json.dumps(res, indent=1))

def open_page(p):
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto((HERE / "reel.html").as_uri()); pg.wait_for_function("window.__ready === true", polling=100, timeout=60000)
    W, H = pg.evaluate("[window.__W, window.__H]"); pg.set_viewport_size({"width": W, "height": H})
    meta = json.loads(pg.evaluate("JSON.stringify({d: __duration, cues: __cues, poster: window.__poster || null, hook: window.__hookStill || 2})"))
    return b, pg, meta, errs, W, H

def seek(pg, t): pg.evaluate(f"void window.__timelines.root.seek({t:.4f}, false)")

def cmd_qc(_):
    from playwright.sync_api import sync_playwright
    (HERE / "qc").mkdir(exist_ok=True)
    with sync_playwright() as p:
        b, pg, meta, errs, W, H = open_page(p)
        starts = sorted({0.0} | {c["t"] for c in meta["cues"] if c["kind"] in ("scene", "toend")}) + [meta["d"]]
        ts = [max(.3, nb - .75) for nb in starts[1:]]
        issues = []; paths = []
        for i, t in enumerate(ts):
            seek(pg, t)
            over = pg.evaluate("""() => { const out = []; document.querySelectorAll('.scene').forEach(s => { if (getComputedStyle(s).visibility !== 'visible') return;
              const r = s.getBoundingClientRect(); s.querySelectorAll('.say, .row, .dev, .cta, .big, .note, .tag').forEach(e => { const q = e.getBoundingClientRect();
              if (q.right > innerWidth - 4 || q.left < 4 || q.bottom > innerHeight - 4 || q.top < 4 || (e.matches('.say, .note, .tag') && e.scrollWidth > e.clientWidth + 2)) out.push((e.className + ' ' + e.textContent).slice(0, 70)); }); }); return out; }""")
            issues += [f"{t:.1f}s overflow: {o}" for o in over]
            if H > W:
                pg.evaluate("""() => { if (document.getElementById('qcg')) return; const g = document.createElement('div'); g.id = 'qcg'; g.style.cssText = 'position:absolute;inset:0;z-index:99;pointer-events:none';
                  g.innerHTML = '<div style="position:absolute;left:0;right:0;top:0;height:210px;background:rgba(255,0,0,.2)"></div><div style="position:absolute;left:0;right:0;bottom:0;height:420px;background:rgba(255,0,0,.2)"></div><div style="position:absolute;right:0;top:900px;width:140px;bottom:420px;background:rgba(255,160,0,.2)"></div>';
                  document.getElementById('root').appendChild(g); }""")
            f = HERE / "qc" / f"s{i:02d}.png"; pg.screenshot(path=str(f)); paths.append(f)
        b.close()
    args = sum([["-i", str(x)] for x in paths], [])
    n = len(paths); flt = "".join(f"[{i}]scale={360 if H > W else 640}:-1[s{i}];" for i in range(n)) + "".join(f"[s{i}]" for i in range(n)) + (f"hstack={n}" if n > 1 else "null")
    sh("ffmpeg", "-y", "-loglevel", "error", *args, "-filter_complex", flt, str(HERE / "qc" / "sheet.png"))
    for x in paths: x.unlink()
    print(json.dumps({"duration": meta["d"], "frames_at": [round(t, 2) for t in ts], "errors": errs, "issues": issues, "sheet": "qc/sheet.png"}, indent=1))

def db(g): return 10 ** (g / 20)

def mix(meta, wav, sr=48000):
    import numpy as np
    dur = meta["d"]; n = int(sr * dur)
    mfile = next((HERE / "audio").glob("music.*"), None)
    music = np.zeros((n, 2), np.float32)
    if mfile:
        m = load_audio(mfile, sr, t=dur + 1)
        if len(m) < n: m = np.concatenate([m] * (n // len(m) + 1))
        m = m[:n]; m /= max(1e-6, np.abs(m).max())
        end = next((c["t"] for c in meta["cues"] if c["kind"] == "toend"), dur - 4)
        pts = [(0, 0), (.35, 1), (end - 1.0, 1), (end - .1, .3), (end, 1), (dur - 1.2, .95), (dur, 0)]
        vol = np.interp(np.arange(n), [p[0] * sr for p in pts], [p[1] for p in pts]).astype(np.float32)
        music = m * vol[:, None] * db(-4)
    fx = np.zeros((n, 2), np.float32); cache = {}
    def put(name, t, gain=0.0, fade_in=0.0):
        p = next((HERE / "sfx").glob(name + ".*"), None)
        if not p: return
        if name not in cache: cache[name] = load_audio(p, sr)
        x = cache[name].copy() * db(gain)
        if fade_in: k = min(len(x), int(sr * fade_in)); x[:k] *= np.linspace(0, 1, k)[:, None]
        a = int(sr * t)
        if a < 0: x = x[-a:]; a = 0
        b = min(n, a + len(x)); fx[a:b] += x[: b - a]
    for c in meta["cues"]:
        t, k = c["t"], c["kind"]
        if k == "scene": put("whoosh", t - .25, -17)
        elif k == "whoosh": put("swish", t - .1, -15)
        elif k == "tick": put("tick", t, -26)
        elif k == "ping": put("ping", t, -24)
        elif k == "toend": put("riser", t - 3.5, -13, fade_in=1.5); put("reverse", t - 1.16, -11)
        elif k == "hit": put("boom", t, -2); put("kick", t, -4)
    out = music + fx
    k = int(sr * .8); out[-k:] *= np.linspace(1, 0, k)[:, None] ** 1.5
    out = np.tanh(out * 1.1) / np.tanh(1.1); out *= db(-1) / max(1e-6, np.abs(out).max())
    with wave.open(str(wav), "wb") as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(sr); wf.writeframes((out * 32767).astype(np.int16).tobytes())

def cmd_render(args):
    from playwright.sync_api import sync_playwright
    fps = int(args[args.index("--fps") + 1]) if "--fps" in args else 30
    name = args[args.index("--name") + 1] if "--name" in args else "intro"
    od = HERE / "out"; od.mkdir(exist_ok=True); tmp = od / "_video.mp4"; wav = od / "_mix.wav"; final = od / f"{name}.mp4"; poster = od / f"{name}-poster.jpg"
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "medium",
                           "-crf", "17", "-pix_fmt", "yuv420p", "-r", str(fps), str(tmp)], stdin=subprocess.PIPE)
    with sync_playwright() as p:
        b, pg, meta, errs, W, H = open_page(p)
        n = int(round(meta["d"] * fps)); pt = meta["poster"] or meta["hook"]
        for i in range(n):
            seek(pg, i / fps); ff.stdin.write(pg.screenshot(type="jpeg", quality=95))
            if i % 150 == 0: print(f"frame {i}/{n}", file=sys.stderr, flush=True)
        seek(pg, meta["hook"]); pg.screenshot(path=str(od / f"{name}-cover.jpg"), type="jpeg", quality=95)
        seek(pg, pt); pg.screenshot(path=str(poster), type="jpeg", quality=95)
        b.close()
    ff.stdin.close(); ff.wait()
    mix(meta, wav)
    # poster baked into frame 0 so every platform's idle thumbnail is the best still (per latent-spaces/brag)
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-i", str(od / f"{name}-cover.jpg"), "-i", str(wav), "-filter_complex", "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]",
       "-map", "[v]", "-map", "2:a", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", "48000",
       "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", str(final))
    tmp.unlink(); wav.unlink()
    print(json.dumps({"out": str(final), "duration": meta["d"], "frames": n, "size": f"{W}x{H}", "errors": errs}))

if __name__ == "__main__":
    c = sys.argv[1] if len(sys.argv) > 1 else "help"
    {"assets": cmd_assets, "font": cmd_font, "music": cmd_music, "beats": cmd_beats, "shots": cmd_shots, "qc": cmd_qc, "render": cmd_render}.get(c, lambda a: print(__doc__))(sys.argv[2:])
