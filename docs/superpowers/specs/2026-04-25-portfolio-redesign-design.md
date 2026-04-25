# Portfolio redesign — design spec

**Date:** 2026-04-25
**Owner:** Sam Clarke
**Repo:** github.com/alruban/portfolio → samuelclarke.dev

## 1. Purpose

Replace the existing portfolio (random floating-SVG single-page React app) with a design that converts freelance/client leads. Sam's primary lead source is Storetasker; visitors are typically Shopify merchants evaluating whether to hire him. Goals, in order:

1. Establish credibility quickly (named clients, real work).
2. Make it easy to see the work without leaving the site.
3. Provide a frictionless path to contact.

Out of scope: job-hunt framing, blog, deep written case studies, CMS, testimonials.

## 2. Concept

A single-page, single-stage **rolodex of project "plates."** The visual vocabulary is **editorial × brutalist × camera lens-test card**. Every plate is a calibration card on warm orange paper, with strong typographic hierarchy and exposed page hardware (spindle, hole-punches, registration marks, type specimens).

The **right pane of each project plate is an impressionist composition** built from test-card motifs (starbursts, zone plates, crosshair targets, checker patches, an accent diamond) — *not* a screenshot. Real screenshots and the live site appear only inside the **preview modal**, which opens on demand.

## 3. Stack structure (9 plates)

| № | File code | Plate | Purpose |
|---|---|---|---|
| 00 | SC.W.00.IDX | **Index / Cover** | Name, role, short bio (about lives here), basic stats. "START → 01" enters the work. |
| 01–07 | SC.W.0n.XYZ | **Selected Work** | One project per plate. Curate from existing seven: Bear Brick, Patchworks, Smiley, Cedar & Hyde, Dropdeck, Freetrain, Orb. Order by impact, recent-first. |
| 08 | SC.W.08.CTC | **Correspondence** | Contact links: email, Storetasker, GitHub, CV. "RETURN → 00" loops back. |

Stack wraps at the ends (08 → 00, 00 → 08).

**Numbering convention:** project plates' side-rail label reads `№ {1..7} / 07 — SELECTED WORK` (project N of 7). The cover rail reads `INDEX`, the contact rail reads `CORRESPONDENCE`. The foot pager uses absolute plate numbers (00–08) for prev/next.

## 4. Card anatomy

Every plate shares a chassis:

- **Hole-punches** (top, two black slabs)
- **Side rail** — ink-rust block running the full height with a vertical microtext label and an oversized cropped serif numeral bleeding off the bottom
- **Type-specimen tape** at the top — file code in a black-rust block + alphabet/numeral specimen
- **Header bar** — file name, year (Roman), category, status pill
- **Body** (left) — large serif title with one italic word in saturated accent, a 5px hard rule slamming through it, tabular meta grid (role / team / stack / build / year / state)
- **Preview pane** (right) — test-plate composition (starburst + zone plate + crosshair targets + checker + one accent diamond), with calibration-style top tape ("PLATE 03 / 07 — LENS · SHARPNESS · TEST") and bottom tape (REF code + barcode + "OK")
- **Foot** — prev pill / "PREVIOUS" / nav hint / "NEXT" / next pill

Cover (00) and contact (08) replace the body+preview split with their own layouts but keep the chassis (rail, tape, header, foot).

## 5. Page surround

The page itself is a calibration card. Outside the active plate:

- **Spindle** — two raw rust bars at the top center (the metaphorical rolodex spindle)
- **Stack stubs** — two card edges peeking above the active plate, so the stack reads as physical
- **Calibration motifs** — type specimens at top + bottom edges, vertical resolution lines on the sides, a starburst, zone plate, crosshair target, a numbered square ("4"), and microtext labels running along the edges. These are content, not texture.

## 6. Palette

Orange family only, no black. Hierarchy comes from weight, scale, and rule-thickness.

| Token | Hex | Use |
|---|---|---|
| `--page` | `#f5dfb1` | Page surround |
| `--card` | `#ecc788` | Card body |
| `--warm` | `#d9a35d` | Secondary surface (rail interior on cover only, accents) |
| `--mid` | `#a35a1f` | Mid-tone (label text, hairlines) |
| `--ink` | `#5a2c0d` | Borders, type, dark slabs (replaces black) |
| `--accent` | `#c4661c` | Saturated pop — *italic accent word, the diamond, hover/active states*. Used sparingly. |

## 7. Typography

| Role | Family | Notes |
|---|---|---|
| Display title | Times New Roman / Georgia serif | Uppercase, weight 700, line-height 0.86, letter-spacing −0.04em. One italic word per title in `--accent`. |
| Body prose | Georgia serif | Bio, briefs, modal copy. |
| Meta / tape / labels / nav | `ui-monospace`, JetBrains Mono fallback | Uppercase, letter-spacing 0.18–0.32em depending on size. |
| Numerals (rail) | Times New Roman serif | 240px+, line-height 0.8. |

## 8. Interactions

### 8.1 Stack navigation

- **Scroll-snap** on the stack container; one plate per snap.
- **Keyboard:** ←/→ to move between plates, Home → 00, End → 08, Enter on a project plate → open preview modal.
- **Touch:** horizontal swipe.
- **Click:** prev/next pills in the foot.
- Wrap from 08 → 00 and 00 → 08.

### 8.2 Project preview modal

A single-faced card never flips. Clicking **"→ PREVIEW"** in the foot opens a full-screen modal overlay with:

- A chunky ink bezel framing a "live feed" surface
- Calibration tape header: "LIVE FEED · WEAREPATCHWORKS.COM · 1280×720 · SCALED"
- The site rendered inside (iframe by default; static screenshot if blocked / password-protected)
- A controls row: "POINTER · DISABLED" / "→ INTERACT" toggle on the left; "← PREV PROJECT" / "→ VISIT LIVE" / "→ NEXT PROJECT" on the right
- Close on `Esc` or the close pill in the tape

While the modal is open, prev/next jump between projects without closing it; the iframe loads the next site lazily.

### 8.3 Iframe behavior

- **Lazy:** `src` set only when the project becomes the modal's active view; cleared when navigated away.
- **Desktop-viewport scaled:** rendered at fixed 1280×800, CSS `transform: scale()` to fit the bezel.
- **Pointer-events disabled by default** on the iframe; "→ INTERACT" toggles to `auto`. "→ VISIT LIVE" always opens the live URL in a new tab.
- **Sandbox:** `sandbox="allow-scripts allow-same-origin"` (no `allow-top-navigation`).
- **Per-project mode** declared in data: `previewMode: 'iframe' | 'screenshot'`.
- **Failure detection:** if the iframe doesn't fire `load` within ~3s, swap to the screenshot and show a "STILL · FRAME — embed unavailable" tape on the bezel.
- **Known-screenshot projects** (declared up front): Cedar & Hyde (password), Dropdeck (App Store page).

## 9. Data model

```ts
type Plate = CoverPlate | ProjectPlate | ContactPlate;

type CoverPlate = {
  kind: 'cover';
  number: '00';
  fileCode: 'SC.W.00.IDX';
  name: { stem: string; tail: string }; // SAM CLARKE — front end.
  bio: string;
  stats: Array<{ label: string; value: string }>; // YEARS / STACK / BASED
};

type ProjectPlate = {
  kind: 'project';
  number: string;          // "03"
  fileCode: string;        // "SC.W.03.PWX"
  title: { stem: string; tail: string }; // PATCH- / works.
  category: string;        // "Shopify 2.0"
  year: number;            // 2023
  yearRoman: string;       // "MMXXIII"
  status: 'LIVE' | 'ARCHIVED' | 'DRAFT';
  meta: {
    role: string; team: string; stack: string;
    build: string; year: string; state: string;
  };
  brief?: string;          // 2–3 sentences for modal
  outcome?: string;        // single concrete result line
  liveUrl: string;
  previewMode: 'iframe' | 'screenshot';
  screenshot?: string;     // required when previewMode = 'screenshot'
};

type ContactPlate = {
  kind: 'contact';
  number: '08';
  fileCode: 'SC.W.08.CTC';
  intro: string;
  links: Array<{ label: string; href: string }>;
};
```

A single `plates: Plate[]` array in `src/data/plates.ts` is the source of truth.

## 10. Component boundaries

```
src/
  App.tsx                  # mounts <Stack/>
  main.tsx                 # entry (replaces index.tsx)
  components/
    Stack.tsx              # owns scroll-snap, keyboard/touch nav, current-plate state
    Card.tsx               # chassis: rail + tape + head + body + foot composition
    CardCover.tsx          # PLATE 00 layout (slots into Card)
    CardProject.tsx        # PLATE 01–07 layout
    CardContact.tsx        # PLATE 08 layout
    TestPlate.tsx          # the preview pane: starburst + zone plate + targets + checker + accent
    Spindle.tsx            # top bars
    StackBackdrop.tsx      # the surrounding calibration motifs
    PreviewModal.tsx       # iframe overlay + controls + nav
    IframeViewport.tsx     # scaled, sandboxed, lazy-loaded iframe with screenshot fallback
  hooks/
    useStackNavigation.ts  # scroll-snap + ←/→ + swipe
    useIframeReady.ts      # load-or-fallback timeout
    useHashPlate.ts        # syncs current plate ↔ location.hash (#/03)
  data/
    plates.ts
    screenshots/           # fallback PNGs co-located with data
  styles/
    tokens.css             # palette CSS vars + type ramp (global)
    base.css               # resets, body, fonts (global)
  # plus co-located *.module.css next to each component
  fonts/                   # current woffs (or replacements)
```

Each component answers: what does it render, what props does it take, what does it depend on. The `Card` chassis is layout-only; `CardCover/Project/Contact` slot content into named regions.

## 11. Toolchain modernization

Current stack is React 18, Webpack 5, Tailwind 3, PostCSS+Sass+Babel, three.js (unused). Target:

| | From | To |
|---|---|---|
| Bundler | Webpack 5 + html-webpack-plugin + dev-server | **Vite 5** |
| Compiler | Babel 7 + custom presets | esbuild (via Vite) |
| Framework | React 18 | **React 19** |
| Types | TypeScript 4.9 | **TypeScript 5.x** |
| Styling | Tailwind 3 + PostCSS + Sass | **Vanilla CSS Modules + CSS custom properties** (drop Tailwind, Sass, PostCSS plugin chain) |
| Routing | react-router-dom 6 | *(removed — single page)* |
| Head | react-helmet-async + react-head | *(replaced by React 19 native metadata)* |
| i18n | @rubancorp/react-translate-json | *(removed — single language)* |
| 3D | three.js | *(removed — unused)* |
| Lint | ESLint 8 (legacy config) | ESLint 9 flat config |
| Format | Prettier | Prettier 3 |
| Analytics | `analytics` + GA UA plugin | direct GA4 (gtag) — simpler |

Drop also: `tailwindcss`, `autoprefixer`, every `postcss-*`, `prop-types`, `minimist`, `concurrently`, every `@babel/*`, `webpack-*`, `*-loader`, `mini-css-extract-plugin`, `lightningcss` (Vite handles), `cssnano`, `stylelint*`, `sass`, `sass-loader`.

**Styling approach:** Each component gets a co-located `*.module.css`. CSS variables for the palette + type ramp live in a single global `src/styles/tokens.css`; resets and base typography in `src/styles/base.css`. No utility classes — write CSS deliberately.

`pnpm-lock.yaml` regenerated. Node pinned via `.nvmrc` to current LTS.

## 12. Page-load and SEO

- **Title:** "Sam Clarke — front end · selected work 2021–2025"
- **Meta description:** brief, lead-gen-oriented.
- **OpenGraph image:** export PLATE 00 to a static OG image at build time (one-off).
- **Favicons:** keep existing set; verify still loaded via `<link>` in `index.html`.
- **Fonts:** preload Recoleta + Graphik woff2 if kept; otherwise swap to Times New Roman / system stack and remove font assets.
- **Performance budget:** initial route under 200 KB JS gzipped; iframes don't count (lazy).
- **GA4** loaded inline.

## 13. Mobile

The diorama survives, simplified:

- Spindle and stack stubs hidden below 640px.
- Side rail collapses to a compact 28px strip (numeral only).
- Body and preview stack vertically.
- Type-specimen tape truncates.
- Surround calibration motifs reduced to just the top + bottom resolution-line bars; verticals/sides hidden.
- Navigation: vertical swipe between plates instead of horizontal.
- Preview modal: full-screen, bezel margin reduced; iframe scale recalculated for portrait viewport.

## 14. Risks & open items

| Risk | Mitigation |
|---|---|
| Some sites block iframe embedding (X-Frame-Options / CSP) | Per-project `previewMode` + `useIframeReady` fallback to screenshot. Pre-test each site during build of `plates.ts`. |
| Live sites change after launch (broken URLs, redesigns) | `liveUrl` is data; screenshots can be regenerated. No CMS dependency. |
| Project order matters for first impression | Curate during data authoring; recommend lead with Patchworks or Bear Brick (most visually striking + Shopify 2.0 credible). |
| Single-page = harder to share a specific project | **Included:** deep-link hash routing — `#/03` selects plate 03 on load and updates as the user navigates. No router lib; a small `useHashPlate` hook reads/writes `location.hash`. |
| Existing site is live and gets traffic | Build on a feature branch, deploy preview before cut-over. |

## 15. Build phases (suggested)

This is one project, but the work splits naturally:

1. **Toolchain swap** — Vite + React 19 + TS 5 + Tailwind 4, with the *existing* design still rendering. Validates the new build before any visual change.
2. **Design system + chassis** — palette tokens, typography, `Card` chassis + `Spindle` + `StackBackdrop`. Render one static plate.
3. **Plate variants** — `CardCover`, `CardProject`, `CardContact`, `TestPlate`. Wire to data.
4. **Stack navigation** — `Stack` + `useStackNavigation` (scroll-snap, keys, swipe).
5. **Preview modal + iframe** — `PreviewModal` + `IframeViewport` + screenshot fallback.
6. **Polish + mobile** — surround motifs, type tape truncation, mobile breakpoints, OG image, GA4.
7. **Cut-over** — deploy from feature branch, swap DNS / replace existing.

## 16. Success criteria

- Landing → first impression of work in under 3 seconds (no fade-in stalls, no layout shift).
- A merchant can preview a live site without leaving the page in 1 click.
- Contact path is reachable in ≤2 keystrokes from anywhere in the stack.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95.
- Site is shippable on phones (320px width minimum) without horizontal scroll.
