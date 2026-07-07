/* ===========================================================================
   path.js — 🪜 PATH mode: Exposure Ladder
   Where you are, and the next gentle step. Consent-based.
   =========================================================================== */

import { t } from '../i18n.js';
import { store } from '../store.js';
import { openOverlay, dismissOverlay, mountOverlay } from '../overlay.js';

// Rung display labels (4 languages)
export const RUNG_LABELS = {
  r1: {
    en: 'Watching videos of elevator rides', sv: 'Se videor av hissåkningar',
    fr: 'Regarder des vidéos de trajets en ascenseur', de: 'Ansehen von Videos von Fahrstuhlfahrten',
  },
  r2: {
    en: 'Subway — off-peak hours', sv: 'Tunnelbana — lågtrafik',
    fr: 'Métro — heures creuses', de: 'U-Bahn — Nebenzeit',
  },
  r3: {
    en: 'Large aircraft — short flights', sv: 'Stort flygplan — korta flygningar',
    fr: 'Grand avion — vols courts', de: 'Großes Flugzeug — kurze Flüge',
  },
  r4: {
    en: 'Subway — rush hour', sv: 'Tunnelbana — rusningstrafik',
    fr: 'Métro — heure de pointe', de: 'U-Bahn — Hauptverkehrszeit',
  },
  r5: {
    en: 'Small aircraft / commuter planes', sv: 'Litet flygplan / propellerplan',
    fr: 'Petits avions / avions de ligne', de: 'Kleine Flugzeuge / Propellermaschinen',
  },
  r6: {
    en: 'Riding an elevator (any duration)', sv: 'Åka hiss (någon längd)',
    fr: 'Prendre l’ascenseur (n’importe quelle durée)', de: 'Fahrstuhl fahren (jede Dauer)',
  },
};

// Micro-step suggestions per rung, per language.
// The AGENTS.md "if stuck, suggest a micro-step" pattern.
// Shown only when the user opens a rung; never auto-advanced.
const MICRO_STEPS = {
  r1: {
    en: 'Watch a 30-second elevator video. Then a minute. Notice: nothing happens to the person inside.',
    sv: 'Se en 30-sekunders hissvideo. Sen en minut. Lägg märke till: personen där inne händer ingenting.',
    fr: 'Regardez une vidéo d’ascenseur de 30 secondes. Puis une minute. Remarquez : il n’arrive rien à la personne à l’intérieur.',
    de: 'Schauen Sie sich ein 30-sekündiges Fahrstuhl-Video an. Dann eine Minute. Beachten Sie: Der Person darin passiert nichts.',
  },
  r2: {
    en: 'Walk down to a subway station at midday. Just stand at the entrance. Watch trains come and go.',
    sv: 'Gå ner till en tunnelbanestation mitt på dagen. Stå bara vid ingången. Tåg tåg kommer och går.',
    fr: 'Descendez à une station de métro en milieu de journée. Tenez-vous simplement à l’entrée. Regardez les trains passer.',
    de: 'Gehen Sie mittags zu einer U-Bahn-Station. Stellen Sie sich nur an den Eingang. Schauen Sie den Zügen zu, wie sie kommen und gehen.',
  },
  r3: {
    en: 'Watch a video of a short flight. Picture yourself in the seat. Notice the feeling, and that it is a feeling.',
    sv: 'Se en video av en kort flygning. Föreställ dig själv i sätet. Märk känslan, och att det är en känsla.',
    fr: 'Regardez une vidéo d’un vol court. Imaginez-vous dans le siège. Remarquez le sentiment, et que c’est un sentiment.',
    de: 'Schauen Sie sich ein Video eines kurzen Flugs an. Stellen Sie sich auf dem Sitz vor. Beachten Sie das Gefühl, und dass es ein Gefühl ist.',
  },
  r4: {
    en: 'Stand inside a subway station during a quieter moment. Notice the trains passing without boarding.',
    sv: 'Stå inne i en tunnelbanestation under en lugnare stund. Lägg märke till tågen som passerar utan att gå ombord.',
    fr: 'Tenez-vous dans une station de métro pendant un moment plus calme. Remarquez les trains qui passent sans monter à bord.',
    de: 'Stehen Sie in einer U-Bahn-Station in einem ruhigeren Moment. Beachten Sie die Züge, die vorbeifahren, ohne einzusteigen.',
  },
  r5: {
    en: 'Look at photos or videos of small aircraft on the ground. Read about how they work.',
    sv: 'Titta på foton eller videor av små flygplan på marken. Läs om hur de fungerar.',
    fr: 'Regardez des photos ou vidéos de petits avions au sol. Lisez sur leur fonctionnement.',
    de: 'Schauen Sie sich Fotos oder Videos von kleinen Flugzeugen am Boden an. Lesen Sie darüber, wie sie funktionieren.',
  },
  r6: {
    en: 'Stand near the elevator doors without entering. Just notice what comes up.',
    sv: 'Stå nära hissdörrarna utan att gå in. Märk bara vad som kommer upp.',
    fr: 'Tenez-vous près des portes de l’ascenseur sans entrer. Remarquez simplement ce qui surgit.',
    de: 'Stehen Sie in der Nähe der Fahrstuhltüren, ohne einzusteigen. Beachten Sie einfach, was hochkommt.',
  },
};

export function renderPath(el, ctx) {
  const lang = store.getSettings().language;
  const ladder = store.getLadder();
  const milestones = store.getMilestones();

  // Current focus = lowest rung the user is actively working
  // (defaults to lowest non-avoided, or lowest overall)
  const currentRung = findCurrentFocus(ladder);

  // Empty-ladder guard: render an empty state and bail before touching currentRung.
  if (!currentRung) {
    el.innerHTML = `
      <div class="view-header">
        <h1>${t('path.title')}</h1>
        <p class="subtitle">${t('path.subtitle')}</p>
      </div>
      <div class="card text-center"><p class="text-soft">${t('path.ladder.empty')}</p></div>
    `;
    if (!document.getElementById('path-styles')) {
      const style = document.createElement('style');
      style.id = 'path-styles';
      style.textContent = PATH_STYLES;
      document.head.appendChild(style);
    }
    return;
  }

  el.innerHTML = `
    <div class="view-header">
      <h1>${t('path.title')}</h1>
      <p class="subtitle">${t('path.subtitle')}</p>
    </div>

    <div class="current-focus card-tinted card" data-rung="${currentRung.id}">
      <div class="focus-label">${t('path.currentFocus')}</div>
      <div class="focus-rung">${RUNG_LABELS[currentRung.id]?.[lang] || RUNG_LABELS[currentRung.id]?.en}</div>
      <div class="focus-suds">SUDS ${currentRung.currentSuds}/10</div>
    </div>

    <div class="next-step card">
      <div class="next-step-label">${t('path.nextStepLabel')}</div>
      <p class="next-step-body">${MICRO_STEPS[currentRung.id]?.[lang] || MICRO_STEPS[currentRung.id]?.en}</p>
    </div>

    <h2 class="mt-6">${t('path.title')}</h2>
    <div class="ladder">
      ${ladder.map(r => renderRung(r, lang)).join('')}
    </div>

    <h2 class="mt-6">${t('path.milestones')}</h2>
    ${milestones.length === 0
      ? `<div class="card text-center"><p class="text-soft">${t('path.milestones.empty')}</p></div>`
      : milestones.map(m => `
          <div class="card milestone">
            <div class="milestone-date">${new Date(m.datetime).toLocaleDateString()}</div>
            <h3>${escapeHtml(m.title)}</h3>
            ${m.note ? `<p class="text-soft">${escapeHtml(m.note)}</p>` : ''}
          </div>
        `).join('')
    }
    <button class="btn btn-secondary btn-block mt-4" id="add-milestone">${t('path.milestones.add')}</button>
  `;

  if (!document.getElementById('path-styles')) {
    const style = document.createElement('style');
    style.id = 'path-styles';
    style.textContent = PATH_STYLES;
    document.head.appendChild(style);
  }

  bindPath(el, ctx);
}

function renderRung(r, lang) {
  const label = RUNG_LABELS[r.id]?.[lang] || RUNG_LABELS[r.id]?.en || r.id;
  return `
    <div class="rung" data-rung="${r.id}">
      <div class="rung-bar" style="--rung-color: ${sudsColor(r.currentSuds)}">
        <div class="rung-info">
          <span class="rung-name">${label}</span>
          <button class="rung-edit" data-edit="${r.id}" aria-label="${t('path.editSuds')}">SUDS ${r.currentSuds}</button>
        </div>
        <div class="rung-track">
          <div class="rung-fill" style="width: ${r.currentSuds * 10}%"></div>
        </div>
      </div>
    </div>
  `;
}

function findCurrentFocus(ladder) {
  if (!ladder || ladder.length === 0) return null;
  // Lowest rung at SUDS 7 or below that the user is approaching; else lowest overall
  const approachable = ladder.filter(r => r.currentSuds <= 7);
  return (approachable.length ? approachable : ladder)[0];
}

function sudsColor(suds) {
  if (suds <= 2) return 'var(--suds-0)';
  if (suds <= 4) return 'var(--suds-3)';
  if (suds <= 6) return 'var(--suds-5)';
  if (suds <= 8) return 'var(--suds-7)';
  return 'var(--suds-10)';
}

function bindPath(el, ctx) {
  // Edit rung SUDS (append-only)
  el.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.edit;
      const rung = store.getRung(id);
      openSudsEditor(id, rung, ctx);
    });
  });

  // Add milestone
  el.querySelector('#add-milestone')?.addEventListener('click', () => {
    openMilestoneEditor(ctx);
  });
}

function openSudsEditor(id, rung, ctx) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const historyRows = rung.history.map(h =>
    `<li><span class="hist-date">${h.date}</span><span class="hist-suds">SUDS ${h.suds}/10</span></li>`
  ).join('');
  overlay.innerHTML = `
    <div class="overlay-panel card">
      <div class="overlay-header">
        <h2>${t('path.editSuds')}</h2>
        <button class="btn btn-ghost" data-close aria-label="${t('common.close')}">✕</button>
      </div>
      <p class="text-soft" style="font-size: var(--text-sm); margin-bottom: var(--space-4);">
        ${RUNG_LABELS[id]?.[store.getSettings().language] || RUNG_LABELS[id]?.en}
      </p>
      <div class="field">
        <input type="range" class="suds-slider" id="rung-suds-slider" min="0" max="10" value="${rung.currentSuds}">
        <div class="suds-display" id="rung-suds-display" role="status" aria-live="polite">${rung.currentSuds}</div>
      </div>
      <button class="btn btn-primary btn-block" id="rung-suds-save">${t('common.save')}</button>

      <h3 class="mt-6" style="font-size: var(--text-sm); color: var(--color-text-soft);">${t('path.history')}</h3>
      <ul class="suds-history">${historyRows}</ul>
    </div>
  `;
  mountOverlay(overlay, null, () => ctx.refresh());

  const slider = overlay.querySelector('#rung-suds-slider');
  const display = overlay.querySelector('#rung-suds-display');
  slider.addEventListener('input', () => display.textContent = slider.value);

  overlay.querySelector('#rung-suds-save').addEventListener('click', () => {
    store.updateRungSuds(id, parseInt(slider.value, 10));
    dismissOverlay(overlay);
    ctx.refresh();
  });
}

function openMilestoneEditor(ctx) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="overlay-panel card">
      <div class="overlay-header">
        <h2>${t('path.milestones.add')}</h2>
        <button class="btn btn-ghost" data-close aria-label="${t('common.close')}">✕</button>
      </div>
      <div class="field">
        <label class="field-label" for="ms-title">${t('path.milestones.title')}</label>
        <input type="text" id="ms-title">
      </div>
      <div class="field">
        <label class="field-label" for="ms-note">${t('path.milestones.note')}</label>
        <textarea id="ms-note"></textarea>
      </div>
      <button class="btn btn-primary btn-block" id="ms-save">${t('common.save')}</button>
    </div>
  `;
  mountOverlay(overlay, null, () => ctx.refresh());

  overlay.querySelector('#ms-save').addEventListener('click', () => {
    const title = overlay.querySelector('#ms-title').value.trim();
    if (!title) return;
    store.addMilestone({
      title,
      note: overlay.querySelector('#ms-note').value.trim(),
    });
    dismissOverlay(overlay);
    ctx.refresh();
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const PATH_STYLES = `
.current-focus {
  text-align: center;
  margin-bottom: var(--space-4) !important;
}
.focus-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-soft);
  margin-bottom: var(--space-2);
}
.focus-rung {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}
.focus-suds {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  color: var(--color-primary-deep);
}

.next-step {
  border-left: 3px solid var(--color-primary);
}
.next-step-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary-deep);
  margin-bottom: var(--space-2);
}
.next-step-body {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
}

.ladder {
  display: flex;
  flex-direction: column-reverse; /* highest SUDS at top visually */
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.rung-bar {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.rung-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}
.rung-name {
  font-size: var(--text-sm);
  color: var(--color-text);
}
.rung-edit {
  background: var(--color-surface);
  border: none;
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  color: var(--color-text);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.rung-edit:hover { background: var(--color-surface-2); }

.rung-track {
  height: 6px;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.rung-fill {
  height: 100%;
  background: var(--rung-color, var(--color-primary));
  border-radius: var(--radius-full);
  transition: width var(--transition-slow) var(--ease-gentle);
}

.milestone h3 { margin-bottom: var(--space-2); }
.milestone-date {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  margin-bottom: var(--space-2);
}

.suds-history {
  list-style: none;
  padding: 0;
  margin-top: var(--space-3);
}
.suds-history li {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-surface);
  font-size: var(--text-sm);
}
.suds-history li:last-child { border-bottom: none; }
.hist-date { color: var(--color-text-soft); }
.hist-suds { font-family: var(--font-serif); color: var(--color-primary-deep); }
`;
