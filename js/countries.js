/* ===========================================================================
   countries.js — Country configuration
   Each country defines its emergency phone numbers and the language that
   best matches it. The user's country and language are SEPARATE settings:
   country picks the numbers, language picks the UI text. An English speaker
   living in France can have country=fr + language=en.
   =========================================================================== */

export const COUNTRIES = {
  se: {
    code: 'se',
    flag: '🇸🇪',
    advice:   { number: '1177',   labelKey: 'crisis.advice.label' },
    emergency:{ number: '112',    labelKey: 'crisis.emergency.label' },
    suggestedLanguage: 'sv',
  },
  gb: {
    code: 'gb',
    flag: '🇬🇧',
    advice:   { number: '111',    labelKey: 'crisis.advice.label' },
    emergency:{ number: '999',    labelKey: 'crisis.emergency.label' },
    suggestedLanguage: 'en',
  },
  us: {
    code: 'us',
    flag: '🇺🇸',
    advice:   { number: '988',    labelKey: 'crisis.advice.label' },
    emergency:{ number: '911',    labelKey: 'crisis.emergency.label' },
    suggestedLanguage: 'en',
  },
  fr: {
    code: 'fr',
    flag: '🇫🇷',
    advice:   { number: '15',     labelKey: 'crisis.advice.label' },
    emergency:{ number: '112',    labelKey: 'crisis.emergency.label' },
    suggestedLanguage: 'fr',
  },
  de: {
    code: 'de',
    flag: '🇩🇪',
    advice:   { number: '116117', labelKey: 'crisis.advice.label' },
    emergency:{ number: '112',    labelKey: 'crisis.emergency.label' },
    suggestedLanguage: 'de',
  },
};

export const COUNTRY_ORDER = ['se', 'gb', 'us', 'fr', 'de'];

/* Map a BCP-47 locale string (e.g. "en-GB", "sv-SE", "fr-FR") to a country
   code. Used for first-run auto-detection. Falls back to null if unknown. */
export function localeToCountry(locale) {
  if (!locale) return null;
  const region = locale.toLowerCase().split(/[-_]/).pop();
  const map = {
    se: 'se', sv: 'se',
    gb: 'gb', uk: 'gb',
    us: 'us',
    fr: 'fr',
    de: 'de', at: 'de', ch: 'de', // DACH → de numbers are the same
  };
  return map[region] || null;
}

export function getCountry(code) {
  return COUNTRIES[code] || COUNTRIES.se;
}
