/* ===========================================================================
   overlay.js — Shared overlay focus management
   Implements the WAI-ARIA dialog pattern:
   - On open: move focus into the panel (the close button)
   - Trap Tab/Shift+Tab within the overlay
   - Close on Escape
   - On close: return focus to the element that opened it
   =========================================================================== */

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'textarea:not([disabled])', 'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/* Open an overlay element with focus management.
   overlay   = the .overlay element
   trigger   = the element that was clicked (for focus return)
*/
export function openOverlay(overlay, trigger) {
  overlay.hidden = false;
  overlay.dataset.managed = 'true';

  // Remember the trigger so we can return focus on close
  if (trigger) overlay._trigger = trigger;

  // Move focus into the panel — prefer the close button, then the panel itself
  const focusTarget = overlay.querySelector('[data-close], .overlay-header button, [tabindex]')
    || overlay.querySelector('.overlay-panel');
  if (focusTarget) {
    setTimeout(() => focusTarget.focus(), 30);
  }

  // Bind handlers once, marked via dataset
  if (!overlay._focusBound) {
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeOverlay(overlay);
      }
      if (e.key === 'Tab') {
        trapTab(overlay, e);
      }
    });
    overlay._focusBound = true;
  }
}

/* Close an overlay and return focus to the trigger */
export function closeOverlay(overlay) {
  overlay.hidden = true;
  if (overlay._trigger && typeof overlay._trigger.focus === 'function') {
    overlay._trigger.focus();
    overlay._trigger = null;
  }
}

/* Dismiss a dynamically-created overlay (remove from DOM) and return focus */
export function dismissOverlay(overlay) {
  if (overlay._trigger && typeof overlay._trigger.focus === 'function') {
    overlay._trigger.focus();
    overlay._trigger = null;
  }
  overlay.remove();
}

/* Mount + open a dynamically-created overlay, then wire its standard close
   paths (all [data-close] buttons + backdrop click) through dismissOverlay.
   onDismiss (optional) runs after the overlay is removed. */
export function mountOverlay(overlay, trigger, onDismiss) {
  if (trigger) overlay._trigger = trigger;
  document.body.appendChild(overlay);
  openOverlay(overlay);

  overlay.querySelectorAll('[data-close]').forEach(b =>
    b.addEventListener('click', () => {
      dismissOverlay(overlay);
      if (onDismiss) onDismiss();
    })
  );
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      dismissOverlay(overlay);
      if (onDismiss) onDismiss();
    }
  });
}

/* Trap Tab cycling within the overlay */
function trapTab(overlay, e) {
  const focusable = Array.from(overlay.querySelectorAll(FOCUSABLE))
    .filter(el => el.offsetParent !== null || el === document.activeElement);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
