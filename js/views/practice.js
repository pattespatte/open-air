/* ===========================================================================
   practice.js — 🌿 PRACTICE mode: Daily skill-building
   Where you rehearse the skills so they're ready when NOW is needed.
   =========================================================================== */

import { t } from '../i18n.js';
import { store } from '../store.js';

export function renderPractice(el, ctx) {
  const sessions = store.getEntriesByType('practice');

  el.innerHTML = `
    <div class="view-header">
      <h1>${t('practice.title')}</h1>
      <p class="subtitle">${t('practice.subtitle')}</p>
    </div>

    <div class="practice-count card-tinted card">
      <div class="practice-count-num">${sessions.length}</div>
      <div class="practice-count-label">${t('practice.count')}</div>
      <p class="text-soft" style="font-size: var(--text-xs); margin-top: var(--space-2);">
        ${t('practice.count.desc')}
      </p>
    </div>

    <h2>${t('practice.choose')}</h2>
    <div class="practice-list stack">
      <button class="practice-item card" data-exercise="478">
        <div class="practice-item-icon">🌬️</div>
        <div class="practice-item-body">
          <div class="practice-item-name">${t('practice.breathing.478')}</div>
          <div class="practice-item-desc">${t('practice.breathing.478.desc')}</div>
        </div>
      </button>
      <button class="practice-item card" data-exercise="box">
        <div class="practice-item-icon">◽</div>
        <div class="practice-item-body">
          <div class="practice-item-name">${t('practice.breathing.box')}</div>
          <div class="practice-item-desc">${t('practice.breathing.box.desc')}</div>
        </div>
      </button>
      <button class="practice-item card" data-exercise="coherent">
        <div class="practice-item-icon">🌊</div>
        <div class="practice-item-body">
          <div class="practice-item-name">${t('practice.breathing.coherent')}</div>
          <div class="practice-item-desc">${t('practice.breathing.coherent.desc')}</div>
        </div>
      </button>
      <button class="practice-item card" data-exercise="grounding">
        <div class="practice-item-icon">🌍</div>
        <div class="practice-item-body">
          <div class="practice-item-name">${t('practice.grounding')}</div>
          <div class="practice-item-desc">${t('practice.grounding.desc')}</div>
        </div>
      </button>
      <button class="practice-item card" data-exercise="havening">
        <div class="practice-item-icon">🤲</div>
        <div class="practice-item-body">
          <div class="practice-item-name">${t('practice.havening')}</div>
          <div class="practice-item-desc">${t('practice.havening.desc')}</div>
        </div>
      </button>
    </div>
  `;

  // Inject styles once
  if (!document.getElementById('practice-styles')) {
    const style = document.createElement('style');
    style.id = 'practice-styles';
    style.textContent = PRACTICE_STYLES;
    document.head.appendChild(style);
  }

  el.querySelectorAll('.practice-item').forEach(btn => {
    btn.addEventListener('click', () => {
      openExercise(el, ctx, btn.dataset.exercise);
    });
  });
}

/* --- Exercise runner (modal-like full view) --- */
function openExercise(el, ctx, exercise) {
  // Breathing patterns
  const PATTERNS = {
    '478':      [{ p: 'in', d: 4 }, { p: 'hold', d: 7 }, { p: 'out', d: 8 }],
    'box':      [{ p: 'in', d: 4 }, { p: 'hold', d: 4 }, { p: 'out', d: 4 }, { p: 'hold', d: 4 }],
    'coherent': [{ p: 'in', d: 5 }, { p: 'out', d: 5 }],
  };

  if (exercise === 'havening') {
    renderReading(el, ctx, t('practice.havening'), t('practice.havening.body'), exercise);
    return;
  }
  if (exercise === 'grounding') {
    renderGroundingExercise(el, ctx);
    return;
  }

  // Breathing exercise
  const pattern = PATTERNS[exercise];
  renderBreathingExercise(el, ctx, exercise, pattern);
}

function renderBreathingExercise(el, ctx, exercise, pattern) {
  let preSuds = null, postSuds = null;
  const overlay = createOverlay();
  overlay.innerHTML = `
    <div class="overlay-panel card">
      <div class="overlay-header">
        <h2>${exerciseLabel(exercise)}</h2>
        <button class="btn btn-ghost" data-close aria-label="${t('common.close')}">✕</button>
      </div>

      <div class="exercise-stage" id="exercise-stage">
        <div class="breath-circle breath-circle-lg" id="ex-breath-circle">
          <div class="breath-circle-inner">
            <span class="breath-label" id="ex-breath-label"></span>
            <span class="breath-count" id="ex-breath-count"></span>
          </div>
        </div>
        <p class="breath-hint" id="ex-hint"></p>
      </div>

      <div class="exercise-suds-pre" id="ex-pre" hidden>
        <label class="field-label">${t('practice.preSuds')}</label>
        <input type="range" class="suds-slider" id="ex-pre-suds" min="0" max="10" value="5">
        <div class="suds-display" id="ex-pre-display">5</div>
        <button class="btn btn-primary btn-block mt-5" id="ex-pre-confirm">${t('practice.begin')}</button>
      </div>

      <div class="exercise-suds-post" id="ex-post" hidden>
        <label class="field-label">${t('practice.postSuds')}</label>
        <input type="range" class="suds-slider" id="ex-post-suds" min="0" max="10" value="5">
        <div class="suds-display" id="ex-post-display">5</div>
        <button class="btn btn-primary btn-block mt-5" id="ex-post-confirm">${t('practice.save')}</button>
      </div>

      <div class="exercise-saved" id="ex-saved" hidden>
        <p class="reassurance-body" style="text-align:center;">${t('practice.saved')}</p>
        <button class="btn btn-secondary btn-block mt-5" data-close>${t('common.close')}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const stage = overlay.querySelector('#exercise-stage');
  const pre = overlay.querySelector('#ex-pre');
  const post = overlay.querySelector('#ex-post');
  const saved = overlay.querySelector('#ex-saved');
  const circle = overlay.querySelector('#ex-breath-circle');
  const label = overlay.querySelector('#ex-breath-label');
  const count = overlay.querySelector('#ex-breath-count');
  const hint = overlay.querySelector('#ex-hint');

  const reduced = store.getSettings().reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Show pre-SUDS first
  stage.hidden = true;
  pre.hidden = false;
  const preSlider = overlay.querySelector('#ex-pre-suds');
  const preDisplay = overlay.querySelector('#ex-pre-display');
  preSlider.addEventListener('input', () => preDisplay.textContent = preSlider.value);
  overlay.querySelector('#ex-pre-confirm').addEventListener('click', () => {
    preSuds = parseInt(preSlider.value, 10);
    pre.hidden = true;
    stage.hidden = false;
    startBreathing();
  });

  let breathing = false;
  async function runPhase(phase) {
    const key = phase.p === 'in' ? 'now.breathe.in' : phase.p === 'hold' ? 'now.breathe.hold' : 'now.breathe.out';
    const scale = phase.p === 'in' ? 1.35 : phase.p === 'hold' ? 1.35 : 0.85;
    label.textContent = t(key);
    circle.style.transition = reduced ? 'none' : `transform ${phase.d}s cubic-bezier(0.45,0,0.55,1)`;
    circle.style.transform = `scale(${reduced ? 1 : scale})`;
    for (let n = phase.d; n > 0; n--) {
      count.textContent = n;
      await delay(1000);
      if (!breathing) return;
    }
  }
  async function loop() {
    while (breathing) {
      for (const ph of pattern) {
        if (!breathing) return;
        await runPhase(ph);
      }
    }
  }
  function startBreathing() {
    breathing = true;
    hint.textContent = t('now.breathe.slow');
    loop();
    // Stop button — tap circle to finish
    circle.addEventListener('click', finish, { once: true });
    hint.insertAdjacentHTML('afterend', `<p class="breath-tap-hint" id="tap-hint">Tap circle when done</p>`);
  }
  function finish() {
    breathing = false;
    circle.style.transition = `transform 600ms var(--ease-gentle)`;
    circle.style.transform = 'scale(1)';
    overlay.querySelector('#tap-hint')?.remove();
    stage.hidden = true;
    post.hidden = false;
    const postSlider = overlay.querySelector('#ex-post-suds');
    const postDisplay = overlay.querySelector('#ex-post-display');
    postSlider.value = preSuds;
    postDisplay.textContent = preSuds;
    postSlider.addEventListener('input', () => postDisplay.textContent = postSlider.value);
    overlay.querySelector('#ex-post-confirm').addEventListener('click', () => {
      postSuds = parseInt(postSlider.value, 10);
      store.addEntry({
        type: 'practice',
        exercise: exerciseLabel(exercise),
        sudsBefore: preSuds,
        sudsAfter: postSuds,
      });
      post.hidden = true;
      saved.hidden = false;
      // On close, re-render the practice view to update count
      overlay.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => {
        overlay.remove();
        ctx.refresh();
      }));
    });
  }

  overlay.querySelectorAll('[data-close]').forEach(b =>
    b.addEventListener('click', () => overlay.remove())
  );
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function renderGroundingExercise(el, ctx) {
  const STEPS = [
    { count: 5, key: 'now.grounding.see' },
    { count: 4, key: 'now.grounding.touch' },
    { count: 3, key: 'now.grounding.hear' },
    { count: 2, key: 'now.grounding.smell' },
    { count: 1, key: 'now.grounding.taste' },
  ];

  const overlay = createOverlay();
  overlay.innerHTML = `
    <div class="overlay-panel card">
      <div class="overlay-header">
        <h2>${t('practice.grounding')}</h2>
        <button class="btn btn-ghost" data-close aria-label="${t('common.close')}">✕</button>
      </div>
      <div id="g-stage"></div>
    </div>`;
  document.body.appendChild(overlay);

  const stage = overlay.querySelector('#g-stage');
  let i = 0;
  function showStep() {
    if (i >= STEPS.length) {
      stage.innerHTML = `
        <div class="grounding-done" style="display:block;">
          <p class="grounding-done-text">${t('now.grounding.done')}</p>
          <button class="btn btn-primary btn-block" id="g-save">${t('practice.save')}</button>
        </div>`;
      overlay.querySelector('#g-save').addEventListener('click', () => {
        store.addEntry({ type: 'practice', exercise: t('practice.grounding') });
        overlay.remove();
        ctx.refresh();
      });
      return;
    }
    const step = STEPS[i];
    stage.innerHTML = `
      <div class="grounding-step">
        <div class="grounding-count">${step.count}</div>
        <p class="grounding-prompt">${t(step.key)}</p>
        <button class="btn btn-secondary btn-block" id="g-next">${i === STEPS.length - 1 ? t('practice.save') : t('now.grounding.next')}</button>
      </div>`;
    overlay.querySelector('#g-next').addEventListener('click', () => { i++; showStep(); });
  }
  showStep();

  overlay.querySelectorAll('[data-close]').forEach(b =>
    b.addEventListener('click', () => overlay.remove())
  );
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function renderReading(el, ctx, title, body, exercise) {
  const overlay = createOverlay();
  overlay.innerHTML = `
    <div class="overlay-panel card">
      <div class="overlay-header">
        <h2>${title}</h2>
        <button class="btn btn-ghost" data-close aria-label="${t('common.close')}">✕</button>
      </div>
      <div class="reading-body">
        ${body.split('\n\n').map(p => `<p>${p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`).join('')}
      </div>
      <button class="btn btn-primary btn-block mt-6" id="reading-save">${t('practice.save')}</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#reading-save').addEventListener('click', () => {
    store.addEntry({ type: 'practice', exercise: title });
    overlay.remove();
    ctx.refresh();
  });
  overlay.querySelectorAll('[data-close]').forEach(b =>
    b.addEventListener('click', () => overlay.remove())
  );
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

/* --- Helpers --- */
function exerciseLabel(ex) {
  return {
    '478': t('practice.breathing.478'),
    'box': t('practice.breathing.box'),
    'coherent': t('practice.breathing.coherent'),
  }[ex] || ex;
}

function createOverlay() {
  const div = document.createElement('div');
  div.className = 'overlay';
  return div;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const PRACTICE_STYLES = `
.practice-count {
  text-align: center;
  margin-bottom: var(--space-6) !important;
}
.practice-count-num {
  font-family: var(--font-serif);
  font-size: var(--text-3xl);
  color: var(--color-primary-deep);
  line-height: 1;
}
.practice-count-label {
  font-size: var(--text-sm);
  color: var(--color-text-soft);
  margin-top: var(--space-1);
}

.practice-list { margin-top: var(--space-4); }

.practice-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  text-align: left;
  cursor: pointer;
  width: 100%;
  border: none;
  font-family: inherit;
  color: inherit;
  transition: transform var(--transition-base);
  -webkit-tap-highlight-color: transparent;
}
.practice-item:active { transform: scale(0.98); }

.practice-item-icon {
  font-size: var(--text-2xl);
  width: 48px;
  text-align: center;
  flex-shrink: 0;
}

.practice-item-name {
  font-weight: var(--weight-medium);
  font-size: var(--text-base);
  color: var(--color-text);
}

.practice-item-desc {
  font-size: var(--text-sm);
  color: var(--color-text-soft);
  margin-top: var(--space-1);
}

/* Breathing circle in overlay (reused from NOW) */
.breath-circle-lg {
  width: 200px;
  height: 200px;
  margin: var(--space-6) auto;
}

.exercise-stage { text-align: center; }
.breath-tap-hint {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  margin-top: var(--space-3);
}

.suds-display {
  text-align: center;
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  color: var(--color-primary-deep);
  margin-top: var(--space-3);
}

.reading-body p {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}
.reading-body strong { color: var(--color-text); font-weight: var(--weight-semibold); }

#ex-breath-circle { cursor: pointer; }
`;
