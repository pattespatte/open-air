# AGENTS.md — Open Air App

Guidance for AI assistants working on **Open Air**, a claustrophobia self-help
PWA. This file lives in the app repo (`~/repo/open-air/`) and focuses on the
*software*. The companion CBT project at `~/Desktop/Projects/claustrophobia/`
holds the therapy methodology, journal, and exposure logs.

---

## What this app is

A calm, spacious, offline-first web app with four modes, each for a different
moment of use:

- **🫧 Now** — Emergency relief. One-tap breathing (4-7-8), 5-4-3-2-1
  grounding, reassurance text. Must load instantly and work with no signal.
- **🌿 Practice** — Daily skill-building. Breathing exercises (4-7-8, Box,
  Coherent), guided grounding, Havening reference. Optional pre/post SUDS.
- **📝 Log** — Quick SUDS check-ins, full CBT thought records, ERP exposure
  logs. Export to JSON (backup) and Markdown (feeds the CBT repo's journal).
- **🪜 Path** — The exposure ladder. Six seeded baseline rungs (3/5/6/8/9/10
  SUDS), current focus, gentle next micro-step, milestones.

The user is a 61-year-old in Sweden working to overcome a 56-year fear of
elevators and small planes. He has not yet started real-world exposures.

---

## Technical stack (do not change without reason)

- **Vanilla HTML / CSS / JavaScript (ES modules). No build step.**
  Runs from `file://` or any static host. This is deliberate: simplest path
  to offline, easy to edit, no framework weight for a calm focused tool.
- **PWA**: `manifest.json` + `sw.js` precache the whole app for full offline
  use. Critical — the app must work inside an elevator or a plane.
- **Data layer**: `localStorage` only (via `js/store.js`). No server, no
  cloud, no analytics, no third-party calls. Privacy by design.
- **i18n**: keyed dictionary in `js/i18n.js`. Four languages: EN, SV, FR, DE.
  Helper: `t('key')` reads the current language at call time.
- **Countries**: `js/countries.js` maps each country to its emergency numbers
  and a suggested language. Country and language are SEPARATE settings — country
  drives the crisis-bar numbers, language drives the UI text. Country is
  auto-detected once on first launch (gated by `settings.countryDetected`),
  then only changes on explicit user action.
- **No external dependencies** in v1. Breathing animations are pure CSS.

Do not introduce a framework, bundler, or runtime dependency without
explicit approval. If a view genuinely needs reactivity, add the smallest
possible change first.

---

## Architecture

```
open-air/
├── index.html              # Shell + <div id="app"> mount + bottom nav
├── manifest.json           # PWA manifest ("Open Air")
├── sw.js                   # Service worker — precache, cache-first
├── AGENTS.md               # THIS FILE
├── css/
│   ├── tokens.css          # Design tokens: palette, type scale, spacing
│   └── style.css           # Base styles + components
├── js/
│   ├── app.js              # Controller: settings, router, shell, nav
│   ├── store.js            # localStorage CRUD + JSON/Markdown export
│   ├── i18n.js             # EN/SV/FR/DE translations, t() helper
│   ├── countries.js        # Country config (emergency numbers, detection)
│   └── views/
│       ├── now.js          # 🫧 Emergency relief
│       ├── practice.js     # 🌿 Daily skill-building
│       ├── log.js          # 📝 SUDS + thought records + exposure logs
│       └── path.js         # 🪜 Exposure ladder
└── assets/icons/           # PWA icons (192, 512)
```

**Routing** is hash-based (`#now`, `#practice`, `#log`, `#path`).
`app.js` renders the shell, then calls the view module's `render(el, ctx)`
where `ctx` = `{ navigate, refresh }`.

**Per-view styles** are injected once via a `<style>` tag with an id
(e.g. `now-styles`). This keeps `style.css` lean and lets each view own its
signature elements. Follow this pattern for new views.

---

## Design language: "Open Air"

The tool should feel like the opposite of a locked space — airy, slow,
generous. Every visual decision serves calm.

- **Palette** (in `css/tokens.css`): warm off-white background (`#FAF7F2`),
  sage/eucalyptus primary, muted sky-blue secondary, warm charcoal text.
  Never clinical white. Never harsh red.
- **Space**: large tap targets (min 44px), generous padding, rounded corners
  (16–24px), only the softest shadows.
- **Type**: base 17px+, generous line-height, humanist system sans + literary
  serif for headings.
- **Motion**: slow, breathing-paced. **Always respect
  `prefers-reduced-motion`** and the in-app "Reduce motion" toggle.
- **Accessibility**: WCAG AA contrast (verify any text-on-color). The app
  offers High Contrast and Larger Text modes in Settings.

When adding UI, ask: *does this feel calm and spacious, or busy and
demanding?* If the latter, simplify.

---

## Safety rules (non-negotiable)

These come from the companion CBT project and are encoded into the product:

1. **Crisis contacts on every screen.** The crisis bar appears on all four
   views, in all languages. Numbers come from `countries.js` (🇸🇪 1177/112,
   🇬🇧 111/999, 🇺🇸 988/911, 🇫🇷 15/112, 🇩🇪 116117/112). Never remove or
   bury the crisis bar. When adding a country, update `COUNTRIES` and
   `COUNTRY_ORDER` in `js/countries.js`.
2. **No minimizing language.** Copy must never say "just relax" or "it's not
   dangerous." Phobic anxiety is a real physiological response. See the
   reassurance text in `now.js` for the house tone.
3. **No references to childhood trauma.** The app focuses purely on the
   *present maintenance* of the fear. Never add content about origins.
4. **Therapy disclaimer.** A quiet footer notes the tool complements, not
   replaces, professional care.
5. **Consent-based exposure.** The Path view only *reveals* the next
   micro-step when a rung is opened. It never auto-advances or pushes.
6. **Append-only ladder.** SUDS edits to ladder rungs always append to
   `history`; never overwrite. (`store.updateRungSuds` enforces this.)

---

## Data model (in `js/store.js`)

All data under one localStorage key: `openair.v1`.

```js
{
  settings: { language, country, countryDetected, contrast, textSize, reducedMotion },
  entries:  [{ id, type, datetime, ... }],  // 'checkin' | 'thought' | 'exposure' | 'practice'
  ladder:   [{ id, baselineSuds, currentSuds, history: [{date, suds}] }],  // 6 seeded rungs
  milestones: [{ id, datetime, title, note }],
  _version: 1
}
```

- **Backup/restore**: `exportJSON()` / `importJSON()`.
- **Repo bridge**: `exportMarkdown()` writes entries in the CBT repo's
  `/journal/YYYY-MM-DD.md` thought-record format. When you change entry
  fields, update `renderEntryMarkdown()` to match.

---

## Conventions for contributions

- **Match the surrounding code.** Comment density, naming, and idiom should
  blend in. Existing style: 2-space indent, no semicolons, ES module imports,
  template literals for HTML.
- **No semicolons** (matches the existing files).
- **View-local CSS** goes in the view's `*_STYLES` constant, injected once.
  Only shared primitives go in `css/style.css`.
- **i18n every string.** No hardcoded user-facing text in any language — add
  keys to ALL FOUR language blocks (`en`, `sv`, `fr`, `de`) in `js/i18n.js`,
  then use `t('key')`. If you add a country, also add its numbers to
  `js/countries.js` and its language block to `i18n.js`.
  Watch for arrays built at module load (they capture language at import
  time — make them functions called at render time instead).
- **Test in all four languages** before considering a view done.
- **Verify offline**: after changes, reload with the network throttled to
  offline and confirm the app still loads.
- **Accessibility**: run an axe-core check on new UI. Primary buttons must
  use `--color-primary-action` (#5E7A5D, AA 4.75:1), not `--color-primary`.

---

## Out of scope for v1

Cloud sync, accounts, analytics, in-app AI chat, notifications/reminders,
biofeedback, social features. These were deliberately deferred — see the
original plan. Raise before adding.

---

## Translation status

- **English, Swedish**: primary, carefully written.
- **French, German**: AI-produced drafts. Solid but NOT native-reviewed. If
  you change FR/DE copy, preserve the tone (calm, non-clinical, no minimizing
  language) and flag any major rewording as benefiting from native review. The
  app author plans to have these checked by native speakers before publication.

---

## Companion project

The CBT methodology, user history, and AI-therapy instructions live at:
`~/Desktop/Projects/claustrophobia/` (see its `CLAUDE.md` and `AGENTS.md`).

This app is the **daily-use surface**; that project is the **durable
record**. The Markdown export is the bridge between them.
