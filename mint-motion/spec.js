window.SPEC = {
  format: "vertical",
  url: "modconbuilders.com",
  brand: {
    name: "Modcon Builders", sub: "— Hyderabad · UAE", logo: "brand/logo.svg",
    // Site is light (white/ink/gold); the video stays dark: near-black ink with Modcon gold accents.
    colors: { bg: "#1F2023", bg2: "#34353A", deep: "#121214", fg: "#ECECEC", accent: "#A39B8A", accent2: "#D9CFBA", accent3: "#6F6858", cta: "#A39B8A", "cta-fg": "#121214" },
    fonts: [
      { src: "fonts/Satoshi-Variable.woff2", weight: 600 },
      { src: "fonts/Satoshi-Variable.woff2", weight: 500 },
      { src: "fonts/instrument-serif-latin-400-italic.woff2", weight: 600, style: "italic" },
      { src: "fonts/instrument-serif-latin-400-italic.woff2", weight: 500, style: "italic" },
      { src: "fonts/jetbrains-mono-latin-500-normal.woff2", weight: 500, role: "mono" },
      { src: "fonts/jetbrains-mono-latin-700-normal.woff2", weight: 700, role: "mono" }
    ]
  },
  scenes: [
    { type: "hook", eyebrow: "Hyderabad · UAE", lines: ["Building *beyond*", "expectations."] },
    { type: "shot", device: "browser", src: "shots/home-desktop.png", url: "modconbuilders.com", title: "Iconic, sustainable *landmarks.*", scroll: 0.3, hold: 2.6 },
    { type: "shots", title: "Book a site visit from *any* phone.", items: [ { src: "shots/home-mobile.png" }, { src: "shots/modcon-one-mobile.png" }, { src: "shots/contact-mobile.png" } ], scroll: 0.3 },
    { type: "list", eyebrow: "MODCON ONE · Tukkuguda", items: ["4.5 acres on the Srisailam Highway", "3 & 4 BHK premium villaments", "Retail, offices, F&B and healthcare", "About 10–15 min to RGIA airport"] },
    { type: "end", tagline: "A complete mixed development in Tukkuguda.", cta: "Book a site visit" }
  ]
};

/*beats*/ window.SPEC.beats = [0.464, 1.184, 1.904, 2.624, 3.344, 4.063, 4.783, 5.503, 6.223, 6.943, 7.663, 8.382, 9.102, 9.822, 10.542, 11.262, 11.981, 12.701, 13.421, 14.141, 14.861, 15.581, 16.3, 17.02, 17.74, 18.46, 19.18, 19.9, 20.619, 21.339, 22.059, 22.779, 23.499, 24.218, 24.938, 25.658, 26.378, 27.098, 27.818, 28.537, 29.257, 29.977, 30.697, 31.417, 32.136, 32.856, 33.576, 34.296, 35.016, 35.736, 36.455, 37.175, 37.895, 38.615, 39.335, 40.054, 40.774, 41.494, 42.214, 42.934, 43.654, 44.373, 45.093, 45.813, 46.533, 47.253, 47.972, 48.692, 49.412, 50.132, 50.852, 51.572, 52.291, 53.011, 53.731, 54.451]; window.SPEC.strong = [1.904, 6.223, 15.581, 19.9, 23.499, 24.218, 26.378, 28.537, 29.257, 31.417, 32.856, 33.576, 34.296, 43.654, 47.253, 50.132, 50.852, 52.291, 53.731];
