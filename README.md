# 🫧 Open Air

> A calm, offline-first companion for claustrophobia self-help.
> Breathing, grounding, SUDS/thought logging, and a gentle exposure ladder.

**🔗 Live app: https://pattespatte.github.io/open-air/**

Open Air is a **Progressive Web App (PWA)** designed to feel like the opposite of
a locked space — airy, slow, generous. It builds on established CBT and ERP
(Exposure and Response Prevention) methodology: SUDS tracking, thought records,
exposure logging, habituation checks, and safety-behavior awareness.

It works **fully offline** (critical for elevators and planes), stores **all data
locally** on your device (private by design), speaks **four languages**, and knows
the **emergency numbers** for five countries.

---

## The four modes

| Mode | When | What it does |
|------|------|--------------|
| 🫧 **Now** | When anxiety spikes | One-tap breathing (4-7-8), 5-4-3-2-1 grounding, reassurance text. Loads instantly. |
| 🌿 **Practice** | Daily, when calm | Breathing library (4-7-8 / Box / Coherent), guided grounding, Havening reference. Optional pre/post SUDS. |
| 📝 **Log** | After any anxiety moment | Quick SUDS check-ins, full CBT thought records, ERP exposure logs. Export to JSON + Markdown. |
| 🪜 **Path** | Once or twice a week | Visual exposure ladder with 6 seeded baseline rungs, current focus, gentle next micro-step, milestones. |

**Not sure when to use what?** Tap the **? Guide** button inside the app, or read
[`docs/usage-guide.md`](docs/usage-guide.md) for the full bilingual walkthrough.

---

## Run it

**Use the live version:** https://pattespatte.github.io/open-air/

**Run locally** — no build step, any static server works:

```bash
# From the repo root
python3 -m http.server 8765
# Then open http://localhost:8765
```

Or just open `index.html` directly in a browser (service worker requires http(s),
but the app itself runs from `file://`).

### Install on your phone (offline use)

1. Open the live app in your phone's browser.
2. **iPhone:** Safari → Share → *Add to Home Screen*.
3. **Android:** Chrome → *Install app* / *Add to Home screen*.

Once installed, it works with no signal — the service worker precaches the whole
app.

### Deploy

The live site is hosted on **GitHub Pages**, configured to deploy automatically
from the `main` branch root. **Every push to `main` publishes a new version**
within a minute or two — no manual deploy step. To see build status, visit the
repo's **Environments** tab or **Settings → Pages**.

Because the app is static with no build step, the entire repo root *is* the
published site.

Once installed, it works with no signal — the service worker precaches the whole
app.

---

## What makes it different

- **Calm by design.** Warm off-white palette, sage and sky-blue accents, generous
  space, slow motion. The tool itself should feel like a refuge, not a medical
  form.
- **Offline-first.** Emergency tools must load with no signal. The service worker
  precaches everything.
- **Private.** No server, no account, no analytics, no third-party calls. Your
  data lives in your browser's `localStorage`.
- **Multilingual & multi-country.** Four languages (English, Svenska, Français,
  Deutsch) and five countries with correct emergency numbers (🇸🇪 🇬🇧 🇺🇸 🇫🇷 🇩🇪).
  Country is auto-detected on first launch; both country and language are
  user-overridable. An English speaker in France can have country=FR + language=en.
- **Safety-aware.** Crisis contacts (**1177** / **112** in Sweden) on every
  screen. No minimizing language. Consent-based exposure (the app never pushes you
  up a rung).

---

## Project structure

```
open-air/
├── index.html              # App shell + bottom nav
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (offline precache)
├── css/
│   ├── tokens.css          # Design tokens: palette, type, spacing
│   └── style.css           # Base styles + components
├── js/
│   ├── app.js              # Controller: shell, router, settings, help
│   ├── store.js            # localStorage data layer + export
│   ├── i18n.js             # EN/SV/FR/DE translations
│   ├── countries.js        # Country config (emergency numbers, flags)
│   └── views/
│       ├── now.js          # 🫧 Emergency relief
│       ├── practice.js     # 🌿 Daily skill-building
│       ├── log.js          # 📝 SUDS + thought records + exposure logs
│       └── path.js         # 🪜 Exposure ladder
├── assets/icons/           # PWA icons (192, 512)
├── docs/
│   └── usage-guide.md      # Full bilingual usage guide
├── AGENTS.md               # Guidance for AI assistants working on this repo
└── README.md               # This file
```

---

## Data & privacy

- **All data local** to the browser/device — no server, no cloud.
- **Backup:** Log → History → *Download backup (JSON)*. Restore with *Import*.
- **Repo bridge:** Log → History → *Export as Markdown* writes entries in the
  thought-record format used by the companion CBT project's `/journal/`
  structure, so the app feeds an AI-reviewed markdown workflow.

---

## Tech stack

**Vanilla HTML / CSS / JavaScript (ES modules). No build step, no framework.**

This is deliberate: simplest path to offline, easy for anyone (human or AI) to
edit, and a calm focused tool shouldn't carry a framework's weight. See
[`AGENTS.md`](AGENTS.md) for the full technical conventions and the reasoning
behind each decision.

---

## Companion project

Open Air is the **daily-use surface** of a larger CBT self-help effort. The
therapy methodology, journal, exposure logs, and AI-assistant instructions live
in a separate project. The Markdown export is the bridge between the two: the app
captures in the moment, the markdown project is the durable record for review
with AI assistants or a therapist.

---

## Why this exists

This app is free and released as open source. There are no ads or in-app
purchases. The purpose has been to develop a tool — and hopefully a cure — for
my own claustrophobia. It is helping me, and hopefully also others with similar
needs.

---

## A note on scope

This app **complements, but does not replace, professional therapy**. For
specific phobias, CBT with exposure is the gold standard. In Sweden, **1177** can
refer you. Open Air is the bridge between sessions — the daily practice that
makes therapy land better.
