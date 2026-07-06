/* ===========================================================================
   i18n.js — Bilingual EN/SV translations + helpers
   Simple keyed dictionary. Toggled in settings; persisted.
   =========================================================================== */

const TRANSLATIONS = {
  en: {
    // App
    'app.name': 'Open Air',
    'app.tagline': 'A quiet space for the work',

    // Nav
    'nav.now': 'Now',
    'nav.practice': 'Practice',
    'nav.log': 'Log',
    'nav.path': 'Path',

    // Crisis bar
    'crisis.ifNeeded': 'If you need help:',
    'crisis.1177': '1177',
    'crisis.1177.label': 'Advice',
    'crisis.112': '112',
    'crisis.112.label': 'Emergency',

    // NOW mode
    'now.title': 'You are safe in this moment',
    'now.subtitle': 'Whatever you are feeling will pass — it always does.',
    'now.breathe': 'Breathe',
    'now.breathe.in': 'Breathe in',
    'now.breathe.hold': 'Hold',
    'now.breathe.out': 'Let go',
    'now.breathe.slow': 'Slow and steady',
    'now.startBreathing': 'Begin breathing',
    'now.stopBreathing': 'Stop',
    'now.grounding': '5-4-3-2-1 Grounding',
    'now.grounding.subtitle': 'Bring your attention to what is here, now',
    'now.grounding.see': 'Name 5 things you can see',
    'now.grounding.touch': 'Name 4 things you can feel',
    'now.grounding.hear': 'Name 3 sounds you can hear',
    'now.grounding.smell': 'Name 2 things you can smell',
    'now.grounding.taste': 'Name 1 thing you can taste',
    'now.grounding.next': 'Next',
    'now.grounding.done': 'You are here. In this room. In this moment.',
    'now.grounding.restart': 'Begin again',
    'now.reassurance': 'Reassurance',
    'now.reassurance.body': 'This is a false alarm. Your body is reacting to a feeling, not a danger.\n\nIt will pass — it always does. You have survived every single one of these.\n\nYou do not need to fight it. Just let it move through you, like weather.',

    // PRACTICE mode
    'practice.title': 'Practice',
    'practice.subtitle': 'Build the skills so they are ready when you need them',
    'practice.breathing': 'Breathing exercises',
    'practice.breathing.478': '4-7-8 Breathing',
    'practice.breathing.478.desc': 'Calming. Inhale 4, hold 7, exhale 8.',
    'practice.breathing.box': 'Box Breathing',
    'practice.breathing.box.desc': 'Steadying. 4-4-4-4.',
    'practice.breathing.coherent': 'Coherent Breathing',
    'practice.breathing.coherent.desc': 'Balancing. 5 in, 5 out.',
    'practice.choose': 'Choose an exercise',
    'practice.duration': 'Duration',
    'practice.2min': '2 min',
    'practice.5min': '5 min',
    'practice.10min': '10 min',
    'practice.begin': 'Begin',
    'practice.grounding': '5-4-3-2-1 Grounding',
    'practice.grounding.desc': 'A walkthrough to settle into the present.',
    'practice.havening': 'Havening',
    'practice.havening.desc': 'A self-touch practice to deactivate distress.',
    'practice.havening.body': 'Havening uses slow, soothing touch on the upper arms, hands, or face to shift the brain toward calm.\n\n**The basic practice:**\n\n1. Bring to mind something that feels gently reassuring — a place, a person, a feeling of safety.\n2. With your palms, slowly stroke down your upper arms, from shoulders to elbows, left and right together. About once per second.\n3. Keep the reassuring image in mind. Notice the calm settling in.\n4. Continue for 2–5 minutes. There is no rush.\n\nYou can also rub your palms together, or gently stroke your forehead and temples.\n\nIt can feel strange at first. That is fine. The effect is often subtle — a quiet shift, not a dramatic one.',
    'practice.preSuds': 'How do you feel right now? (0–10)',
    'practice.postSuds': 'And now? (0–10)',
    'practice.save': 'Save session',
    'practice.saved': 'Saved. You showed up today.',
    'practice.count': 'Sessions',
    'practice.count.desc': 'A quiet record of practice. Not a streak — just presence.',

    // LOG mode
    'log.title': 'Log',
    'log.subtitle': 'Capture what happened. Awareness comes first.',
    'log.quick': 'Quick check-in',
    'log.quick.suds': 'How intense right now? (0–10)',
    'log.quick.note': 'A word, if you want (optional)',
    'log.quick.save': 'Save check-in',
    'log.thought': 'Thought Record',
    'log.thought.subtitle': 'From the CBT structure: see the thought, then question it',
    'log.thought.situation': 'Situation — what happened?',
    'log.thought.auto': 'Automatic thoughts — what was the "catastrophe" thought?',
    'log.thought.emotions': 'Emotions & SUDS (0–10)',
    'log.thought.sensations': 'Physical sensations — what did the body feel?',
    'log.thought.distortions': 'Cognitive distortions (e.g. catastrophizing, overgeneralizing)',
    'log.thought.alternative': 'Alternative thought — a more balanced view?',
    'log.thought.save': 'Save thought record',
    'log.exposure': 'Exposure Log',
    'log.exposure.subtitle': 'The ERP workflow: prediction, peak, and what actually happened',
    'log.exposure.rung': 'Which rung of the ladder?',
    'log.exposure.duration': 'Duration (minutes)',
    'log.exposure.anticipatory': 'Anticipatory SUDS (before)',
    'log.exposure.prediction': 'Catastrophic prediction — what did you fear would happen?',
    'log.exposure.peak': 'Peak SUDS (highest point)',
    'log.exposure.end': 'End SUDS (when you finished)',
    'log.exposure.cameTrue': 'Did the prediction come true?',
    'log.exposure.cameTrue.no': 'No — the catastrophe did not happen',
    'log.exposure.safety': 'Safety behaviors used (e.g. holding the wall, watching the floor)',
    'log.exposure.habituation': 'Did the anxiety drop while you stayed?',
    'log.exposure.reflection': 'Reflection — what did you learn?',
    'log.exposure.save': 'Save exposure log',
    'log.history': 'History',
    'log.history.empty': 'No entries yet. Your first one will appear here.',
    'log.history.delete': 'Delete',
    'log.history.confirmDelete': 'Delete this entry? This cannot be undone.',
    'log.export': 'Export & Backup',
    'log.export.json': 'Download backup (JSON)',
    'log.export.md': 'Export as Markdown',
    'log.export.import': 'Import backup',

    // PATH mode
    'path.title': 'Your path',
    'path.subtitle': 'Where you are, and the next gentle step',
    'path.currentFocus': 'Current focus',
    'path.nextStep': 'A micro-step you could try',
    'path.nextStepLabel': 'Next step',
    'path.editSuds': 'Update SUDS',
    'path.history': 'SUDS history (append-only)',
    'path.milestones': 'Milestones',
    'path.milestones.empty': 'No milestones yet. Big moments will gather here.',
    'path.milestones.add': 'Add a milestone',
    'path.milestones.title': 'Title',
    'path.milestones.note': 'What happened?',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.contrast': 'High contrast',
    'settings.textSize': 'Larger text',
    'settings.reducedMotion': 'Reduce motion',

    // Misc
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.optional': 'optional',
  },

  sv: {
    // App
    'app.name': 'Öppen Luft',
    'app.tagline': 'En lugn plats för arbetet',

    // Nav
    'nav.now': 'Nu',
    'nav.practice': 'Öva',
    'nav.log': 'Logg',
    'nav.path': 'Väg',

    // Crisis bar
    'crisis.ifNeeded': 'Behöver du hjälp:',
    'crisis.1177': '1177',
    'crisis.1177.label': 'Rådgivning',
    'crisis.112': '112',
    'crisis.112.label': 'Akut',

    // NOW mode
    'now.title': 'Du är trygg i detta ögonblick',
    'now.subtitle': 'Det du känner kommer att gå över — det gör det alltid.',
    'now.breathe': 'Andas',
    'now.breathe.in': 'Andas in',
    'now.breathe.hold': 'Håll',
    'now.breathe.out': 'Släpp',
    'now.breathe.slow': 'Långsamt och jämnt',
    'now.startBreathing': 'Börja andas',
    'now.stopBreathing': 'Stopp',
    'now.grounding': '5-4-3-2-1 Förankring',
    'now.grounding.subtitle': 'Rikta uppmärksamheten mot det som finns här, nu',
    'now.grounding.see': 'Nämn 5 saker du kan se',
    'now.grounding.touch': 'Nämn 4 saker du kan känna',
    'now.grounding.hear': 'Nämn 3 ljud du kan höra',
    'now.grounding.smell': 'Nämn 2 saker du kan lukta på',
    'now.grounding.taste': 'Nämn 1 sak du kan smaka',
    'now.grounding.next': 'Nästa',
    'now.grounding.done': 'Du är här. I detta rum. I detta ögonblick.',
    'now.grounding.restart': 'Börja om',
    'now.reassurance': 'Tröst',
    'now.reassurance.body': 'Detta är ett falskt larm. Din kropp reagerar på en känsla, inte på en fara.\n\nDet kommer gå över — det gör det alltid. Du har överlevt varenda en av dessa.\n\nDu behöver inte kämpa mot det. Låt det bara röra sig genom dig, som väder.',

    // PRACTICE mode
    'practice.title': 'Öva',
    'practice.subtitle': 'Bygg färdigheterna så de är redo när du behöver dem',
    'practice.breathing': 'Andningsövningar',
    'practice.breathing.478': '4-7-8 Andning',
    'practice.breathing.478.desc': 'Lugnande. In 4, håll 7, ut 8.',
    'practice.breathing.box': 'Fyrkantsandning',
    'practice.breathing.box.desc': 'Stadig. 4-4-4-4.',
    'practice.breathing.coherent': 'Koherent andning',
    'practice.breathing.coherent.desc': 'Balanserande. 5 in, 5 ut.',
    'practice.choose': 'Välj en övning',
    'practice.duration': 'Längd',
    'practice.2min': '2 min',
    'practice.5min': '5 min',
    'practice.10min': '10 min',
    'practice.begin': 'Börja',
    'practice.grounding': '5-4-3-2-1 Förankring',
    'practice.grounding.desc': 'En vägledning för att landa i nuet.',
    'practice.havening': 'Havening',
    'practice.havening.desc': 'En självberöringsövning för att avaktivera oro.',
    'practice.havening.body': 'Havening använder långsam, lugnande beröring på överarmarna, händerna eller ansiktet för att föra hjärnan mot ro.\n\n**Grundövningen:**\n\n1. Tänk på något som känns lugnande — en plats, en person, en känsla av trygghet.\n2. Med handflatorna, stryk långsamt längs överarmarna, från axlar till armbågar, vänster och höger samtidigt. Ungefär en gång i sekunden.\n3. Håll den lugnande bilden i sinnet. Märk hur roen sänker sig.\n4. Fortsätt i 2–5 minuter. Det är ingen brådska.\n\nDu kan också gnida handflatorna mot varandra, eller försiktigt stryka pannan och tinningarna.\n\nDet kan kännas konstigt först. Det är okej. Effekten är ofta subtil — en tyst förskjutning, inte en dramatisk.',
    'practice.preSuds': 'Hur känner du dig just nu? (0–10)',
    'practice.postSuds': 'Och nu? (0–10)',
    'practice.save': 'Spara session',
    'practice.saved': 'Sparat. Du dök upp idag.',
    'practice.count': 'Sessioner',
    'practice.count.desc': 'En tyst anteckning om övning. Ingen svit — bara närvaro.',

    // LOG mode
    'log.title': 'Logg',
    'log.subtitle': 'Fånga vad som hände. Medvetenhet kommer först.',
    'log.quick': 'Snabb check-in',
    'log.quick.suds': 'Hur intensivt just nu? (0–10)',
    'log.quick.note': 'Ett ord, om du vill (valfritt)',
    'log.quick.save': 'Spara check-in',
    'log.thought': 'Tankeanteckning',
    'log.thought.subtitle': 'Från CBT-strukturen: se tanken, ifrågasätt den',
    'log.thought.situation': 'Situation — vad hände?',
    'log.thought.auto': 'Automatiska tankar — vad var "katastroftanken"?',
    'log.thought.emotions': 'Känslor & SUDS (0–10)',
    'log.thought.sensations': 'Fysiska sensationer — vad kände kroppen?',
    'log.thought.distortions': 'Kognitiva förvrängningar (t.ex. katastrofertänkande, övergeneralisering)',
    'log.thought.alternative': 'Alternativ tanke — en mer balanserad vy?',
    'log.thought.save': 'Spara tankeanteckning',
    'log.exposure': 'Exponeringslogg',
    'log.exposure.subtitle': 'ERP-arbetsflödet: förutsägelse, topp, och vad som faktiskt hände',
    'log.exposure.rung': 'Vilken pinne på steget?',
    'log.exposure.duration': 'Längd (minuter)',
    'log.exposure.anticipatory': 'Anticipatorisk SUDS (före)',
    'log.exposure.prediction': 'Katastrofförutsägelse — vad var du rädd skulle hända?',
    'log.exposure.peak': 'Topp-SUDS (högsta punkten)',
    'log.exposure.end': 'Slut-SUDS (när du avslutade)',
    'log.exposure.cameTrue': 'Blev förutsägelsen sann?',
    'log.exposure.cameTrue.no': 'Nej — katastrofen hände inte',
    'log.exposure.safety': 'Säkerhetsbeteenden som användes (t.ex. hålla väggen, se på golvet)',
    'log.exposure.habituation': 'Minskade oron medan du stannade?',
    'log.exposure.reflection': 'Reflektion — vad lärde du dig?',
    'log.exposure.save': 'Spara exponeringslogg',
    'log.history': 'Historik',
    'log.history.empty': 'Inga poster ännu. Din första hamnar här.',
    'log.history.delete': 'Radera',
    'log.history.confirmDelete': 'Radera denna post? Det går inte att ångra.',
    'log.export': 'Export & Säkerhetskopiering',
    'log.export.json': 'Ladda ner säkerhetskopia (JSON)',
    'log.export.md': 'Exportera som Markdown',
    'log.export.import': 'Importera säkerhetskopia',

    // PATH mode
    'path.title': 'Din väg',
    'path.subtitle': 'Var du är, och nästa försiktiga steg',
    'path.currentFocus': 'Nuvarande fokus',
    'path.nextStep': 'Ett mikro-steg du skulle prova',
    'path.nextStepLabel': 'Nästa steg',
    'path.editSuds': 'Uppdatera SUDS',
    'path.history': 'SUDS-historik (endast tillägg)',
    'path.milestones': 'Milstolpar',
    'path.milestones.empty': 'Inga milstolpar ännu. Stora ögonblick samlas här.',
    'path.milestones.add': 'Lägg till milstolpe',
    'path.milestones.title': 'Titel',
    'path.milestones.note': 'Vad hände?',

    // Settings
    'settings.title': 'Inställningar',
    'settings.language': 'Språk',
    'settings.contrast': 'Hög kontrast',
    'settings.textSize': 'Större text',
    'settings.reducedMotion': 'Minska rörelse',

    // Misc
    'common.cancel': 'Avbryt',
    'common.save': 'Spara',
    'common.close': 'Stäng',
    'common.back': 'Tillbaka',
    'common.optional': 'valfritt',
  },
};

let currentLang = 'en';

export function setLanguage(lang) {
  currentLang = TRANSLATIONS[lang] ? lang : 'en';
}

export function getLanguage() {
  return currentLang;
}

/* t(key) — translate. Falls back to English, then to the key itself. */
export function t(key) {
  return TRANSLATIONS[currentLang]?.[key]
    || TRANSLATIONS.en[key]
    || key;
}
