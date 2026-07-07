/* ===========================================================================
   log.js — 📝 LOG mode: SUDS & Thought Records
   Quick capture + full CBT thought records + ERP exposure logs + history.
   =========================================================================== */

import { t } from '../i18n.js';
import { store } from '../store.js';

export function renderLog(el, ctx) {
  el.innerHTML = `
    <div class="view-header">
      <h1>${t('log.title')}</h1>
      <p class="subtitle">${t('log.subtitle')}</p>
    </div>

    <div class="log-tabs">
      <button class="log-tab active" data-tab="quick">${t('log.quick')}</button>
      <button class="log-tab" data-tab="thought">${t('log.thought')}</button>
      <button class="log-tab" data-tab="exposure">${t('log.exposure')}</button>
      <button class="log-tab" data-tab="history">${t('log.history')}</button>
    </div>

    <div id="log-panel"></div>
  `;

  if (!document.getElementById('log-styles')) {
    const style = document.createElement('style');
    style.id = 'log-styles';
    style.textContent = LOG_STYLES;
    document.head.appendChild(style);
  }

  let activeTab = 'quick';
  const panel = el.querySelector('#log-panel');

  function show(tab) {
    activeTab = tab;
    el.querySelectorAll('.log-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    if (tab === 'quick')     panel.innerHTML = renderQuick();
    if (tab === 'thought')   panel.innerHTML = renderThought();
    if (tab === 'exposure')  panel.innerHTML = renderExposure();
    if (tab === 'history')   panel.innerHTML = renderHistory();
    bindPanel(tab, ctx);
  }

  el.querySelectorAll('.log-tab').forEach(tab =>
    tab.addEventListener('click', () => show(tab.dataset.tab))
  );

  show('quick');
}

/* --- Quick check-in --- */
function renderQuick() {
  return `
    <div class="card">
      <div class="field">
        <label class="field-label" for="quick-suds">${t('log.quick.suds')}</label>
        <input type="range" class="suds-slider" id="quick-suds" min="0" max="10" value="5">
        <div class="suds-display" id="quick-suds-display" role="status" aria-live="polite">5</div>
      </div>
      <div class="field">
        <label class="field-label" for="quick-note">${t('log.quick.note')}</label>
        <input type="text" id="quick-note" placeholder="${t('common.optional')}…">
      </div>
      <button class="btn btn-primary btn-block" id="quick-save">${t('log.quick.save')}</button>
      <div class="form-saved" id="quick-saved" hidden>✓</div>
    </div>
  `;
}

/* --- Thought record (CLAUDE.md structure) --- */
function renderThought() {
  return `
    <div class="card">
      <p class="text-soft mb-5" style="font-size: var(--text-sm);">${t('log.thought.subtitle')}</p>
      <div class="field">
        <label class="field-label">${t('log.thought.emotions')}</label>
        <input type="range" class="suds-slider" id="th-suds" min="0" max="10" value="5">
        <div class="suds-display" id="th-suds-display" role="status" aria-live="polite">5</div>
      </div>
      <div class="field">
        <label class="field-label" for="th-situation">${t('log.thought.situation')}</label>
        <textarea id="th-situation"></textarea>
      </div>
      <div class="field">
        <label class="field-label" for="th-auto">${t('log.thought.auto')}</label>
        <textarea id="th-auto"></textarea>
      </div>
      <div class="field">
        <label class="field-label" for="th-sens">${t('log.thought.sensations')}</label>
        <textarea id="th-sens"></textarea>
      </div>
      <div class="field">
        <label class="field-label" for="th-dist">${t('log.thought.distortions')}</label>
        <textarea id="th-dist"></textarea>
      </div>
      <div class="field">
        <label class="field-label" for="th-alt">${t('log.thought.alternative')}</label>
        <textarea id="th-alt"></textarea>
      </div>
      <button class="btn btn-primary btn-block" id="th-save">${t('log.thought.save')}</button>
    </div>
  `;
}

/* --- Exposure log (AGENTS.md ERP workflow) --- */
function renderExposure() {
  const ladder = store.getLadder();
  const options = ladder.map(r =>
    `<option value="${r.id}">${r.currentSuds}/10 — ${rungLabel(r.id)}</option>`
  ).join('');

  return `
    <div class="card">
      <p class="text-soft mb-5" style="font-size: var(--text-sm);">${t('log.exposure.subtitle')}</p>
      <div class="field">
        <label class="field-label" for="ex-rung">${t('log.exposure.rung')}</label>
        <select id="ex-rung">${options}</select>
      </div>
      <div class="field">
        <label class="field-label" for="ex-duration">${t('log.exposure.duration')}</label>
        <input type="number" id="ex-duration" min="1" placeholder="15">
      </div>
      <div class="field">
        <label class="field-label">${t('log.exposure.anticipatory')}</label>
        <input type="range" class="suds-slider" id="ex-ant" min="0" max="10" value="7">
        <div class="suds-display" id="ex-ant-display" role="status" aria-live="polite">7</div>
      </div>
      <div class="field">
        <label class="field-label" for="ex-pred">${t('log.exposure.prediction')}</label>
        <textarea id="ex-pred" placeholder="${t('log.exposure.prediction')}"></textarea>
      </div>
      <div class="field">
        <label class="field-label">${t('log.exposure.peak')}</label>
        <input type="range" class="suds-slider" id="ex-peak" min="0" max="10" value="8">
        <div class="suds-display" id="ex-peak-display" role="status" aria-live="polite">8</div>
      </div>
      <div class="field">
        <label class="field-label">${t('log.exposure.end')}</label>
        <input type="range" class="suds-slider" id="ex-end" min="0" max="10" value="5">
        <div class="suds-display" id="ex-end-display" role="status" aria-live="polite">5</div>
      </div>
      <div class="field">
        <label class="field-label">${t('log.exposure.cameTrue')}</label>
        <div class="radio-row">
          <label class="radio-pill"><input type="radio" name="cametrue" value="true"><span>${t('log.exposure.cameTrue.yes')}</span></label>
          <label class="radio-pill"><input type="radio" name="cametrue" value="false" checked><span>${t('log.exposure.cameTrue.no')}</span></label>
        </div>
      </div>
      <div class="field">
        <label class="field-label" for="ex-safety">${t('log.exposure.safety')}</label>
        <textarea id="ex-safety"></textarea>
      </div>
      <div class="field">
        <label class="field-label">${t('log.exposure.habituation')}</label>
        <div class="radio-row">
          <label class="radio-pill"><input type="radio" name="habitu" value="true"><span>Yes</span></label>
          <label class="radio-pill"><input type="radio" name="habitu" value="false" checked><span>No</span></label>
        </div>
      </div>
      <div class="field">
        <label class="field-label" for="ex-refl">${t('log.exposure.reflection')}</label>
        <textarea id="ex-refl"></textarea>
      </div>
      <button class="btn btn-primary btn-block" id="ex-save">${t('log.exposure.save')}</button>
    </div>
  `;
}

/* --- History --- */
function renderHistory() {
  const entries = store.getEntries();
  if (entries.length === 0) {
    return `<div class="card text-center"><p class="text-soft">${t('log.history.empty')}</p></div>`;
  }
  return `
    <div class="history-export">
      <button class="btn btn-secondary btn-block" id="export-json">${t('log.export.json')}</button>
      <button class="btn btn-secondary btn-block" id="export-md">${t('log.export.md')}</button>
      <button class="btn btn-ghost btn-block" id="import-btn">${t('log.export.import')}</button>
      <input type="file" id="import-file" accept="application/json" hidden>
    </div>
    <div class="history-list">
      ${entries.map(e => renderEntry(e)).join('')}
    </div>
  `;
}

function renderEntry(e) {
  const date = new Date(e.datetime);
  const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const typeLabels = {
    checkin: '✓ Check-in',
    thought: '🧠 Thought Record',
    exposure: '🪜 Exposure',
    practice: '🌿 Practice',
  };
  let body = '';
  if (e.type === 'checkin') {
    body = `<div class="entry-suds">SUDS ${num(e.suds)}/10</div>${e.note ? `<div class="entry-note">${escapeHtml(e.note)}</div>` : ''}`;
  } else if (e.type === 'thought') {
    body = `<div class="entry-suds">SUDS ${num(e.suds)}/10</div>${e.automaticThoughts ? `<div class="entry-excerpt">${escapeHtml(truncate(e.automaticThoughts, 100))}</div>` : ''}`;
  } else if (e.type === 'exposure') {
    body = `<div class="entry-suds">Peak ${num(e.peakSuds)}/10 → End ${num(e.endSuds)}/10</div>${e.catastrophicPrediction ? `<div class="entry-excerpt">"${escapeHtml(truncate(e.catastrophicPrediction, 80))}"</div>` : ''}`;
  } else if (e.type === 'practice') {
    body = `<div class="entry-excerpt">${escapeHtml(e.exercise || '')}${e.sudsBefore != null ? ` · ${num(e.sudsBefore)}→${num(e.sudsAfter)}` : ''}</div>`;
  }
  return `
    <div class="history-entry card">
      <div class="entry-header">
        <span class="entry-type">${typeLabels[e.type] || escapeHtml(e.type)}</span>
        <span class="entry-date">${dateStr} · ${timeStr}</span>
      </div>
      ${body}
      <button class="entry-delete" data-id="${escapeHtml(e.id)}" aria-label="${t('log.history.delete')}">${t('log.history.delete')}</button>
    </div>
  `;
}

/* --- Bind panel interactions --- */
function bindPanel(tab, ctx) {
  if (tab === 'quick') bindQuick(ctx);
  if (tab === 'thought') bindThought(ctx);
  if (tab === 'exposure') bindExposure(ctx);
  if (tab === 'history') bindHistory(ctx);
}

function bindSlider(id, displayId) {
  const slider = document.getElementById(id);
  const display = document.getElementById(displayId);
  if (slider && display) {
    slider.addEventListener('input', () => display.textContent = slider.value);
  }
}

function bindQuick(ctx) {
  bindSlider('quick-suds', 'quick-suds-display');
  document.getElementById('quick-save')?.addEventListener('click', () => {
    store.addEntry({
      type: 'checkin',
      suds: parseInt(document.getElementById('quick-suds').value, 10),
      note: document.getElementById('quick-note').value.trim(),
    });
    flashSaved('quick-saved');
    document.getElementById('quick-note').value = '';
  });
}

function bindThought(ctx) {
  bindSlider('th-suds', 'th-suds-display');
  document.getElementById('th-save')?.addEventListener('click', () => {
    store.addEntry({
      type: 'thought',
      suds: parseInt(document.getElementById('th-suds').value, 10),
      situation: val('th-situation'),
      automaticThoughts: val('th-auto'),
      physicalSensations: val('th-sens'),
      distortions: val('th-dist'),
      alternativeThought: val('th-alt'),
    });
    flashSavedThenRefresh(ctx);
  });
}

function bindExposure(ctx) {
  bindSlider('ex-ant', 'ex-ant-display');
  bindSlider('ex-peak', 'ex-peak-display');
  bindSlider('ex-end', 'ex-end-display');

  document.getElementById('ex-save')?.addEventListener('click', () => {
    const rungId = document.getElementById('ex-rung').value;
    const endSuds = parseInt(document.getElementById('ex-end').value, 10);
    store.addEntry({
      type: 'exposure',
      rungId,
      duration: val('ex-duration') ? parseInt(val('ex-duration'), 10) + ' min' : '',
      anticipatorySuds: parseInt(document.getElementById('ex-ant').value, 10),
      catastrophicPrediction: val('ex-pred'),
      peakSuds: parseInt(document.getElementById('ex-peak').value, 10),
      endSuds,
      predictionCameTrue: document.querySelector('input[name="cametrue"]:checked')?.value === 'true',
      safetyBehaviors: val('ex-safety'),
      habituation: document.querySelector('input[name="habitu"]:checked')?.value === 'true',
      reflection: val('ex-refl'),
    });
    // Also update the rung's current SUDS (append-only)
    store.updateRungSuds(rungId, endSuds);
    flashSavedThenRefresh(ctx);
  });
}

function bindHistory(ctx) {
  document.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm(t('log.history.confirmDelete'))) {
        store.deleteEntry(btn.dataset.id);
        ctx.refresh();
      }
    });
  });

  document.getElementById('export-json')?.addEventListener('click', () => {
    download('openair-backup-' + new Date().toISOString().slice(0, 10) + '.json',
             store.exportJSON(), 'application/json');
  });
  document.getElementById('export-md')?.addEventListener('click', () => {
    download('openair-journal-' + new Date().toISOString().slice(0, 10) + '.md',
             store.exportMarkdown(), 'text/markdown');
  });
  document.getElementById('import-btn')?.addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  document.getElementById('import-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        store.importJSON(reader.result);
        alert('✓ Imported.');
        ctx.refresh();
      } catch (err) {
        alert('Could not import: ' + err.message);
      }
    };
    reader.readAsText(file);
  });
}

/* --- Helpers --- */
function val(id) { return document.getElementById(id)?.value.trim() || ''; }

// Coerce to a safe integer for display (defends against imported string values)
function num(n) { return Number.isFinite(Number(n)) ? Number(n) : ''; }

function rungLabel(id) {
  const labels = {
    r1: 'Watching elevator videos',
    r2: 'Subway — off-peak',
    r3: 'Large aircraft — short flights',
    r4: 'Subway — rush hour',
    r5: 'Small aircraft',
    r6: 'Riding an elevator',
  };
  return labels[id] || id;
}

function truncate(s, n) { return s.length > n ? s.slice(0, n) + '…' : s; }

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function flashSaved(id) {
  const el = document.getElementById(id);
  if (el) { el.hidden = false; setTimeout(() => el.hidden = true, 1500); }
}

function flashSavedThenRefresh(ctx) {
  // Brief confirmation then refresh
  setTimeout(() => ctx.refresh(), 400);
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const LOG_STYLES = `
.log-tabs {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-5);
  background: var(--color-surface);
  border-radius: var(--radius-full);
  padding: 4px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.log-tab {
  flex: 1;
  white-space: nowrap;
  border: none;
  background: transparent;
  color: var(--color-text-soft);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  -webkit-tap-highlight-color: transparent;
}
.log-tab.active {
  background: var(--color-bg-elevated);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

.suds-display {
  text-align: center;
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  color: var(--color-primary-deep);
  margin-top: var(--space-3);
}

.form-saved {
  text-align: center;
  color: var(--color-primary);
  font-size: var(--text-xl);
  margin-top: var(--space-3);
}

.radio-row {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.radio-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  cursor: pointer;
  font-size: var(--text-sm);
}
.radio-pill input { margin: 0; }

.history-export {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.history-entry {
  position: relative;
  padding-right: 60px;
}
.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-2);
}
.entry-type {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text);
}
.entry-date {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}
.entry-suds {
  font-family: var(--font-serif);
  color: var(--color-primary-deep);
  font-size: var(--text-sm);
  margin-bottom: var(--space-1);
}
.entry-excerpt {
  font-size: var(--text-sm);
  color: var(--color-text-soft);
  font-style: italic;
}
.entry-delete {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: none;
  border: none;
  color: var(--color-text-faint);
  font-size: var(--text-xs);
  cursor: pointer;
  text-decoration: underline;
  -webkit-tap-highlight-color: transparent;
}
.entry-delete:hover { color: var(--color-danger); }
`;
