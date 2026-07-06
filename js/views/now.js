/* ===========================================================================
   now.js — 🫧 NOW mode: Emergency Relief
   Opened mid-panic. One tap to start. Zero data entry. Loads instantly.
   =========================================================================== */

import { t } from '../i18n.js';
import { store } from '../store.js';

export function renderNow(el, ctx) {
  el.innerHTML = `
    <div class="view-header text-center">
      <h1>${t('now.title')}</h1>
      <p class="subtitle">${t('now.subtitle')}</p>
    </div>

    <div class="now-section now-breathe">
      <button class="breathing-cta" id="start-breathing">
        <div class="breath-circle" id="breath-circle">
          <div class="breath-circle-inner">
            <span class="breath-label" id="breath-label">${t('now.breathe')}</span>
            <span class="breath-count" id="breath-count"></span>
          </div>
        </div>
      </button>
      <p class="breath-hint" id="breath-hint">${t('now.startBreathing')}</p>
    </div>

    <div class="now-tabs">
      <button class="now-tab active" data-tab="grounding">${t('now.grounding')}</button>
      <button class="now-tab" data-tab="reassurance">${t('now.reassurance')}</button>
    </div>

    <div class="now-panel" id="now-panel">
      <!-- Grounding or reassurance content injected here -->
    </div>

    <p class="disclaimer">${t('app.tagline')}. Complements, not replaces, professional care.</p>
  `;

  // Add the view-specific styles by injecting a <style> once
  if (!document.getElementById('now-styles')) {
    const style = document.createElement('style');
    style.id = 'now-styles';
    style.textContent = NOW_STYLES;
    document.head.appendChild(style);
  }

  bindNow(el, ctx);
}

/* --- Grounding 5-4-3-2-1 ---
   Built fresh on each render so it picks up the current language. */
function groundingSteps() {
  return [
    { count: 5, key: 'now.grounding.see',   prompt: t('now.grounding.see') },
    { count: 4, key: 'now.grounding.touch', prompt: t('now.grounding.touch') },
    { count: 3, key: 'now.grounding.hear',  prompt: t('now.grounding.hear') },
    { count: 2, key: 'now.grounding.smell', prompt: t('now.grounding.smell') },
    { count: 1, key: 'now.grounding.taste', prompt: t('now.grounding.taste') },
  ];
}

function renderGrounding() {
  const steps = groundingSteps();
  return `
    <div class="grounding-intro">
      <p class="text-soft">${t('now.grounding.subtitle')}</p>
    </div>
    <div class="grounding-steps" id="grounding-steps">
      ${steps.map((step, i) => `
        <div class="grounding-step" data-step="${i}" ${i > 0 ? 'hidden' : ''}>
          <div class="grounding-count">${step.count}</div>
          <p class="grounding-prompt">${step.prompt}</p>
        </div>
      `).join('')}
    </div>
    <div class="grounding-controls">
      <button class="btn btn-secondary" id="grounding-next">${t('now.grounding.next')}</button>
    </div>
    <div class="grounding-done" hidden>
      <p class="grounding-done-text">${t('now.grounding.done')}</p>
      <button class="btn btn-ghost" id="grounding-restart">${t('now.grounding.restart')}</button>
    </div>
  `;
}

function renderReassurance() {
  return `
    <div class="reassurance-body">
      ${t('now.reassurance.body').split('\n\n').map(p => `<p>${p}</p>`).join('')}
    </div>
  `;
}

/* --- Bind all NOW interactions --- */
function bindNow(el, ctx) {
  // Tabs
  const panel = el.querySelector('#now-panel');
  let activeTab = 'grounding';
  panel.innerHTML = renderGrounding();

  el.querySelectorAll('.now-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      el.querySelectorAll('.now-tab').forEach(t => t.classList.toggle('active', t === tab));
      panel.innerHTML = activeTab === 'grounding' ? renderGrounding() : renderReassurance();
      if (activeTab === 'grounding') bindGrounding(el);
    });
  });

  bindGrounding(el);
  bindBreathing(el);
}

function bindGrounding(el) {
  const steps = el.querySelectorAll('.grounding-step');
  const nextBtn = el.querySelector('#grounding-next');
  const doneSection = el.querySelector('.grounding-done');
  const stepsContainer = el.querySelector('#grounding-steps');
  let current = 0;

  if (!nextBtn) return;

  nextBtn.addEventListener('click', () => {
    if (current < steps.length - 1) {
      steps[current].hidden = true;
      current++;
      steps[current].hidden = false;
    } else {
      // Last step → show done
      stepsContainer.hidden = true;
      nextBtn.hidden = true;
      doneSection.hidden = false;

      const restart = el.querySelector('#grounding-restart');
      restart?.addEventListener('click', () => {
        current = 0;
        steps.forEach((s, i) => s.hidden = i !== 0);
        stepsContainer.hidden = false;
        nextBtn.hidden = false;
        doneSection.hidden = true;
      });
    }
  });
}

/* --- Breathing animation ---
   4-7-8 pattern by default: inhale 4s, hold 7s, exhale 8s.
   Uses CSS transitions on the circle. Respects reduced motion. */
function bindBreathing(el) {
  const cta = el.querySelector('#start-breathing');
  const circle = el.querySelector('#breath-circle');
  const label = el.querySelector('#breath-label');
  const count = el.querySelector('#breath-count');
  const hint = el.querySelector('#breath-hint');

  let breathing = false;
  let timer = null;
  let countdown = null;

  const reduced = store.getSettings().reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 4-7-8 pattern phases: [name, durationSec, label-key, scale]
  const PHASES = [
    { name: 'in',  dur: 4, key: 'now.breathe.in',  scale: 1.35 },
    { name: 'hold', dur: 7, key: 'now.breathe.hold', scale: 1.35 },
    { name: 'out',  dur: 8, key: 'now.breathe.out',  scale: 0.85 },
  ];

  async function runPhase(phase) {
    label.textContent = t(phase.key);
    circle.style.transition = reduced
      ? 'background-color 280ms'
      : `transform ${phase.dur}s cubic-bezier(0.45, 0, 0.55, 1)`;
    circle.style.transform = `scale(${reduced ? 1 : phase.scale})`;

    // Countdown
    for (let n = phase.dur; n > 0; n--) {
      count.textContent = n;
      await delay(1000);
      if (!breathing) return;
    }
  }

  async function loop() {
    while (breathing) {
      for (const phase of PHASES) {
        if (!breathing) return;
        await runPhase(phase);
      }
    }
  }

  function start() {
    breathing = true;
    hint.textContent = t('now.breathe.slow');
    cta.classList.add('breathing');
    loop();
  }

  function stop() {
    breathing = false;
    circle.style.transition = `transform 600ms var(--ease-gentle)`;
    circle.style.transform = 'scale(1)';
    label.textContent = t('now.breathe');
    count.textContent = '';
    hint.textContent = t('now.startBreathing');
    cta.classList.remove('breathing');
  }

  cta.addEventListener('click', () => {
    if (breathing) stop(); else start();
  });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* --- View-specific styles ---
   Injected once per session. Keeps style.css leaner and lets NOW own its
   signature element (the breathing circle). */
const NOW_STYLES = `
.now-section {
  margin-bottom: var(--space-7);
  text-align: center;
}

/* Breathing circle — the signature element */
.breathing-cta {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: var(--space-6) auto;
  display: block;
  -webkit-tap-highlight-color: transparent;
}

.breath-circle {
  width: 220px;
  height: 220px;
  border-radius: var(--radius-full);
  background: radial-gradient(circle at 40% 35%, var(--color-primary-soft), var(--color-secondary-soft));
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transition: transform 4s cubic-bezier(0.45, 0, 0.55, 1);
  box-shadow: 0 0 60px rgba(139, 168, 137, 0.25);
}

.breathing-cta.breathing .breath-circle {
  box-shadow: 0 0 80px rgba(139, 168, 137, 0.4);
}

.breath-circle-inner {
  text-align: center;
  color: var(--color-text);
}

.breath-label {
  display: block;
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: var(--weight-medium);
}

.breath-count {
  display: block;
  font-size: var(--text-2xl);
  font-family: var(--font-serif);
  color: var(--color-primary-deep);
  margin-top: var(--space-1);
  min-height: 1em;
}

.breath-hint {
  color: var(--color-text-soft);
  font-size: var(--text-sm);
}

/* Tabs */
.now-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  background: var(--color-surface);
  border-radius: var(--radius-full);
  padding: 4px;
}

.now-tab {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--color-text-soft);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  -webkit-tap-highlight-color: transparent;
}

.now-tab.active {
  background: var(--color-bg-elevated);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

.now-panel {
  min-height: 200px;
}

/* Grounding */
.grounding-intro { text-align: center; margin-bottom: var(--space-6); }

.grounding-step {
  text-align: center;
  animation: viewFadeIn var(--transition-base) var(--ease-soft) both;
}

.grounding-count {
  font-family: var(--font-serif);
  font-size: var(--text-4xl);
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--space-4);
}

.grounding-prompt {
  font-size: var(--text-lg);
  color: var(--color-text);
  max-width: 320px;
  margin: 0 auto var(--space-6);
}

.grounding-controls { text-align: center; }

.grounding-done {
  text-align: center;
  animation: viewFadeIn var(--transition-slow) var(--ease-soft) both;
}

.grounding-done-text {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  color: var(--color-primary-deep);
  margin-bottom: var(--space-5);
}

/* Reassurance */
.reassurance-body p {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
  margin-bottom: var(--space-5);
}

.reassurance-body p:last-child { margin-bottom: 0; }

@media (prefers-reduced-motion: reduce) {
  .breath-circle { transition: background-color 280ms; }
}
`;
