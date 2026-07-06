/* ===========================================================================
   store.js — Local data layer
   All data lives in localStorage. No server, no cloud, no third-party calls.
   Private and fully functional offline (critical for elevators / planes).
   =========================================================================== */

const STORAGE_KEY = 'openair.v1';

const DEFAULT_DATA = {
  // User-modifiable settings
  settings: {
    language: 'en',          // 'en' | 'sv' | 'fr' | 'de'
    country: 'se',           // 'se' | 'gb' | 'us' | 'fr' | 'de'
    countryDetected: false,  // true once first-run auto-detect has run
    contrast: 'normal',      // 'normal' | 'high'
    textSize: 'normal',      // 'normal' | 'large'
    reducedMotion: false,    // forced reduced motion
  },

  // Quick SUDS check-ins, thought records, and exposure logs
  // Each entry: { id, type, datetime, suds, ...fields }
  // type: 'checkin' | 'thought' | 'exposure' | 'practice'
  entries: [],

  // The exposure ladder. Pre-seeded with the user's baseline SUDS table.
  // Each rung: { id, label_en, label_sv, baselineSuds, currentSuds, history: [{date, suds}] }
  // SUDS history is append-only — never overwrite (AGENTS.md rule).
  ladder: [
    { id: 'r1', baselineSuds: 3, currentSuds: 3, history: [{ date: '2026-07-06', suds: 3 }] },
    { id: 'r2', baselineSuds: 5, currentSuds: 5, history: [{ date: '2026-07-06', suds: 5 }] },
    { id: 'r3', baselineSuds: 6, currentSuds: 6, history: [{ date: '2026-07-06', suds: 6 }] },
    { id: 'r4', baselineSuds: 8, currentSuds: 8, history: [{ date: '2026-07-06', suds: 8 }] },
    { id: 'r5', baselineSuds: 9, currentSuds: 9, history: [{ date: '2026-07-06', suds: 9 }] },
    { id: 'r6', baselineSuds: 10, currentSuds: 10, history: [{ date: '2026-07-06', suds: 10 }] },
  ],

  // Big wins — neurological "re-wiring" moments
  milestones: [],

  // Schema version for future migrations
  _version: 1,
};

/* --- Internal load/save --- */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    // Shallow-merge defaults so new fields appear without wiping data
    return {
      ...structuredClone(DEFAULT_DATA),
      ...parsed,
      settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
    };
  } catch (e) {
    console.error('Open Air: failed to load data, resetting.', e);
    return structuredClone(DEFAULT_DATA);
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Open Air: failed to save data.', e);
  }
}

// Singleton state, loaded once
let state = load();

/* --- Public API --- */
export const store = {
  /* Settings */
  getSettings() {
    return { ...state.settings };
  },

  updateSettings(partial) {
    state.settings = { ...state.settings, ...partial };
    save(state);
    return state.settings;
  },

  /* Entries (check-ins, thought records, exposure logs, practice sessions) */
  getEntries() {
    return [...state.entries].sort((a, b) =>
      new Date(b.datetime) - new Date(a.datetime)
    );
  },

  getEntriesByType(type) {
    return state.entries.filter(e => e.type === type)
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  },

  addEntry(entry) {
    const record = {
      id: 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      datetime: new Date().toISOString(),
      ...entry,
    };
    state.entries.push(record);
    save(state);
    return record;
  },

  deleteEntry(id) {
    state.entries = state.entries.filter(e => e.id !== id);
    save(state);
  },

  /* Ladder (append-only SUDS history) */
  getLadder() {
    return state.ladder.map(r => ({ ...r, history: [...r.history] }));
  },

  getRung(id) {
    const r = state.ladder.find(r => r.id === id);
    return r ? { ...r, history: [...r.history] } : null;
  },

  updateRungSuds(id, newSuds) {
    const rung = state.ladder.find(r => r.id === id);
    if (!rung) return null;
    // Append-only: never overwrite history
    rung.currentSuds = newSuds;
    rung.history.push({ date: new Date().toISOString().slice(0, 10), suds: newSuds });
    save(state);
    return { ...rung, history: [...rung.history] };
  },

  /* Milestones */
  getMilestones() {
    return [...state.milestones].sort((a, b) =>
      new Date(b.datetime) - new Date(a.datetime)
    );
  },

  addMilestone(milestone) {
    const record = {
      id: 'm_' + Date.now(),
      datetime: new Date().toISOString(),
      ...milestone,
    };
    state.milestones.push(record);
    save(state);
    return record;
  },

  /* Backup & restore */
  exportJSON() {
    return JSON.stringify(state, null, 2);
  },

  importJSON(jsonString) {
    const parsed = JSON.parse(jsonString);
    state = {
      ...structuredClone(DEFAULT_DATA),
      ...parsed,
      settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
    };
    save(state);
    return state;
  },

  /* Export entries as markdown — matches the repo's journal structure
     so the app feeds the AI-reviewed markdown workflow. */
  exportMarkdown() {
    const entries = store.getEntries();
    if (entries.length === 0) {
      return '_No entries yet._';
    }

    // Group by date
    const byDate = {};
    for (const e of entries) {
      const date = e.datetime.slice(0, 10);
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(e);
    }

    const dates = Object.keys(byDate).sort().reverse();
    let out = '';

    for (const date of dates) {
      out += `# ${date}\n\n`;
      const dayEntries = byDate[date].sort((a, b) =>
        new Date(a.datetime) - new Date(b.datetime)
      );
      for (const e of dayEntries) {
        const time = new Date(e.datetime).toTimeString().slice(0, 5);
        out += `## ${time} — ${markdownTypeLabel(e.type)}\n\n`;
        out += renderEntryMarkdown(e);
        out += '\n---\n\n';
      }
    }
    return out;
  },
};

function markdownTypeLabel(type) {
  const labels = {
    checkin: 'Check-in',
    thought: 'Thought Record',
    exposure: 'Exposure Log',
    practice: 'Practice Session',
  };
  return labels[type] || type;
}

function renderEntryMarkdown(e) {
  let out = '';
  const line = (label, val) => val ? `**${label}:** ${val}\n` : '';
  const block = (label, val) => val ? `**${label}:**\n\n${val}\n\n` : '';

  if (e.type === 'checkin') {
    out += line('SUDS', e.suds != null ? `${e.suds}/10` : '');
    out += line('Note', e.note);
  } else if (e.type === 'thought') {
    out += line('SUDS', e.suds != null ? `${e.suds}/10` : '');
    out += block('Situation', e.situation);
    out += block('Automatic Thoughts', e.automaticThoughts);
    out += block('Physical Sensations', e.physicalSensations);
    out += block('Cognitive Distortions', e.distortions);
    out += block('Alternative Thought', e.alternativeThought);
  } else if (e.type === 'exposure') {
    out += line('Rung', e.rungId || '');
    out += line('Duration', e.duration || '');
    out += line('Anticipatory SUDS', e.anticipatorySuds != null ? `${e.anticipatorySuds}/10` : '');
    out += block('Catastrophic Prediction', e.catastrophicPrediction);
    out += line('Peak SUDS', e.peakSuds != null ? `${e.peakSuds}/10` : '');
    out += line('End SUDS', e.endSuds != null ? `${e.endSuds}/10` : '');
    out += line('Prediction came true?', e.predictionCameTrue === true ? 'No — the catastrophe did not happen' : e.predictionCameTrue === false ? 'No' : '');
    out += block('Safety Behaviors Used', e.safetyBehaviors);
    out += line('Habituation (anxiety dropped?)', e.habituation === true ? 'Yes — anxiety decreased while staying' : e.habituation === false ? 'No' : '');
    out += block('Reflection', e.reflection);
  } else if (e.type === 'practice') {
    out += line('Exercise', e.exercise || '');
    out += line('Duration', e.duration || '');
    out += line('SUDS before', e.sudsBefore != null ? `${e.sudsBefore}/10` : '');
    out += line('SUDS after', e.sudsAfter != null ? `${e.sudsAfter}/10` : '');
    out += block('Note', e.note);
  }
  return out;
}
