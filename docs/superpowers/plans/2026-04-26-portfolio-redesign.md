# Portfolio redesign — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing portfolio with a 9-plate rolodex / lens-test-card single-page React app on a modern toolchain (Vite + React 19 + TS 5 + CSS Modules), driven by a typed plate data model and an iframe-or-screenshot preview modal.

**Architecture:** Single-page, no router. A `<Stack/>` component owns horizontal scroll-snap navigation across an array of `Plate` data; each plate renders via a `<Card/>` chassis with a variant component (`CardCover`, `CardProject`, `CardContact`). Project plates open a `<PreviewModal/>` that lazily loads an iframe (or a static screenshot fallback when embedding fails / is unavailable). Hash routing (`#/03`) syncs to the active plate. All design tokens live in `src/styles/tokens.css` as CSS custom properties; per-component styling uses co-located `*.module.css`. No global utility framework.

**Tech stack:** React 19, TypeScript 5, Vite 6, CSS Modules, Vitest + Testing Library + jsdom, ESLint 9 (flat config), Prettier 3, GA4 (direct gtag).

**Spec reference:** `docs/superpowers/specs/2026-04-25-portfolio-redesign-design.md` — every visual decision (palette, typography, card anatomy, calibration motifs) is locked there. This plan is the *how*; the spec is the *what*.

**Project list (initial order, user can rearrange in Task 6):**
| № | Project | Year | preview |
|---|---|---|---|
| 01 | Dropdeck | 2025 | screenshot (App Store blocks) |
| 02 | Bear Brick | 2023 | iframe |
| 03 | Patchworks | 2023 | iframe |
| 04 | Cedar & Hyde | 2023 | screenshot (password) |
| 05 | Smiley | 2022 | iframe |
| 06 | Orb | 2022 | iframe |
| 07 | Freetrain | 2021 | iframe |

---

## File map

Created or rewritten:

```
portfolio/
├── index.html                              (NEW — moved from src/)
├── package.json                            (REWRITTEN)
├── pnpm-lock.yaml                          (REGENERATED)
├── vite.config.ts                          (NEW)
├── vitest.config.ts                        (NEW)
├── tsconfig.json                           (REWRITTEN)
├── tsconfig.node.json                      (NEW)
├── eslint.config.js                        (NEW — flat config)
├── .prettierrc.json                        (NEW)
├── .editorconfig                           (KEEP)
├── .gitignore                              (KEEP, already updated)
├── public/
│   ├── favicon.ico                         (moved from src/favicons)
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-384x384.png
│   ├── site.webmanifest
│   └── screenshots/
│       ├── dropdeck.png                    (placeholder, real capture later)
│       └── cedar-hyde.png                  (placeholder)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Stack.tsx + Stack.module.css
│   │   ├── Card.tsx + Card.module.css
│   │   ├── CardCover.tsx + CardCover.module.css
│   │   ├── CardProject.tsx + CardProject.module.css
│   │   ├── CardContact.tsx + CardContact.module.css
│   │   ├── TestPlate.tsx + TestPlate.module.css
│   │   ├── Spindle.tsx + Spindle.module.css
│   │   ├── StackBackdrop.tsx + StackBackdrop.module.css
│   │   ├── PreviewModal.tsx + PreviewModal.module.css
│   │   └── IframeViewport.tsx + IframeViewport.module.css
│   ├── hooks/
│   │   ├── useHashPlate.ts
│   │   ├── useStackNavigation.ts
│   │   └── useIframeReady.ts
│   ├── data/
│   │   ├── plates.ts
│   │   └── types.ts
│   ├── lib/
│   │   └── analytics.ts
│   └── styles/
│       ├── tokens.css
│       └── base.css
└── tests/
    ├── setup.ts
    ├── useHashPlate.test.ts
    ├── useIframeReady.test.ts
    └── PreviewModal.test.tsx
```

Removed entirely:
- `src/App.tsx` (old), `src/index.tsx`, `src/index.html`, `src/translations/`, `src/css/`, `src/data/portfolio.ts`, `src/data/routes.ts`, `src/utils/`, `src/components/*` (old set), `src/layout/`, `src/pages/`, `src/svgs/` (entire dir; new design uses inline SVG/CSS for motifs), `src/fonts/` (system stack only).
- `webpack.*.js`, `babel.config.json`, `postcss.config.js`, `tailwind.config.js`, `.eslintrc.js`, `.prettierrc.js`, `.stylelintrc.js`, `types/`, `dist/`.

---

## Task 1 — Wipe legacy and scaffold fresh Vite project

**Files:**
- Delete: all legacy listed above
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`

- [ ] **Step 1: Verify clean working tree, create feature branch**

```bash
git status                                # must show clean
git checkout -b redesign/rolodex
```

- [ ] **Step 2: Move favicons + manifest to /public, then delete legacy**

```bash
mkdir -p public public/screenshots
mv src/favicons/favicon.ico public/
mv src/favicons/favicon-16x16.png public/
mv src/favicons/favicon-32x32.png public/
mv src/favicons/apple-touch-icon.png public/
mv src/favicons/android-chrome-192x192.png public/
mv src/favicons/android-chrome-384x384.png public/
mv src/favicons/site.webmanifest public/
# discard the rest (mstile, browserconfig, 384x duplicate handled below)
rm -rf src/ types/ dist/
rm -f webpack.common.js webpack.dev.js webpack.prod.js
rm -f babel.config.json postcss.config.js tailwind.config.js
rm -f .eslintrc.js .prettierrc.js .stylelintrc.js
rm -f pnpm-lock.yaml package.json
```

- [ ] **Step 3: Generate placeholder screenshot fallbacks**

These are stand-ins until real captures are taken. They satisfy the data contract.

```bash
# 1×1 transparent PNG, base64-decoded — placeholder until real screenshots
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xfc\xff\xff?\x00\x05\xfe\x02\xfe\xa3\x35\x81\x84\x00\x00\x00\x00IEND\xaeB`\x82' > public/screenshots/dropdeck.png
cp public/screenshots/dropdeck.png public/screenshots/cedar-hyde.png
```

- [ ] **Step 4: Write `package.json`**

Create `/Users/samuelclarke/Desktop/github/portfolio/package.json`:

```json
{
  "name": "portfolio",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "homepage": "https://www.samuelclarke.dev/",
  "description": "Portfolio for Sam Clarke's web development projects",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "engines": { "node": ">=20" },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.15.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.1.0",
    "globals": "^15.13.0",
    "jsdom": "^25.0.1",
    "prettier": "^3.4.0",
    "typescript": "^5.6.3",
    "typescript-eslint": "^8.18.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 5: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 6: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 7: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]_[local]_[hash:base64:5]',
    },
  },
});
```

- [ ] **Step 8: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
```

- [ ] **Step 9: Write root `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#f5dfb1" />
    <title>Sam Clarke — front end · selected work 2021–2025</title>
    <meta name="description" content="Sam Clarke — front-end developer. Selected commerce, tooling, and Shopify work, 2021–2025." />
    <meta property="og:title" content="Sam Clarke — front end" />
    <meta property="og:description" content="Selected work, 2021–2025." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.samuelclarke.dev" />
    <link rel="canonical" href="https://www.samuelclarke.dev" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 10: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 11: Write `src/App.tsx` (placeholder)**

```tsx
export default function App() {
  return <main>portfolio loading…</main>;
}
```

- [ ] **Step 12: Stub global CSS files so main.tsx imports resolve**

Create `src/styles/tokens.css` and `src/styles/base.css` empty (real content in Task 4 + 5):

```bash
mkdir -p src/styles
: > src/styles/tokens.css
: > src/styles/base.css
```

- [ ] **Step 13: Install + run dev server**

```bash
pnpm install
pnpm dev
```

Expected: Vite starts on `http://localhost:5173/`, page renders text "portfolio loading…", no console errors.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: scaffold fresh vite + react 19 + ts 5 project, drop legacy"
```

---

## Task 2 — ESLint, Prettier, Vitest setup

**Files:**
- Create: `eslint.config.js`, `.prettierrc.json`, `tests/setup.ts`

- [ ] **Step 1: Write `eslint.config.js` (flat config)**

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.superpowers'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    settings: { react: { version: 'detect' } },
  }
);
```

- [ ] **Step 2: Add `@eslint/js` to devDependencies and install**

```bash
pnpm add -D @eslint/js
```

- [ ] **Step 3: Write `.prettierrc.json`**

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "semi": true,
  "arrowParens": "always"
}
```

- [ ] **Step 4: Write `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());
```

- [ ] **Step 5: Verify lint + tests run**

```bash
pnpm lint                 # expect no errors
pnpm test:run             # expect "no test files found" — fine
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: eslint flat config, prettier, vitest setup"
```

---

## Task 3 — Design tokens (palette + type ramp)

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Write the full token sheet**

Replace the empty `src/styles/tokens.css` with:

```css
:root {
  /* PALETTE — orange family only, no black. See spec §6. */
  --c-page:    #f5dfb1;
  --c-card:    #ecc788;
  --c-warm:    #d9a35d;
  --c-mid:     #a35a1f;
  --c-ink:     #5a2c0d;
  --c-accent:  #c4661c;

  /* TYPOGRAPHY */
  --f-serif: 'Times New Roman', Georgia, 'Iowan Old Style', serif;
  --f-mono:  ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
  --f-body:  Georgia, 'Iowan Old Style', serif;

  /* type ramp — display titles use --t-display, tape/labels use --t-mono-* */
  --t-display: 700 84px/0.86 var(--f-serif);
  --t-display-l: 700 64px/0.86 var(--f-serif);
  --t-display-m: 700 48px/0.88 var(--f-serif);
  --t-display-s: 700 30px/0.88 var(--f-serif);

  --t-mono-xs: 700 9px/1 var(--f-mono);
  --t-mono-s:  700 10px/1 var(--f-mono);
  --t-mono-m:  700 11px/1 var(--f-mono);
  --t-mono-l:  700 12px/1 var(--f-mono);

  --t-body: 400 14px/1.45 var(--f-body);
  --t-body-s: 400 12px/1.45 var(--f-body);

  /* tracking */
  --tr-mono-tight: 0.14em;
  --tr-mono: 0.18em;
  --tr-mono-loose: 0.22em;
  --tr-mono-vloose: 0.32em;
  --tr-display: -0.04em;

  /* RULES & STRUCTURE */
  --r-thick: 3px;
  --r-mid: 2px;
  --r-thin: 1px;
  --strike: 5px;
  --shadow-card: 14px 14px 0 var(--c-ink);
  --shadow-card-sm: 6px 6px 0 var(--c-ink);

  /* SPACING (scale of 4) */
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 20px;
  --s-6: 24px;
  --s-8: 32px;
  --s-10: 40px;
  --s-12: 48px;
  --s-16: 64px;

  /* MOTION */
  --t-fast: 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
  --t-mid: 400ms cubic-bezier(0.2, 0.8, 0.2, 1);

  /* LAYOUT */
  --card-aspect: 5 / 3;
  --card-max: 820px;
  --rail-w: 64px;
}

@media (max-width: 640px) {
  :root {
    --t-display: 700 56px/0.88 var(--f-serif);
    --t-display-l: 700 44px/0.88 var(--f-serif);
    --rail-w: 40px;
    --shadow-card: 8px 8px 0 var(--c-ink);
  }
}
```

- [ ] **Step 2: Sanity-check tokens render**

In `src/App.tsx`, temporarily swap to verify tokens load:

```tsx
export default function App() {
  return (
    <main style={{ background: 'var(--c-page)', color: 'var(--c-ink)', padding: 'var(--s-8)', minHeight: '100vh' }}>
      <h1 style={{ font: 'var(--t-display)', letterSpacing: 'var(--tr-display)' }}>SAM CLARKE.</h1>
    </main>
  );
}
```

Run `pnpm dev`, confirm warm page background and giant serif title.

Revert App.tsx to placeholder (`<main>portfolio loading…</main>`) before committing.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: design tokens — orange palette, type ramp, layout vars"
```

---

## Task 4 — Base CSS (resets, body, fonts)

**Files:**
- Modify: `src/styles/base.css`

- [ ] **Step 1: Write base styles**

```css
*, *::before, *::after { box-sizing: border-box; }

html, body, #root {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: var(--c-page);
  color: var(--c-ink);
  font: var(--t-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body { overflow-x: hidden; overflow-y: auto; }

#root { display: block; }

button {
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

a { color: inherit; text-decoration: none; }

img, svg { display: block; max-width: 100%; }

/* selection */
::selection { background: var(--c-accent); color: var(--c-page); }

/* focus */
:focus-visible {
  outline: var(--r-mid) solid var(--c-accent);
  outline-offset: 2px;
}

/* scrollbars (subtle) */
::-webkit-scrollbar { height: 0; width: 0; }
```

- [ ] **Step 2: Verify in browser**

Run `pnpm dev`. Page should now have warm beige background, no scrollbars visible, and any focused element shows orange outline.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: base CSS — resets, body, focus, selection"
```

---

## Task 5 — Data types and plates.ts

**Files:**
- Create: `src/data/types.ts`, `src/data/plates.ts`

- [ ] **Step 1: Write `src/data/types.ts`**

```ts
export type PlateKind = 'cover' | 'project' | 'contact';

export type ProjectStatus = 'LIVE' | 'ARCHIVED' | 'DRAFT';

export type PreviewMode = 'iframe' | 'screenshot';

export type CoverPlate = {
  kind: 'cover';
  number: '00';
  fileCode: 'SC.W.00.IDX';
  name: { stem: string; tail: string };
  bio: string;
  stats: Array<{ label: string; value: string }>;
};

export type ProjectMeta = {
  role: string;
  team: string;
  stack: string;
  build: string;
  year: string;
  state: string;
};

export type ProjectPlate = {
  kind: 'project';
  number: string;            // "01" .. "07" (2-digit)
  index: number;             // 1..7 (project sub-index, used in side rail "№ N / 07")
  fileCode: string;          // "SC.W.03.PWX"
  title: { stem: string; tail: string };
  category: string;
  year: number;
  yearRoman: string;
  status: ProjectStatus;
  meta: ProjectMeta;
  brief?: string;
  outcome?: string;
  liveUrl: string;
  previewMode: PreviewMode;
  screenshot?: string;       // /screenshots/foo.png — required when previewMode is 'screenshot'
};

export type ContactLink = { label: string; href: string };

export type ContactPlate = {
  kind: 'contact';
  number: '08';
  fileCode: 'SC.W.08.CTC';
  intro: string;
  links: ContactLink[];
};

export type Plate = CoverPlate | ProjectPlate | ContactPlate;
```

- [ ] **Step 2: Write `src/data/plates.ts`**

```ts
import type { Plate } from './types';

export const plates: Plate[] = [
  {
    kind: 'cover',
    number: '00',
    fileCode: 'SC.W.00.IDX',
    name: { stem: 'SAM\nCLARKE — ', tail: 'front end.' },
    bio:
      'Front-end developer. Born 1995, Suffolk. Eight years in commerce; mostly Shopify 2.0, occasionally apps and tools. Currently on Storetasker. Below: selected work, 2021—2025.',
    stats: [
      { label: 'YEARS', value: '2017—' },
      { label: 'STACK', value: 'React · TS · Liquid' },
      { label: 'BASED', value: 'UK' },
    ],
  },
  {
    kind: 'project',
    number: '01', index: 1,
    fileCode: 'SC.W.01.DRP',
    title: { stem: 'DROP', tail: 'deck.' },
    category: 'Shopify App',
    year: 2025, yearRoman: 'MMXXV',
    status: 'LIVE',
    meta: { role: 'Developer', team: 'Solo', stack: 'Remix · TS · Liquid', build: 'Vite', year: '2025', state: 'Production' },
    brief: 'Preorder app for Shopify using native selling plans — release dates, unit caps, anti-scalping rules.',
    outcome: 'Shipped to App Store 2025',
    liveUrl: 'https://apps.shopify.com/dropdeck',
    previewMode: 'screenshot',
    screenshot: '/screenshots/dropdeck.png',
  },
  {
    kind: 'project',
    number: '02', index: 2,
    fileCode: 'SC.W.02.BRB',
    title: { stem: 'BEAR', tail: 'brick.' },
    category: 'Shopify 2.0',
    year: 2023, yearRoman: 'MMXXIII',
    status: 'LIVE',
    meta: { role: 'Developer', team: 'Make Time to Design', stack: 'Liquid · TS · Tailwind', build: 'Vite', year: '2023', state: 'Production' },
    brief: 'Online Store 2.0 rebuild for Bear Brick. Vite + Liquid + TS + Tailwind. Solo dev on a MTTD engagement.',
    liveUrl: 'https://store.bearbrick.audio/',
    previewMode: 'iframe',
  },
  {
    kind: 'project',
    number: '03', index: 3,
    fileCode: 'SC.W.03.PWX',
    title: { stem: 'PATCH', tail: 'works.' },
    category: 'Shopify 2.0',
    year: 2023, yearRoman: 'MMXXIII',
    status: 'LIVE',
    meta: { role: 'Developer', team: 'Juno Ecommerce', stack: 'Liquid · TS · Sass', build: 'Webpack', year: '2023', state: 'Production' },
    brief: 'Online Store 2.0 build, Webpack + Liquid + TS. Strict perf budget, custom collection filtering.',
    liveUrl: 'https://wearepatchworks.com/',
    previewMode: 'iframe',
  },
  {
    kind: 'project',
    number: '04', index: 4,
    fileCode: 'SC.W.04.CHY',
    title: { stem: 'CEDAR', tail: '& hyde.' },
    category: 'Shopify 2.0',
    year: 2023, yearRoman: 'MMXXIII',
    status: 'LIVE',
    meta: { role: 'Developer', team: 'H × M', stack: 'Liquid · JS · PostCSS', build: 'Webpack', year: '2023', state: 'Production' },
    brief: 'Custom 2.0 theme built from scratch. Webpack + Liquid + Vanilla JS + PostCSS.',
    liveUrl: 'https://cedarhydetest.myshopify.com/',
    previewMode: 'screenshot',
    screenshot: '/screenshots/cedar-hyde.png',
  },
  {
    kind: 'project',
    number: '05', index: 5,
    fileCode: 'SC.W.05.SML',
    title: { stem: 'SMILEY', tail: '.' },
    category: 'Shopify 2.0',
    year: 2022, yearRoman: 'MMXXII',
    status: 'LIVE',
    meta: { role: 'Developer', team: 'Juno Ecommerce', stack: 'Liquid · TS · Sass', build: 'Webpack', year: '2022', state: 'Production' },
    brief: 'Custom 2.0 theme, Webpack + Liquid + TS.',
    liveUrl: 'https://www.smiley.com',
    previewMode: 'iframe',
  },
  {
    kind: 'project',
    number: '06', index: 6,
    fileCode: 'SC.W.06.ORB',
    title: { stem: 'ORB', tail: '.' },
    category: 'React App',
    year: 2022, yearRoman: 'MMXXII',
    status: 'LIVE',
    meta: { role: 'Designer & Developer', team: 'Personal', stack: 'React · PostCSS', build: 'Webpack', year: '2022', state: 'Production' },
    brief: 'ENS bulk-search utility. Search and filter .ens domains by availability and metadata.',
    liveUrl: 'https://ens-orb.netlify.app/',
    previewMode: 'iframe',
  },
  {
    kind: 'project',
    number: '07', index: 7,
    fileCode: 'SC.W.07.FRT',
    title: { stem: 'FREE', tail: 'train.' },
    category: 'Shopify 2.0',
    year: 2021, yearRoman: 'MMXXI',
    status: 'LIVE',
    meta: { role: 'Developer', team: 'Mugo Agency', stack: 'Liquid · JS · PostCSS', build: 'Webpack', year: '2021', state: 'Production' },
    brief: 'Custom 2.0 theme, Webpack + Liquid + Vanilla JS.',
    liveUrl: 'https://www.freetrain.com/',
    previewMode: 'iframe',
  },
  {
    kind: 'contact',
    number: '08',
    fileCode: 'SC.W.08.CTC',
    intro:
      'Available for Shopify front-end work — themes, apps, performance audits. Reply within 24h on weekdays.',
    links: [
      { label: 'EMAIL', href: 'mailto:samclarkeweb@protonmail.com' },
      { label: 'STORETASKER', href: 'https://www.storetasker.com/' },
      { label: 'GITHUB', href: 'https://github.com/alruban' },
    ],
  },
];
```

- [ ] **Step 3: Verify TS compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: data types + plates seed (8 plates: cover, 7 work, contact)"
```

---

## Task 6 — Card chassis component

**Files:**
- Create: `src/components/Card.tsx`, `src/components/Card.module.css`

The chassis renders the shared structure: hole-punches, side rail, type-specimen tape, header, body slot, foot slot. Variants pass children into the body and footer regions.

- [ ] **Step 1: Write `src/components/Card.module.css`**

```css
.card {
  position: relative;
  width: 100%;
  max-width: var(--card-max);
  aspect-ratio: var(--card-aspect);
  background: var(--c-card);
  border: var(--r-thick) solid var(--c-ink);
  box-shadow: var(--shadow-card);
  display: grid;
  grid-template-columns: var(--rail-w) 1fr;
  grid-template-rows: 36px 60px 1fr 56px;
  grid-template-areas:
    'rail tape'
    'rail head'
    'rail body'
    'rail foot';
  overflow: hidden;
}

.card::before,
.card::after {
  content: '';
  position: absolute;
  top: calc(var(--r-thick) * -1);
  width: 54px;
  height: 20px;
  background: var(--c-ink);
}
.card::before { left: 12%; }
.card::after  { right: 12%; }

.rail {
  grid-area: rail;
  position: relative;
  background: var(--c-ink);
  color: var(--c-card);
  border-right: var(--r-thick) solid var(--c-ink);
  overflow: hidden;
}
.railLabel {
  position: absolute;
  top: 14px;
  left: 0;
  right: 0;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-align: center;
  font: var(--t-mono-s);
  letter-spacing: var(--tr-mono-vloose);
  text-transform: uppercase;
}
.railNum {
  position: absolute;
  left: -14px;
  bottom: -30px;
  font-family: var(--f-serif);
  font-weight: 700;
  font-size: 240px;
  line-height: 0.8;
  letter-spacing: -0.06em;
  color: var(--c-card);
}

.tape {
  grid-area: tape;
  border-bottom: var(--r-mid) solid var(--c-ink);
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 14px;
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
}
.tapeBlk {
  background: var(--c-ink);
  color: var(--c-card);
  padding: 6px 8px;
}
.tapeSpec {
  color: var(--c-mid);
}

.head {
  grid-area: head;
  border-bottom: var(--r-thick) solid var(--c-ink);
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: stretch;
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
}
.head > * {
  padding: 0 18px;
  display: flex;
  align-items: center;
}
.head .file { font-weight: 700; }
.head .pipe { border-left: var(--r-mid) solid var(--c-ink); }
.head .stat {
  background: var(--c-ink);
  color: var(--c-card);
  font-weight: 700;
}

.body { grid-area: body; position: relative; min-height: 0; }
.foot {
  grid-area: foot;
  border-top: var(--r-thick) solid var(--c-ink);
  display: grid;
  grid-template-columns: 96px 1fr 1fr 1fr 96px;
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
}
.foot > * {
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-right: var(--r-mid) solid var(--c-ink);
}
.foot > *:last-child { border-right: none; }
.foot .footPill {
  background: var(--c-ink);
  color: var(--c-card);
  font-weight: 700;
  justify-content: center;
}

@media (max-width: 640px) {
  .card {
    grid-template-rows: 28px 48px 1fr 48px;
  }
  .head {
    grid-template-columns: 1fr auto;
    overflow: hidden;
  }
  .head > .pipe:nth-of-type(2),
  .head > .pipe:nth-of-type(3) { display: none; }
  .foot {
    grid-template-columns: 64px 1fr 64px;
  }
  .foot > *:nth-child(2),
  .foot > *:nth-child(4) { display: none; }
}
```

- [ ] **Step 2: Write `src/components/Card.tsx`**

```tsx
import type { ReactNode } from 'react';
import s from './Card.module.css';

export type CardHeadField =
  | { kind: 'file'; text: string }
  | { kind: 'pipe'; text: string }
  | { kind: 'stat'; text: string };

type Props = {
  railLabel: string;          // "INDEX" | "№ 03 / 07 — SELECTED WORK" | "CORRESPONDENCE"
  railNumeral: string;        // "0" | "3" | "8"
  tape: { fileCode: string; spec?: string };
  head: CardHeadField[];
  children: ReactNode;        // body slot
  foot: ReactNode;            // foot slot
};

export function Card({ railLabel, railNumeral, tape, head, children, foot }: Props) {
  return (
    <article className={s.card} aria-label={`${tape.fileCode}`}>
      <div className={s.rail}>
        <div className={s.railLabel}>{railLabel}</div>
        <div className={s.railNum} aria-hidden="true">{railNumeral}</div>
      </div>

      <div className={s.tape}>
        <span className={s.tapeBlk}>FILE — {tape.fileCode}</span>
        {tape.spec && <span className={s.tapeSpec}>{tape.spec}</span>}
      </div>

      <div className={s.head}>
        {head.map((f, i) => {
          if (f.kind === 'file') return <div key={i} className="file">{f.text}</div>;
          if (f.kind === 'pipe') return <div key={i} className="pipe">{f.text}</div>;
          return <div key={i} className="stat">{f.text}</div>;
        })}
      </div>

      <div className={s.body}>{children}</div>

      <div className={s.foot}>{foot}</div>
    </article>
  );
}
```

Note: in `head.map`, the className strings reference CSS-Modules global selectors. With the modules config used, we need to keep these as plain strings AND the CSS uses them within `.head .file` / `.head .pipe` / `.head .stat`. Since we're using CSS Modules, those selectors *won't* be transformed when nested under `.head`. To keep this simple, switch to module classes:

- [ ] **Step 3: Adjust Card.tsx classNames to use module exports**

Replace the head row with `s.headFile` / `s.headPipe` / `s.headStat`, and update Card.module.css `.head .file` → `.headFile`, etc:

```css
/* Card.module.css — replace the .head children selectors */
.head .file, .head .pipe, .head .stat { /* delete these old rules */ }

.headFile {
  font-weight: 700;
  padding: 0 18px;
  display: flex;
  align-items: center;
}
.headPipe {
  border-left: var(--r-mid) solid var(--c-ink);
  padding: 0 18px;
  display: flex;
  align-items: center;
}
.headStat {
  background: var(--c-ink);
  color: var(--c-card);
  font-weight: 700;
  padding: 0 18px;
  display: flex;
  align-items: center;
}
```

```tsx
{head.map((f, i) => {
  if (f.kind === 'file') return <div key={i} className={s.headFile}>{f.text}</div>;
  if (f.kind === 'pipe') return <div key={i} className={s.headPipe}>{f.text}</div>;
  return <div key={i} className={s.headStat}>{f.text}</div>;
})}
```

Apply the same pattern for `.foot .footPill` → `.footPill` (already shown as `s.footPill` will be used by foot slot consumers).

- [ ] **Step 4: Visual smoke test**

Temporarily render `<Card/>` in `App.tsx`:

```tsx
import { Card } from './components/Card';

export default function App() {
  return (
    <main style={{ padding: 32, display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <Card
        railLabel="№ 03 / 07 — SELECTED WORK"
        railNumeral="3"
        tape={{ fileCode: 'SC.W.03.PWX', spec: '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ' }}
        head={[
          { kind: 'file', text: 'PATCHWORKS · COMMERCE' },
          { kind: 'pipe', text: 'MMXXIII' },
          { kind: 'pipe', text: 'SHOPIFY 2.0' },
          { kind: 'stat', text: 'LIVE' },
        ]}
        foot={<>
          <div className="footPill">← 02</div>
          <div>PREVIOUS</div>
          <div>FLICK · ← →</div>
          <div>NEXT</div>
          <div className="footPill">04 →</div>
        </>}
      >
        <div style={{ padding: 24, fontFamily: 'var(--f-serif)', fontSize: 80, fontWeight: 700, lineHeight: 0.86, textTransform: 'uppercase' }}>
          PATCH<em style={{ color: 'var(--c-accent)', fontWeight: 400 }}>works.</em>
        </div>
      </Card>
    </main>
  );
}
```

Verify in browser: card chassis renders with rail, hole-punches, tape, head, body, foot. Save the smoke test in your editor — Task 8 reuses it. (Or revert to placeholder before commit; reintroduce in Task 8.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Card chassis component (rail, tape, head, body slot, foot slot)"
```

---

## Task 7 — TestPlate component (impressionist preview)

**Files:**
- Create: `src/components/TestPlate.tsx`, `src/components/TestPlate.module.css`

This is the right-side calibration plate: starburst + zone plate + crosshair targets + checker + accent diamond. Pure ink-on-paper SVG/CSS. Used by `CardProject`.

- [ ] **Step 1: Write `src/components/TestPlate.module.css`**

```css
.plate {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--c-card);
  overflow: hidden;
}

.tape {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 18px;
  background: var(--c-ink);
  color: var(--c-card);
  display: flex;
  align-items: center;
  padding: 0 10px;
  font: var(--t-mono-xs);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
  justify-content: space-between;
}

.bottom {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 30px;
  background: var(--c-ink);
  color: var(--c-card);
  display: flex;
  align-items: center;
  padding: 0 10px;
  font: var(--t-mono-xs);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
  justify-content: space-between;
}

.barcode {
  height: 14px;
  width: 120px;
  background-image: repeating-linear-gradient(
    90deg,
    var(--c-card) 0 2px,
    transparent 2px 4px,
    var(--c-card) 4px 5px,
    transparent 5px 9px,
    var(--c-card) 9px 11px,
    transparent 11px 14px
  );
}

.stage {
  position: absolute;
  top: 30px; bottom: 42px; left: 14px; right: 14px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
}

.stageLeft { position: relative; }
.starWrap { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 60%; max-width: 160px; aspect-ratio: 1; }

.stageRight {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
}

.zoneplate {
  background:
    radial-gradient(circle, var(--c-ink) 0 5px, transparent 5px 8px),
    radial-gradient(circle, transparent 0 11px, var(--c-ink) 11px 13px, transparent 13px 17px),
    radial-gradient(circle, transparent 0 20px, var(--c-ink) 20px 22px, transparent 22px 26px),
    radial-gradient(circle, transparent 0 29px, var(--c-ink) 29px 31px, transparent 31px 35px);
  background-position: center;
}

.targets { position: relative; }

.cross {
  position: absolute;
  width: 36px;
  height: 36px;
}
.cross::before, .cross::after {
  content: '';
  position: absolute;
  background: var(--c-ink);
}
.cross::before { left: 50%; top: 0; bottom: 0; width: 2px; margin-left: -1px; }
.cross::after  { top: 50%; left: 0; right: 0; height: 2px; margin-top: -1px; }
.crossRing {
  position: absolute;
  inset: 6px;
  border: var(--r-mid) solid var(--c-ink);
  border-radius: 50%;
}
.crossA { left: 0; top: 6px; }
.crossB { right: 0; bottom: 0; }

.checker {
  position: absolute;
  right: 38%;
  top: 14%;
  width: 30px;
  height: 30px;
  background: conic-gradient(var(--c-ink) 0 25%, transparent 0 50%, var(--c-ink) 0 75%, transparent 0 100%);
  background-size: 10px 10px;
}

.accent {
  position: absolute;
  left: 36%;
  bottom: 18%;
  width: 22px;
  height: 22px;
  background: var(--c-accent);
  transform: rotate(45deg);
  border: var(--r-mid) solid var(--c-ink);
}
```

- [ ] **Step 2: Write `src/components/TestPlate.tsx`**

```tsx
import s from './TestPlate.module.css';

type Props = {
  plateNumber: string;        // "03"
  plateCount: number;         // 7
  refCode: string;            // "0023-PWX"
};

export function TestPlate({ plateNumber, plateCount, refCode }: Props) {
  return (
    <div className={s.plate} aria-hidden="true">
      <div className={s.tape}>
        <span>PLATE — {plateNumber} / {String(plateCount).padStart(2, '0')}</span>
        <span>LENS · SHARPNESS · TEST</span>
      </div>

      <div className={s.stage}>
        <div className={s.stageLeft}>
          <div className={s.starWrap}>
            <Starburst />
          </div>
        </div>
        <div className={s.stageRight}>
          <div className={s.zoneplate} />
          <div className={s.targets}>
            <div className={`${s.cross} ${s.crossA}`}><div className={s.crossRing} /></div>
            <div className={`${s.cross} ${s.crossB}`}><div className={s.crossRing} /></div>
            <div className={s.checker} />
            <div className={s.accent} />
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <span>REF · {refCode}</span>
        <div className={s.barcode} />
        <span>OK</span>
      </div>
    </div>
  );
}

function Starburst() {
  const lines: Array<[number, number, number, number]> = [];
  const cx = 70, cy = 70;
  const targets: Array<[number, number]> = [
    [70, 0], [70, 140], [0, 70], [140, 70],
    [140, 0], [0, 0], [0, 140], [140, 140],
    [120, 0], [20, 0], [120, 140], [20, 140],
    [0, 30], [140, 30], [0, 110], [140, 110],
  ];
  targets.forEach(([x, y]) => lines.push([cx, cy, x, y]));

  return (
    <svg viewBox="0 0 140 140" width="100%" height="100%">
      <g stroke="var(--c-ink)" strokeWidth="2">
        {lines.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r="8" fill="var(--c-ink)" />
    </svg>
  );
}
```

- [ ] **Step 3: Visual smoke test**

In `App.tsx` swap the Card body to use `<TestPlate/>`:

```tsx
import { TestPlate } from './components/TestPlate';
// inside the Card body:
<div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', height: '100%' }}>
  <div style={{ padding: 24 }}>title goes here</div>
  <TestPlate plateNumber="03" plateCount={7} refCode="0023-PWX" />
</div>
```

Verify: starburst, zone plate, two targets, checker, accent diamond all render. Background warm. Revert App.tsx after confirming.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: TestPlate — calibration preview pane (starburst, zone plate, targets, accent)"
```

---

## Task 8 — CardProject variant

**Files:**
- Create: `src/components/CardProject.tsx`, `src/components/CardProject.module.css`

- [ ] **Step 1: Write `src/components/CardProject.module.css`**

```css
.layout {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  grid-template-rows: 1fr;
  height: 100%;
}

.body {
  position: relative;
  padding: 24px 24px 16px;
  border-right: var(--r-thick) solid var(--c-ink);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font: var(--t-display);
  letter-spacing: var(--tr-display);
  text-transform: uppercase;
  color: var(--c-ink);
}
.title em {
  font-style: italic;
  font-weight: 400;
  color: var(--c-accent);
}

.strike {
  position: absolute;
  left: calc(var(--r-thick) * -1);
  right: calc(var(--r-thick) * -1);
  top: 62px;
  height: var(--strike);
  background: var(--c-ink);
}

.meta {
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-tight);
  text-transform: uppercase;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: var(--r-mid) solid var(--c-ink);
  color: var(--c-ink);
}
.meta div {
  padding: 8px 0;
  border-bottom: var(--r-mid) solid var(--c-ink);
}
.meta div span {
  color: var(--c-mid);
  display: block;
  font: var(--t-mono-xs);
  letter-spacing: var(--tr-mono-loose);
}
.meta div:nth-child(odd) {
  border-right: var(--r-mid) solid var(--c-ink);
  padding-right: 12px;
}
.meta div:nth-child(even) { padding-left: 12px; }

@media (max-width: 640px) {
  .layout { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
  .body { border-right: 0; border-bottom: var(--r-thick) solid var(--c-ink); padding: 16px; }
  .title { font: var(--t-display-l); letter-spacing: var(--tr-display); }
  .strike { top: 48px; height: 4px; }
}
```

- [ ] **Step 2: Write `src/components/CardProject.tsx`**

```tsx
import { Card } from './Card';
import { TestPlate } from './TestPlate';
import type { ProjectPlate } from '@/data/types';
import s from './CardProject.module.css';

type Props = {
  plate: ProjectPlate;
  prevNumber: string;
  nextNumber: string;
  onPreview: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function CardProject({ plate, prevNumber, nextNumber, onPreview, onPrev, onNext }: Props) {
  const refCode = plate.fileCode.replace(/^SC\.W\./, '').replace(/\./, '-'); // "03-PWX"

  return (
    <Card
      railLabel={`№ ${plate.index} / 07 — SELECTED WORK`}
      railNumeral={String(plate.index)}
      tape={{ fileCode: plate.fileCode, spec: '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ' }}
      head={[
        { kind: 'file', text: `${plate.title.stem}${plate.title.tail.toUpperCase()} · ${plate.category.toUpperCase()}` },
        { kind: 'pipe', text: plate.yearRoman },
        { kind: 'pipe', text: plate.category.toUpperCase() },
        { kind: 'stat', text: plate.status },
      ]}
      foot={<>
        <button className="footPill" onClick={onPrev} aria-label="Previous plate">← {prevNumber}</button>
        <div>PREVIOUS</div>
        <button onClick={onPreview} aria-label="Open preview">→ PREVIEW</button>
        <div>NEXT</div>
        <button className="footPill" onClick={onNext} aria-label="Next plate">{nextNumber} →</button>
      </>}
    >
      <div className={s.layout}>
        <div className={s.body}>
          <div>
            <h2 className={s.title}>
              {plate.title.stem}<wbr/><em>{plate.title.tail}</em>
            </h2>
            <div className={s.strike} />
          </div>
          <div className={s.meta}>
            <div><span>ROLE</span>{plate.meta.role}</div>
            <div><span>TEAM</span>{plate.meta.team}</div>
            <div><span>STACK</span>{plate.meta.stack}</div>
            <div><span>BUILD</span>{plate.meta.build}</div>
            <div><span>YEAR</span>{plate.meta.year}</div>
            <div><span>STATE</span>{plate.meta.state}</div>
          </div>
        </div>
        <TestPlate plateNumber={plate.number} plateCount={7} refCode={refCode} />
      </div>
    </Card>
  );
}
```

`footPill` is a global hook the Card module exposes via `:global(.footPill)` styling — adjust Card.module.css to also expose it:

- [ ] **Step 3: Update `Card.module.css` to globalize footPill**

Replace `.footPill` with:

```css
:global(.footPill) {
  background: var(--c-ink);
  color: var(--c-card);
  font-weight: 700;
  justify-content: center;
}
```

This lets variants use `className="footPill"` directly.

- [ ] **Step 4: Visual smoke test**

In `App.tsx`:

```tsx
import { plates } from './data/plates';
import { CardProject } from './components/CardProject';

export default function App() {
  const project = plates.find(p => p.kind === 'project' && p.number === '03')!;
  if (project.kind !== 'project') throw new Error();
  return (
    <main style={{ padding: 64, display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--c-page)' }}>
      <CardProject plate={project} prevNumber="02" nextNumber="04" onPreview={() => alert('preview')} onPrev={() => {}} onNext={() => {}} />
    </main>
  );
}
```

Browser-check: project card renders with title "PATCH*works.*" (italic in orange), strike, meta grid, TestPlate on right.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: CardProject variant + footPill global hook"
```

---

## Task 9 — CardCover variant

**Files:**
- Create: `src/components/CardCover.tsx`, `src/components/CardCover.module.css`

- [ ] **Step 1: Write `src/components/CardCover.module.css`**

```css
.body {
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.name {
  font: var(--t-display);
  letter-spacing: var(--tr-display);
  text-transform: uppercase;
  white-space: pre-wrap;
}
.name em {
  font-style: italic;
  font-weight: 400;
  color: var(--c-accent);
}

.strike {
  height: var(--strike);
  background: var(--c-ink);
  margin-top: 6px;
}

.bio {
  font: var(--t-body);
  max-width: 56ch;
  margin-top: 12px;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-top: var(--r-mid) solid var(--c-ink);
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
}
.stats div {
  padding: 8px 10px;
  border-right: var(--r-mid) solid var(--c-ink);
}
.stats div:last-child { border-right: none; }
.stats div span {
  display: block;
  color: var(--c-mid);
  font: var(--t-mono-xs);
  letter-spacing: var(--tr-mono-vloose);
  margin-bottom: 2px;
}

.cornerStar {
  position: absolute;
  right: 18px;
  top: 32px;
  width: 80px;
  height: 80px;
  pointer-events: none;
}

@media (max-width: 640px) {
  .name { font: var(--t-display-l); letter-spacing: var(--tr-display); }
  .stats { grid-template-columns: 1fr; }
  .stats div { border-right: 0; border-bottom: var(--r-mid) solid var(--c-ink); }
  .cornerStar { display: none; }
}
```

- [ ] **Step 2: Write `src/components/CardCover.tsx`**

```tsx
import { Card } from './Card';
import type { CoverPlate } from '@/data/types';
import s from './CardCover.module.css';

type Props = { plate: CoverPlate; onStart: () => void };

export function CardCover({ plate, onStart }: Props) {
  return (
    <Card
      railLabel="INDEX"
      railNumeral="0"
      tape={{ fileCode: plate.fileCode, spec: 'SELECTED · 2021—2025' }}
      head={[
        { kind: 'file', text: 'SAM CLARKE — INDEX' },
        { kind: 'pipe', text: 'MMXXVI' },
        { kind: 'stat', text: 'OPEN' },
      ]}
      foot={<>
        <div>SAM CLARKE — INDEX</div>
        <div>SCROLL · ← →</div>
        <div>—</div>
        <div>—</div>
        <button className="footPill" onClick={onStart} aria-label="Start">START → 01</button>
      </>}
    >
      <div className={s.body}>
        <div>
          <h1 className={s.name}>
            {plate.name.stem}<em>{plate.name.tail}</em>
          </h1>
          <div className={s.strike} />
          <p className={s.bio}>{plate.bio}</p>
        </div>
        <div className={s.stats}>
          {plate.stats.map((stat) => (
            <div key={stat.label}><span>{stat.label}</span>{stat.value}</div>
          ))}
        </div>
        <svg className={s.cornerStar} viewBox="0 0 60 60" aria-hidden="true">
          <g stroke="var(--c-ink)" strokeWidth="1.5">
            <line x1="30" y1="30" x2="30" y2="0" />
            <line x1="30" y1="30" x2="30" y2="60" />
            <line x1="30" y1="30" x2="0" y2="30" />
            <line x1="30" y1="30" x2="60" y2="30" />
            <line x1="30" y1="30" x2="60" y2="0" />
            <line x1="30" y1="30" x2="0" y2="0" />
            <line x1="30" y1="30" x2="0" y2="60" />
            <line x1="30" y1="30" x2="60" y2="60" />
          </g>
          <circle cx="30" cy="30" r="3" fill="var(--c-ink)" />
        </svg>
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Visual check + commit**

Swap App.tsx to render `<CardCover plate={plates[0]} onStart={()=>{}} />`. Verify in browser.

```bash
git add -A
git commit -m "feat: CardCover variant (PLATE 00)"
```

---

## Task 10 — CardContact variant

**Files:**
- Create: `src/components/CardContact.tsx`, `src/components/CardContact.module.css`

- [ ] **Step 1: Write `src/components/CardContact.module.css`**

```css
.body {
  padding: 24px;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 16px;
  height: 100%;
}

.copy { display: flex; flex-direction: column; justify-content: flex-start; }
.title {
  font: var(--t-display-l);
  letter-spacing: var(--tr-display);
  text-transform: uppercase;
  color: var(--c-ink);
}
.title em { font-style: italic; font-weight: 400; color: var(--c-accent); }
.strike { height: 4px; background: var(--c-ink); margin: 6px 0 12px; }
.intro { font: var(--t-body-s); max-width: 40ch; }

.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: end;
}
.link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: var(--r-mid) solid var(--c-ink);
  padding: 10px 12px;
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
  color: var(--c-ink);
  background: transparent;
  text-decoration: none;
  transition: background var(--t-fast), color var(--t-fast);
}
.link:hover, .link:focus-visible {
  background: var(--c-ink);
  color: var(--c-card);
}
.link:first-child {
  background: var(--c-ink);
  color: var(--c-card);
}
.link:first-child:hover {
  background: var(--c-accent);
  color: var(--c-page);
}
.link span:last-child {
  font-family: var(--f-serif);
  font-weight: 700;
  font-size: 14px;
}

@media (max-width: 640px) {
  .body { grid-template-columns: 1fr; grid-template-rows: auto auto; }
  .title { font: var(--t-display-m); }
}
```

- [ ] **Step 2: Write `src/components/CardContact.tsx`**

```tsx
import { Card } from './Card';
import type { ContactPlate } from '@/data/types';
import s from './CardContact.module.css';

type Props = { plate: ContactPlate; prevNumber: string; onReturn: () => void; onPrev: () => void };

export function CardContact({ plate, prevNumber, onReturn, onPrev }: Props) {
  return (
    <Card
      railLabel="CORRESPONDENCE"
      railNumeral="8"
      tape={{ fileCode: plate.fileCode, spec: 'CORRESPONDENCE · OPEN' }}
      head={[
        { kind: 'file', text: 'GET IN TOUCH' },
        { kind: 'pipe', text: 'OPEN' },
        { kind: 'stat', text: 'AVAILABLE' },
      ]}
      foot={<>
        <button className="footPill" onClick={onPrev}>← {prevNumber}</button>
        <div>PREVIOUS</div>
        <div>—</div>
        <div>RETURN</div>
        <button className="footPill" onClick={onReturn}>00 ↺</button>
      </>}
    >
      <div className={s.body}>
        <div className={s.copy}>
          <h2 className={s.title}>GET IN <em>touch.</em></h2>
          <div className={s.strike} />
          <p className={s.intro}>{plate.intro}</p>
        </div>
        <div className={s.links}>
          {plate.links.map((link) => (
            <a key={link.label} className={s.link} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <span>{link.label}</span>
              <span>→</span>
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Visual check + commit**

Render `<CardContact plate={plates[8]} prevNumber="07" onReturn={()=>{}} onPrev={()=>{}}/>`.

```bash
git add -A
git commit -m "feat: CardContact variant (PLATE 08)"
```

---

## Task 11 — Spindle and StackBackdrop

**Files:**
- Create: `src/components/Spindle.tsx`, `src/components/Spindle.module.css`, `src/components/StackBackdrop.tsx`, `src/components/StackBackdrop.module.css`

- [ ] **Step 1: Write Spindle**

`src/components/Spindle.module.css`:

```css
.spindle {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 220px;
  pointer-events: none;
  z-index: 1;
}
.bar {
  width: 60px;
  height: 14px;
  background: var(--c-ink);
}

@media (max-width: 640px) {
  .spindle { display: none; }
}
```

`src/components/Spindle.tsx`:

```tsx
import s from './Spindle.module.css';

export function Spindle() {
  return (
    <div className={s.spindle} aria-hidden="true">
      <div className={s.bar} />
      <div className={s.bar} />
    </div>
  );
}
```

- [ ] **Step 2: Write StackBackdrop**

`src/components/StackBackdrop.module.css`:

```css
.backdrop {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  color: var(--c-ink);
  font-family: var(--f-mono);
}

.specimen {
  position: absolute;
  font-size: 9px;
  letter-spacing: var(--tr-mono-vloose);
  text-transform: uppercase;
  white-space: nowrap;
}
.micro {
  position: absolute;
  font-size: 6px;
  letter-spacing: 0.16em;
  white-space: nowrap;
}
.reslines {
  position: absolute;
  background-image: repeating-linear-gradient(90deg, var(--c-ink) 0 2px, transparent 2px 5px);
}
.reslinesV {
  background-image: repeating-linear-gradient(0deg, var(--c-ink) 0 2px, transparent 2px 5px);
}

.crosshair { position: absolute; width: 48px; height: 48px; }
.crosshair::before, .crosshair::after { content: ''; position: absolute; background: var(--c-ink); }
.crosshair::before { left: 50%; top: 0; bottom: 0; width: 2px; margin-left: -1px; }
.crosshair::after  { top: 50%; left: 0; right: 0; height: 2px; margin-top: -1px; }
.crosshair .ring {
  position: absolute;
  inset: 8px;
  border: var(--r-mid) solid var(--c-ink);
  border-radius: 50%;
}

.numSquare {
  position: absolute;
  width: 48px;
  height: 48px;
  border: var(--r-mid) solid var(--c-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-serif);
  font-weight: 700;
  font-size: 30px;
}

@media (max-width: 640px) {
  .crosshair, .numSquare, .specimen.left, .specimen.right, .reslinesV { display: none; }
}
```

`src/components/StackBackdrop.tsx`:

```tsx
import s from './StackBackdrop.module.css';

export function StackBackdrop() {
  return (
    <div className={s.backdrop} aria-hidden="true">
      <span className={s.specimen} style={{ top: 8, left: 36 }}>
        0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ
      </span>
      <span className={s.specimen} style={{ top: 8, right: 36 }}>
        grey · white · balance · colour · card
      </span>
      <div className={s.reslines} style={{ top: 24, left: 36, right: 36, height: 6 }} />

      <div className={s.reslinesV} style={{ top: 60, left: 18, width: 8, height: 150, position: 'absolute' }} />
      <div className={s.crosshair} style={{ top: 240, left: 14 }}>
        <div className="ring" />
      </div>
      <span className={s.micro} style={{ top: 436, left: 14, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        REF · LENS SHARPNESS · 2026
      </span>

      <div className={s.numSquare} style={{ top: 280, right: 30 }}>4</div>
      <span className={s.micro} style={{ top: 420, right: 18, writingMode: 'vertical-rl' }}>
        PLATE · 2026
      </span>

      <div className={s.reslines} style={{ bottom: 24, left: 36, right: 36, height: 6 }} />
      <span className={s.specimen} style={{ bottom: 8, left: 36 }}>
        SAM · CLARKE · SELECTED · WORK · 2021—2025
      </span>
      <span className={s.specimen} style={{ bottom: 8, right: 36 }}>
        SAMUELCLARKE.DEV
      </span>
    </div>
  );
}
```

The crosshair `.ring` selector needs to work with the css module — since it's a child class, expose it as a module class instead:

- [ ] **Step 3: Add `.crossRing` module class and use it**

Update `StackBackdrop.module.css`:

```css
.crossRing {
  position: absolute;
  inset: 8px;
  border: var(--r-mid) solid var(--c-ink);
  border-radius: 50%;
}
```

Update the JSX to use `<div className={s.crossRing} />`.

- [ ] **Step 4: Smoke + commit**

Render `<><StackBackdrop/><Spindle/></>` in `App.tsx` to verify the surround. Then revert App.tsx.

```bash
git add -A
git commit -m "feat: Spindle and StackBackdrop (calibration motifs surround)"
```

---

## Task 12 — useHashPlate hook (with tests, TDD)

**Files:**
- Create: `src/hooks/useHashPlate.ts`, `tests/useHashPlate.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/useHashPlate.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHashPlate } from '@/hooks/useHashPlate';

describe('useHashPlate', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('returns 0 when there is no hash', () => {
    const { result } = renderHook(() => useHashPlate(9));
    expect(result.current.index).toBe(0);
  });

  it('parses #/03 to index 3', () => {
    window.location.hash = '#/03';
    const { result } = renderHook(() => useHashPlate(9));
    expect(result.current.index).toBe(3);
  });

  it('clamps to range', () => {
    window.location.hash = '#/99';
    const { result } = renderHook(() => useHashPlate(9));
    expect(result.current.index).toBe(8);
  });

  it('updates on hashchange events', () => {
    const { result } = renderHook(() => useHashPlate(9));
    act(() => {
      window.location.hash = '#/05';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current.index).toBe(5);
  });

  it('setIndex writes #/NN to the hash', () => {
    const { result } = renderHook(() => useHashPlate(9));
    act(() => result.current.setIndex(7));
    expect(window.location.hash).toBe('#/07');
  });
});
```

- [ ] **Step 2: Run test, expect failure**

```bash
pnpm test:run tests/useHashPlate.test.ts
```

Expected: error — module not found.

- [ ] **Step 3: Implement the hook**

`src/hooks/useHashPlate.ts`:

```ts
import { useEffect, useState, useCallback } from 'react';

function parseHash(hash: string, total: number): number {
  const m = hash.match(/^#\/(\d+)$/);
  if (!m) return 0;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(total - 1, n));
}

export function useHashPlate(total: number) {
  const [index, setIndexState] = useState(() => parseHash(window.location.hash, total));

  useEffect(() => {
    const onChange = () => setIndexState(parseHash(window.location.hash, total));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [total]);

  const setIndex = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    const padded = String(clamped).padStart(2, '0');
    if (window.location.hash !== `#/${padded}`) {
      // replaceState avoids spamming history
      const url = new URL(window.location.href);
      url.hash = `/${padded}`;
      window.history.replaceState(null, '', url.toString());
    }
    setIndexState(clamped);
  }, [total]);

  return { index, setIndex };
}
```

- [ ] **Step 4: Run tests, expect pass**

```bash
pnpm test:run tests/useHashPlate.test.ts
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: useHashPlate hook + tests"
```

---

## Task 13 — useStackNavigation hook

**Files:**
- Create: `src/hooks/useStackNavigation.ts`

This hook owns: scroll-snap detection (which plate is centered), ←/→ key handling, and the function to programmatically scroll to a given plate. It does NOT own the hash — that's `useHashPlate`. The Stack component connects them.

- [ ] **Step 1: Write `src/hooks/useStackNavigation.ts`**

```ts
import { useEffect, useRef, useState, useCallback } from 'react';

type Options = { total: number; activeIndex: number; onChange: (next: number) => void };

export function useStackNavigation({ total, activeIndex, onChange }: Options) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const plateRefs = useRef<Array<HTMLElement | null>>([]);
  const [_observed, setObserved] = useState(activeIndex);

  // Set a plate ref by index
  const setPlateRef = useCallback((i: number) => (el: HTMLElement | null) => {
    plateRefs.current[i] = el;
  }, []);

  // Programmatic scroll to index
  const scrollTo = useCallback((i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = plateRefs.current[i];
    const c = containerRef.current;
    if (!el || !c) return;
    c.scrollTo({ left: el.offsetLeft - (c.clientWidth - el.clientWidth) / 2, behavior });
  }, []);

  // Sync external activeIndex changes (e.g. hash change) → scroll
  useEffect(() => {
    scrollTo(activeIndex, 'smooth');
  }, [activeIndex, scrollTo]);

  // Detect which plate is centered via IntersectionObserver
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;
        entries.forEach((e) => {
          const idx = Number((e.target as HTMLElement).dataset.index ?? -1);
          if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio;
            bestIdx = idx;
          }
        });
        if (bestIdx >= 0) {
          setObserved(bestIdx);
          if (bestIdx !== activeIndex) onChange(bestIdx);
        }
      },
      { root: c, threshold: [0.5, 0.75, 0.9] }
    );
    plateRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [activeIndex, onChange]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore when typing
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') { e.preventDefault(); onChange(Math.min(total - 1, activeIndex + 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); onChange(Math.max(0, activeIndex - 1)); }
      else if (e.key === 'Home') { e.preventDefault(); onChange(0); }
      else if (e.key === 'End') { e.preventDefault(); onChange(total - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, total, onChange]);

  return { containerRef, setPlateRef, scrollTo };
}
```

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit (no test — exercised through Stack integration in next task)**

```bash
git add -A
git commit -m "feat: useStackNavigation hook (scroll-snap detection, key nav, programmatic scroll)"
```

---

## Task 14 — Stack component

**Files:**
- Create: `src/components/Stack.tsx`, `src/components/Stack.module.css`

- [ ] **Step 1: Write `src/components/Stack.module.css`**

```css
.stage {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--c-page);
}

.scroller {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  align-items: center;
  z-index: 2;
}
.scroller::-webkit-scrollbar { display: none; }

.slide {
  flex: 0 0 100vw;
  height: 100vh;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: grid;
  place-items: center;
  padding: 64px 32px;
}

@media (max-width: 640px) {
  .scroller { scroll-snap-type: y mandatory; flex-direction: column; overflow-x: hidden; overflow-y: auto; }
  .slide { flex: 0 0 100vh; width: 100vw; padding: 24px 12px; }
}
```

- [ ] **Step 2: Write `src/components/Stack.tsx`**

```tsx
import { useCallback } from 'react';
import { plates } from '@/data/plates';
import { useHashPlate } from '@/hooks/useHashPlate';
import { useStackNavigation } from '@/hooks/useStackNavigation';
import { Card } from './Card';
import { CardCover } from './CardCover';
import { CardProject } from './CardProject';
import { CardContact } from './CardContact';
import { Spindle } from './Spindle';
import { StackBackdrop } from './StackBackdrop';
import s from './Stack.module.css';

type Props = { onPreviewProject: (projectIndex: number) => void };

export function Stack({ onPreviewProject }: Props) {
  const total = plates.length;
  const { index, setIndex } = useHashPlate(total);
  const { containerRef, setPlateRef } = useStackNavigation({ total, activeIndex: index, onChange: setIndex });

  const padded = useCallback((i: number) => String(((i % total) + total) % total).padStart(2, '0'), [total]);

  return (
    <div className={s.stage}>
      <StackBackdrop />
      <Spindle />
      <div className={s.scroller} ref={containerRef} role="region" aria-label="Plate stack">
        {plates.map((p, i) => {
          const prev = padded(i - 1);
          const next = padded(i + 1);
          return (
            <div
              key={i}
              className={s.slide}
              data-index={i}
              ref={(el) => setPlateRef(i)(el)}
            >
              {p.kind === 'cover' && (
                <CardCover plate={p} onStart={() => setIndex(1)} />
              )}
              {p.kind === 'project' && (
                <CardProject
                  plate={p}
                  prevNumber={prev}
                  nextNumber={next}
                  onPreview={() => onPreviewProject(i)}
                  onPrev={() => setIndex(i - 1)}
                  onNext={() => setIndex(i + 1)}
                />
              )}
              {p.kind === 'contact' && (
                <CardContact
                  plate={p}
                  prevNumber={prev}
                  onPrev={() => setIndex(i - 1)}
                  onReturn={() => setIndex(0)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// silence unused warning for Card import
void Card;
```

(`Card` import keeps for tree-shaking-safe re-export if needed — remove if eslint complains.)

- [ ] **Step 3: Wire App.tsx**

```tsx
import { useState, useCallback } from 'react';
import { Stack } from './components/Stack';

export default function App() {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const openPreview = useCallback((i: number) => setPreviewIndex(i), []);
  // PreviewModal added in Task 16 — for now, log instead
  const handlePreview = (i: number) => {
    console.log('open preview for plate', i);
    openPreview(i);
  };

  return (
    <>
      <Stack onPreviewProject={handlePreview} />
      {previewIndex !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,16,8,0.85)', zIndex: 100, display: 'grid', placeItems: 'center', color: 'white' }} onClick={() => setPreviewIndex(null)}>
          modal placeholder for plate {previewIndex} — Task 16 implements this
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Browser verification**

`pnpm dev`. Verify:
- Cover (00) renders by default
- Arrow keys move between plates
- `#/03` in URL loads project 03 directly
- Hash updates as you navigate
- Project plate "→ PREVIEW" button shows the placeholder modal

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Stack component — wires plates, navigation, hash routing"
```

---

## Task 15 — useIframeReady hook (with tests, TDD)

**Files:**
- Create: `src/hooks/useIframeReady.ts`, `tests/useIframeReady.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/useIframeReady.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIframeReady } from '@/hooks/useIframeReady';

describe('useIframeReady', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts in loading', () => {
    const { result } = renderHook(() => useIframeReady({ enabled: true, timeoutMs: 3000 }));
    expect(result.current.state).toBe('loading');
  });

  it('switches to fallback after timeout when not loaded', () => {
    const { result } = renderHook(() => useIframeReady({ enabled: true, timeoutMs: 3000 }));
    act(() => { vi.advanceTimersByTime(3001); });
    expect(result.current.state).toBe('fallback');
  });

  it('switches to ready when onLoad fires before timeout', () => {
    const { result } = renderHook(() => useIframeReady({ enabled: true, timeoutMs: 3000 }));
    act(() => { result.current.markLoaded(); });
    expect(result.current.state).toBe('ready');
    act(() => { vi.advanceTimersByTime(3001); });
    expect(result.current.state).toBe('ready');
  });

  it('does nothing when disabled', () => {
    const { result } = renderHook(() => useIframeReady({ enabled: false, timeoutMs: 3000 }));
    expect(result.current.state).toBe('disabled');
    act(() => { vi.advanceTimersByTime(3001); });
    expect(result.current.state).toBe('disabled');
  });

  it('reset returns to loading and restarts the timer', () => {
    const { result } = renderHook(() => useIframeReady({ enabled: true, timeoutMs: 3000 }));
    act(() => { vi.advanceTimersByTime(3001); });
    expect(result.current.state).toBe('fallback');
    act(() => { result.current.reset(); });
    expect(result.current.state).toBe('loading');
  });
});
```

- [ ] **Step 2: Run test, expect failure**

```bash
pnpm test:run tests/useIframeReady.test.ts
```

- [ ] **Step 3: Implement**

`src/hooks/useIframeReady.ts`:

```ts
import { useCallback, useEffect, useRef, useState } from 'react';

export type IframeState = 'disabled' | 'loading' | 'ready' | 'fallback';

type Options = { enabled: boolean; timeoutMs?: number };

export function useIframeReady({ enabled, timeoutMs = 3000 }: Options) {
  const [state, setState] = useState<IframeState>(enabled ? 'loading' : 'disabled');
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setState((s) => (s === 'loading' ? 'fallback' : s));
    }, timeoutMs);
  }, [clearTimer, timeoutMs]);

  useEffect(() => {
    if (enabled) {
      setState('loading');
      startTimer();
    } else {
      clearTimer();
      setState('disabled');
    }
    return clearTimer;
  }, [enabled, startTimer, clearTimer]);

  const markLoaded = useCallback(() => {
    clearTimer();
    setState((s) => (s === 'loading' ? 'ready' : s));
  }, [clearTimer]);

  const reset = useCallback(() => {
    setState('loading');
    startTimer();
  }, [startTimer]);

  return { state, markLoaded, reset };
}
```

- [ ] **Step 4: Run tests, expect pass**

```bash
pnpm test:run tests/useIframeReady.test.ts
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: useIframeReady hook + tests"
```

---

## Task 16 — IframeViewport component

**Files:**
- Create: `src/components/IframeViewport.tsx`, `src/components/IframeViewport.module.css`

- [ ] **Step 1: Write `src/components/IframeViewport.module.css`**

```css
.viewport {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--c-card);
  overflow: hidden;
  display: grid;
  place-items: center;
}

.frame {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: white;
}

.iframe {
  border: 0;
  width: 1280px;
  height: 800px;
  transform-origin: center center;
  pointer-events: none;
}
.iframe.interactive {
  pointer-events: auto;
}

.scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(20,16,8,0.06) 0 1px, transparent 1px 3px);
  mix-blend-mode: multiply;
}

.fallback {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
}

.banner {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: var(--c-ink);
  color: var(--c-card);
  padding: 6px 10px;
  font: var(--t-mono-s);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
}

.loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--c-card);
  font: var(--t-mono-l);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
  color: var(--c-mid);
}
```

- [ ] **Step 2: Write `src/components/IframeViewport.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react';
import { useIframeReady } from '@/hooks/useIframeReady';
import type { ProjectPlate } from '@/data/types';
import s from './IframeViewport.module.css';

type Props = {
  plate: ProjectPlate;
  interactive: boolean;
};

const IFRAME_W = 1280;
const IFRAME_H = 800;

export function IframeViewport({ plate, interactive }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // Only enable iframe when previewMode is 'iframe'
  const useIframe = plate.previewMode === 'iframe';

  const { state, markLoaded, reset } = useIframeReady({ enabled: useIframe, timeoutMs: 4000 });

  // recompute scale on resize
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const fit = Math.min(el.clientWidth / IFRAME_W, el.clientHeight / IFRAME_H);
      setScale(Number.isFinite(fit) && fit > 0 ? fit : 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // reset on plate change
  useEffect(() => { reset(); }, [plate.fileCode, reset]);

  return (
    <div className={s.viewport} ref={wrapRef}>
      <div className={s.frame}>
        {!useIframe && plate.screenshot && (
          <div className={s.fallback} style={{ backgroundImage: `url(${plate.screenshot})` }} role="img" aria-label={`${plate.title.stem}${plate.title.tail} — screenshot`} />
        )}
        {useIframe && (state === 'loading' || state === 'ready') && (
          <iframe
            className={`${s.iframe} ${interactive && state === 'ready' ? s.interactive : ''}`}
            title={`${plate.title.stem}${plate.title.tail} — live`}
            src={plate.liveUrl}
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ transform: `scale(${scale})` }}
            onLoad={markLoaded}
          />
        )}
        {useIframe && state === 'fallback' && plate.screenshot && (
          <>
            <div className={s.fallback} style={{ backgroundImage: `url(${plate.screenshot})` }} />
            <div className={s.banner}>STILL · FRAME — embed unavailable</div>
          </>
        )}
        {useIframe && state === 'fallback' && !plate.screenshot && (
          <div className={s.loading}>EMBED · UNAVAILABLE</div>
        )}
        {useIframe && state === 'loading' && (
          <div className={s.loading}>LIVE · CONNECTING…</div>
        )}
      </div>
      <div className={s.scanlines} />
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: IframeViewport — scaled iframe with screenshot fallback"
```

---

## Task 17 — PreviewModal component

**Files:**
- Create: `src/components/PreviewModal.tsx`, `src/components/PreviewModal.module.css`, `tests/PreviewModal.test.tsx`

The modal opens when a project plate's "→ PREVIEW" is clicked. It shows the IframeViewport, has a calibration tape header, controls row (interact toggle + visit + prev/next), closes on Esc / backdrop click / close pill.

- [ ] **Step 1: Write `src/components/PreviewModal.module.css`**

```css
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(20, 16, 8, 0.85);
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 48px;
}

.shell {
  background: var(--c-page);
  padding: 24px;
  border: var(--r-thick) solid var(--c-ink);
  box-shadow: var(--shadow-card);
  width: 100%;
  max-width: 1100px;
}

.tape {
  height: 28px;
  background: var(--c-ink);
  color: var(--c-card);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 14px;
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
  justify-content: space-between;
}
.live::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--c-accent);
  border-radius: 50%;
  margin-right: 8px;
}

.close {
  background: var(--c-card);
  color: var(--c-ink);
  padding: 4px 8px;
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
  cursor: pointer;
}

.bezel {
  margin-top: 12px;
  aspect-ratio: 16 / 10;
  background: var(--c-ink);
  padding: 10px;
  box-shadow: inset 0 0 0 2px var(--c-ink), inset 0 0 0 4px var(--c-card);
  position: relative;
}

.controls {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: var(--t-mono-m);
  letter-spacing: var(--tr-mono-loose);
  text-transform: uppercase;
  flex-wrap: wrap;
  gap: 12px;
}

.grp { display: flex; gap: 10px; flex-wrap: wrap; }
.btn {
  border: var(--r-mid) solid var(--c-ink);
  padding: 8px 14px;
  cursor: pointer;
  background: transparent;
  color: var(--c-ink);
  text-decoration: none;
}
.btn.on {
  background: var(--c-ink);
  color: var(--c-card);
}
.disabledLabel { color: var(--c-mid); }

@media (max-width: 640px) {
  .scrim { padding: 12px; }
  .shell { padding: 12px; }
  .bezel { aspect-ratio: 4 / 3; padding: 6px; }
}
```

- [ ] **Step 2: Write `src/components/PreviewModal.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { IframeViewport } from './IframeViewport';
import type { ProjectPlate } from '@/data/types';
import s from './PreviewModal.module.css';

type Props = {
  plate: ProjectPlate;
  hasPrev: boolean;
  hasNext: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function PreviewModal({ plate, hasPrev, hasNext, onClose, onPrev, onNext }: Props) {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => { setInteractive(false); }, [plate.fileCode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && hasNext) onNext();
      else if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasNext, hasPrev, onClose, onNext, onPrev]);

  const host = plate.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className={s.scrim} role="dialog" aria-modal="true" aria-label={`${plate.title.stem}${plate.title.tail} preview`} onClick={onClose}>
      <div className={s.shell} onClick={(e) => e.stopPropagation()}>
        <div className={s.tape}>
          <span className={s.live}>{plate.previewMode === 'iframe' ? `LIVE FEED · ${host.toUpperCase()}` : `STILL · ${host.toUpperCase()}`}</span>
          <span>{plate.previewMode === 'iframe' ? '1280×800 · SCALED' : 'STATIC FRAME'} · NO. {plate.number} / 07</span>
          <button className={s.close} onClick={onClose} aria-label="Close preview">CLOSE · ESC</button>
        </div>

        <div className={s.bezel}>
          <IframeViewport plate={plate} interactive={interactive} />
        </div>

        <div className={s.controls}>
          <div className={s.grp}>
            {plate.previewMode === 'iframe' ? (
              <>
                <span className={s.disabledLabel}>{interactive ? 'POINTER · ENABLED' : 'POINTER · DISABLED'}</span>
                <button className={s.btn} onClick={() => setInteractive((x) => !x)}>
                  {interactive ? '→ DISABLE' : '→ INTERACT'}
                </button>
              </>
            ) : (
              <span className={s.disabledLabel}>{plate.previewMode.toUpperCase()} ONLY</span>
            )}
          </div>
          <div className={s.grp}>
            <button className={s.btn} onClick={onPrev} disabled={!hasPrev}>← PREV</button>
            <a className={`${s.btn} ${s.on}`} href={plate.liveUrl} target="_blank" rel="noreferrer">→ VISIT LIVE</a>
            <button className={s.btn} onClick={onNext} disabled={!hasNext}>NEXT →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `tests/PreviewModal.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreviewModal } from '@/components/PreviewModal';
import type { ProjectPlate } from '@/data/types';

const plate: ProjectPlate = {
  kind: 'project',
  number: '03', index: 3,
  fileCode: 'SC.W.03.PWX',
  title: { stem: 'PATCH', tail: 'works.' },
  category: 'Shopify 2.0',
  year: 2023, yearRoman: 'MMXXIII',
  status: 'LIVE',
  meta: { role: 'Developer', team: 'Juno', stack: 'Liquid', build: 'Webpack', year: '2023', state: 'Production' },
  liveUrl: 'https://wearepatchworks.com/',
  previewMode: 'iframe',
};

describe('PreviewModal', () => {
  it('renders the host name in the tape', () => {
    render(<PreviewModal plate={plate} hasPrev hasNext onClose={() => {}} onPrev={() => {}} onNext={() => {}} />);
    expect(screen.getByText(/WEAREPATCHWORKS\.COM/)).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<PreviewModal plate={plate} hasPrev hasNext onClose={onClose} onPrev={() => {}} onNext={() => {}} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('toggles INTERACT button label', () => {
    render(<PreviewModal plate={plate} hasPrev hasNext onClose={() => {}} onPrev={() => {}} onNext={() => {}} />);
    const btn = screen.getByText('→ INTERACT');
    fireEvent.click(btn);
    expect(screen.getByText('→ DISABLE')).toBeInTheDocument();
  });

  it('disables PREV button when hasPrev is false', () => {
    render(<PreviewModal plate={plate} hasPrev={false} hasNext onClose={() => {}} onPrev={() => {}} onNext={() => {}} />);
    expect(screen.getByText('← PREV')).toBeDisabled();
  });
});
```

- [ ] **Step 4: Run tests**

```bash
pnpm test:run
```

Expected: PreviewModal tests pass (4) + previously-passing hooks tests still pass.

- [ ] **Step 5: Wire modal in App.tsx**

```tsx
import { useState, useCallback } from 'react';
import { Stack } from './components/Stack';
import { PreviewModal } from './components/PreviewModal';
import { plates } from './data/plates';
import type { ProjectPlate } from './data/types';

export default function App() {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const projectIndices = plates
    .map((p, i) => (p.kind === 'project' ? i : -1))
    .filter((i) => i >= 0);

  const openPreview = useCallback((i: number) => setPreviewIndex(i), []);
  const closePreview = useCallback(() => setPreviewIndex(null), []);

  const currentProjectPos =
    previewIndex === null ? -1 : projectIndices.indexOf(previewIndex);

  const goPrev = () => {
    if (currentProjectPos > 0) setPreviewIndex(projectIndices[currentProjectPos - 1]);
  };
  const goNext = () => {
    if (currentProjectPos >= 0 && currentProjectPos < projectIndices.length - 1) {
      setPreviewIndex(projectIndices[currentProjectPos + 1]);
    }
  };

  const activePlate = previewIndex !== null ? (plates[previewIndex] as ProjectPlate) : null;

  return (
    <>
      <Stack onPreviewProject={openPreview} />
      {activePlate && (
        <PreviewModal
          plate={activePlate}
          hasPrev={currentProjectPos > 0}
          hasNext={currentProjectPos < projectIndices.length - 1}
          onClose={closePreview}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
```

- [ ] **Step 6: Browser verification**

`pnpm dev`. Verify:
- Cover loads.
- Navigate to project 03 (`#/03`), click "→ PREVIEW", modal opens with patchworks.com iframe.
- Toggle "→ INTERACT" — pointer events enable, you can scroll the embedded site.
- ← / → in modal jumps between projects.
- Esc closes modal.
- For Dropdeck (`#/01`) and Cedar (`#/04`), screenshot fallback shows.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: PreviewModal — iframe-or-screenshot with controls + tests"
```

---

## Task 18 — Analytics (GA4)

**Files:**
- Create: `src/lib/analytics.ts`
- Modify: `src/App.tsx`, `index.html`

- [ ] **Step 1: Add GA4 script to `index.html`**

Insert before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-N6L9JCEVL5"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-N6L9JCEVL5', { send_page_view: false });
</script>
```

- [ ] **Step 2: Write `src/lib/analytics.ts`**

```ts
declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export function trackPageView(path = window.location.pathname + window.location.hash) {
  window.gtag?.('event', 'page_view', { page_path: path });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', name, params);
}
```

- [ ] **Step 3: Wire in App.tsx**

Add at top of `App` component:

```tsx
import { useEffect } from 'react';
import { trackPageView, trackEvent } from './lib/analytics';

// inside App component:
useEffect(() => { trackPageView(); }, []);
useEffect(() => {
  const onHashChange = () => trackPageView();
  window.addEventListener('hashchange', onHashChange);
  return () => window.removeEventListener('hashchange', onHashChange);
}, []);
```

Track preview opens:

```tsx
const openPreview = useCallback((i: number) => {
  setPreviewIndex(i);
  const p = plates[i];
  if (p.kind === 'project') trackEvent('preview_open', { project: p.fileCode });
}, []);
```

- [ ] **Step 4: Verify in browser**

Open dev tools → Network → filter by "collect". Navigate plates. Confirm GA4 calls fire.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: GA4 page views + preview_open event"
```

---

## Task 19 — Production build, cleanup, smoke

**Files:**
- Modify: `package.json` if needed
- Verify: `pnpm build` produces working bundle

- [ ] **Step 1: Run lint, type-check, tests**

```bash
pnpm lint
pnpm tsc --noEmit
pnpm test:run
```

All must pass. Fix any issues.

- [ ] **Step 2: Remove dev-only smoke code**

Search for any leftover `console.log`, `alert`, or smoke-test imports in `App.tsx` / components. Remove.

- [ ] **Step 3: Build production bundle**

```bash
pnpm build
pnpm preview
```

Open `http://localhost:4173`. Walk through every plate, open every preview. Verify no console errors.

- [ ] **Step 4: Lighthouse check**

Open Chrome DevTools → Lighthouse → "Mobile" → "Performance + Accessibility + Best Practices + SEO" → Analyze.

Target: Performance ≥ 90, Accessibility ≥ 95.

If Performance is below 90: usually root causes are font weight or unused JS. Check the report and address.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: production build verified, lint + tests + lighthouse green"
```

- [ ] **Step 6: Push branch**

```bash
git push -u origin redesign/rolodex
```

---

## Task 20 — Hand-off notes (manual follow-ups)

These are **not coded** by the implementing agent — they are tasks for Sam to do manually after the build is up.

- [ ] Capture a real screenshot of `apps.shopify.com/dropdeck` at 1280×800 and save to `public/screenshots/dropdeck.png`.
- [ ] Capture a real screenshot of the Cedar & Hyde theme (post-password) at 1280×800 → `public/screenshots/cedar-hyde.png`.
- [ ] Walk every `previewMode: 'iframe'` plate. If embedding fails (browser console shows `X-Frame-Options` or CSP block), flip that plate to `previewMode: 'screenshot'` and capture a fallback PNG.
- [ ] Decide final project ordering. Edit `src/data/plates.ts`; renumber `number` and `index` accordingly. Side-rail labels and foot pagers update automatically because they're derived from `index`.
- [ ] Generate an OG image (1200×630, PLATE 00 export) and save to `public/og.png`. Add `<meta property="og:image" content="/og.png" />` to `index.html`.
- [ ] DNS / deployment: from `redesign/rolodex` branch, deploy a preview build (Netlify / Cloudflare Pages / wherever). Once happy, merge to main and cut over.
- [ ] Sanity-check spec items not strictly user-facing: GA4 measurement ID is correct (`G-N6L9JCEVL5` — copied from existing site).

---

## Self-review

Spec coverage:

| Spec section | Plan task |
|---|---|
| §1 purpose | Implicit (whole plan) |
| §2 concept (rolodex × test card) | Tasks 6, 7, 8 |
| §3 stack structure (9 plates) | Task 5 (data) + Task 14 (rendering) |
| §4 card anatomy | Task 6 (chassis) |
| §5 page surround | Task 11 (StackBackdrop) |
| §6 palette | Task 3 (tokens) |
| §7 typography | Task 3 (tokens) |
| §8.1 stack navigation | Tasks 12 (hash) + 13 (scroll/keys) + 14 (Stack) |
| §8.2 preview modal | Task 17 |
| §8.3 iframe behavior | Tasks 15 (hook) + 16 (viewport) + 17 (modal) |
| §9 data model | Task 5 |
| §10 component boundaries | Plan file map + Tasks 6–17 |
| §11 toolchain | Tasks 1, 2 |
| §12 page-load + SEO | Task 1 (index.html), Task 18 (GA4), Task 20 (OG image — manual) |
| §13 mobile | Inline `@media (max-width: 640px)` rules in every component CSS |
| §14 risks | Task 16 (iframe fallback), Task 12 (hash routing) |
| §15 build phases | Plan task ordering |
| §16 success criteria | Task 19 (verification) |

Placeholder scan: no `TODO`, `TBD`, or "implement later" remains in any task. Every step has the actual code or command.

Type consistency:

- `Plate`, `CoverPlate`, `ProjectPlate`, `ContactPlate` — defined in Task 5, used unchanged in Tasks 8, 9, 10, 14, 16, 17.
- `IframeState` — defined Task 15, consumed Task 16.
- Hook signatures: `useHashPlate(total) → { index, setIndex }` — used in Task 14. Matches.
- `useStackNavigation({ total, activeIndex, onChange }) → { containerRef, setPlateRef, scrollTo }` — used in Task 14. Matches.
- `useIframeReady({ enabled, timeoutMs }) → { state, markLoaded, reset }` — used in Task 16. Matches.

Open scope decisions deferred to build:
- Final project order (Task 20)
- Real screenshot captures (Task 20)
- OG image (Task 20)

Plan is ready.
