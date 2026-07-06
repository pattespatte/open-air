/* ===========================================================================
   app.js — Main controller
   - Loads settings → applies them to <html>
   - Renders the shell: crisis bar, view mount, bottom nav
   - Simple hash-based router: #now / #practice / #log / #path
   =========================================================================== */

import { store } from './store.js';
import { setLanguage, getLanguage, t } from './i18n.js';
import { renderNow } from './views/now.js';
import { renderPractice } from './views/practice.js';
import { renderLog } from './views/log.js';
import { renderPath } from './views/path.js';

const VIEWS = ['now', 'practice', 'log', 'path'];
const viewModules = { now: renderNow, practice: renderPractice, log: renderLog, path: renderPath };

/* --- Apply settings to <html> data-attributes for CSS --- */
function applySettings() {
  const s = store.getSettings();
  setLanguage(s.language);
  document.documentElement.lang = s.language;
  document.documentElement.dataset.contrast = s.contrast;
  document.documentElement.dataset.textSize = s.textSize;
}

/* --- Render the crisis bar (shown on every view) --- */
function renderCrisisBar() {
  return `
    <div class="crisis-bar" role="complementary" aria-label="${t('crisis.ifNeeded')}">
      <span>${t('crisis.ifNeeded')}</span>
      <a href="tel:1177" aria-label="${t('crisis.1177.label')} ${t('crisis.1177')}">
        <span class="crisis-num">${t('crisis.1177')}</span> <span>${t('crisis.1177.label')}</span>
      </a>
      <a href="tel:112" aria-label="${t('crisis.112.label')} ${t('crisis.112')}">
        <span class="crisis-num">${t('crisis.112')}</span> <span>${t('crisis.112.label')}</span>
      </a>
    </div>`;
}

/* --- Render the bottom navigation --- */
function renderNav(activeView) {
  const items = [
    { id: 'now',      icon: '🫧', label: t('nav.now') },
    { id: 'practice', icon: '🌿', label: t('nav.practice') },
    { id: 'log',      icon: '📝', label: t('nav.log') },
    { id: 'path',     icon: '🪜', label: t('nav.path') },
  ];
  return `
    <nav class="bottom-nav" role="navigation" aria-label="Primary">
      ${items.map(item => `
        <button class="nav-${item.id} ${item.id === activeView ? 'active' : ''}"
                data-view="${item.id}"
                aria-label="${item.label}"
                aria-current="${item.id === activeView ? 'page' : 'false'}">
          <span class="nav-icon" aria-hidden="true">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </button>
      `).join('')}
    </nav>`;
}

/* --- Render the settings popover --- */
function renderSettings() {
  const s = store.getSettings();
  return `
    <div id="settings-overlay" class="overlay" hidden>
      <div class="overlay-panel card" role="dialog" aria-labelledby="settings-title" aria-modal="true">
        <div class="overlay-header">
          <h2 id="settings-title">${t('settings.title')}</h2>
          <button class="btn btn-ghost" data-action="close-settings" aria-label="${t('common.close')}">✕</button>
        </div>
        <div class="settings-row">
          <span>${t('settings.language')}</span>
          <div class="toggle-group">
            <button class="chip ${s.language === 'en' ? 'chip-active' : ''}" data-lang="en">English</button>
            <button class="chip ${s.language === 'sv' ? 'chip-active' : ''}" data-lang="sv">Svenska</button>
          </div>
        </div>
        <div class="settings-row">
          <span>${t('settings.contrast')}</span>
          <label class="switch">
            <input type="checkbox" id="set-contrast" ${s.contrast === 'high' ? 'checked' : ''}>
            <span class="switch-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <span>${t('settings.textSize')}</span>
          <label class="switch">
            <input type="checkbox" id="set-textsize" ${s.textSize === 'large' ? 'checked' : ''}>
            <span class="switch-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <span>${t('settings.reducedMotion')}</span>
          <label class="switch">
            <input type="checkbox" id="set-motion" ${s.reducedMotion ? 'checked' : ''}>
            <span class="switch-track"></span>
          </label>
        </div>
      </div>
    </div>`;
}

/* --- Render the help overlay --- */
function renderHelp() {
  return `
    <div id="help-overlay" class="overlay" hidden>
      <div class="overlay-panel card help-panel" role="dialog" aria-labelledby="help-title" aria-modal="true">
        <div class="overlay-header">
          <h2 id="help-title">${t('help.title')}</h2>
          <button class="btn btn-ghost" data-action="close-help" aria-label="${t('help.close')}">✕</button>
        </div>
        <div class="help-body">
          <div class="help-section help-callout">
            <p>${t('help.core.body')}</p>
          </div>

          <h3>${t('help.now')}</h3>
          <p>${t('help.now.body').replace(/\n\n/g, '</p><p>')}</p>

          <h3>${t('help.practice')}</h3>
          <p>${t('help.practice.body').replace(/\n\n/g, '</p><p>')}</p>

          <h3>${t('help.log')}</h3>
          <p>${t('help.log.body').replace(/\n\n/g, '</p><p>')}</p>

          <h3>${t('help.path')}</h3>
          <p>${t('help.path.body')}</p>

          <h3>${t('help.rhythm')}</h3>
          <ul class="help-rhythm">
            <li>${t('help.rhythm.daily')}</li>
            <li>${t('help.rhythm.checkin')}</li>
            <li>${t('help.rhythm.thought')}</li>
            <li>${t('help.rhythm.path')}</li>
            <li>${t('help.rhythm.now')}</li>
          </ul>

          <h3>${t('help.remember')}</h3>
          <ol class="help-remember">
            <li>${t('help.remember.1')}</li>
            <li>${t('help.remember.2')}</li>
            <li>${t('help.remember.3')}</li>
          </ol>

          <p class="help-boundary">${t('help.boundary')}</p>
        </div>
      </div>
    </div>`;
}

/* --- The shell --- */
function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <main>
      <div id="crisis-bar-mount"></div>
      <div class="top-actions">
        <button class="top-action" data-action="open-help" aria-label="${t('help.title')}">
          <span aria-hidden="true">?</span>
          <span class="top-action-label">${t('help.open')}</span>
        </button>
        <button class="top-action" data-action="open-settings" aria-label="${t('settings.title')}">
          <span aria-hidden="true">⚙</span>
          <span class="top-action-label">${t('settings.title')}</span>
        </button>
      </div>
      <div id="view-mount"></div>
      ${renderSettings()}
      ${renderHelp()}
    </main>
    <div id="nav-mount"></div>
  `;
  document.getElementById('crisis-bar-mount').innerHTML = renderCrisisBar();
}

/* --- Render a view into the mount point --- */
function renderView(view) {
  const mount = document.getElementById('view-mount');
  // Wrap in a .view for the fade-in animation
  mount.innerHTML = `<div class="view" data-view="${view}"></div>`;
  const viewEl = mount.querySelector('.view');
  const renderer = viewModules[view];
  if (renderer) {
    renderer(viewEl, { navigate, refresh });
  }
  document.getElementById('nav-mount').innerHTML = renderNav(view);
  window.scrollTo(0, 0);
}

/* --- Re-render everything (used after settings changes) --- */
function refresh() {
  applySettings();
  renderShell();
  const view = currentView();
  renderView(view);
  bindEvents();
}

let _currentView = 'now';
function currentView() { return _currentView; }

/* --- Navigation --- */
function navigate(view) {
  if (!VIEWS.includes(view)) view = 'now';
  _currentView = view;
  location.hash = view;
  applySettings(); // language may have changed
  renderShell();
  renderView(view);
  bindEvents();
}

/* --- Event binding (re-bound after each shell render) --- */
function bindEvents() {
  // Nav taps
  document.querySelectorAll('.bottom-nav button').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.view));
  });

  // Settings open/close
  document.querySelector('[data-action="open-settings"]')?.addEventListener('click', () => {
    document.getElementById('settings-overlay').hidden = false;
  });
  document.querySelector('[data-action="close-settings"]')?.addEventListener('click', () => {
    document.getElementById('settings-overlay').hidden = true;
  });
  document.getElementById('settings-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'settings-overlay') e.target.hidden = true;
  });

  // Help open/close
  document.querySelector('[data-action="open-help"]')?.addEventListener('click', () => {
    document.getElementById('help-overlay').hidden = false;
  });
  document.querySelector('[data-action="close-help"]')?.addEventListener('click', () => {
    document.getElementById('help-overlay').hidden = true;
  });
  document.getElementById('help-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'help-overlay') e.target.hidden = true;
  });

  // Language chips
  document.querySelectorAll('.chip[data-lang]').forEach(chip => {
    chip.addEventListener('click', () => {
      store.updateSettings({ language: chip.dataset.lang });
      refresh();
    });
  });

  // Toggles
  const contrast = document.getElementById('set-contrast');
  contrast?.addEventListener('change', () => {
    store.updateSettings({ contrast: contrast.checked ? 'high' : 'normal' });
    refresh();
  });
  const textSize = document.getElementById('set-textsize');
  textSize?.addEventListener('change', () => {
    store.updateSettings({ textSize: textSize.checked ? 'large' : 'normal' });
    refresh();
  });
  const motion = document.getElementById('set-motion');
  motion?.addEventListener('change', () => {
    store.updateSettings({ reducedMotion: motion.checked });
    refresh();
  });
}

/* --- Init --- */
function init() {
  applySettings();
  const hash = location.hash.replace('#', '');
  _currentView = VIEWS.includes(hash) ? hash : 'now';
  renderShell();
  renderView(_currentView);
  bindEvents();
}

document.addEventListener('DOMContentLoaded', init);

// Service worker registration (offline support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('Open Air: service worker not registered', err);
    });
  });
}
