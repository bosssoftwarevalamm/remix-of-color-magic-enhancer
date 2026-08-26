// @ts-nocheck
/**
 * Ambience engine: derives time-of-day lighting and the active seasonal event
 * from the visitor's local clock. Pure functions, no side effects.
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'goldenHour' | 'evening' | 'night';

export interface AmbienceTheme {
  timeOfDay: TimeOfDay;
  label: string;
  /** Very low-opacity wash layered over the page background. */
  wash: string;
  /** Accent used by particles / glow dots. */
  glow: string;
  /** Sky ornament rendered top-right (sun, moon, stars...). */
  ornament: 'sun' | 'moon' | 'stars' | 'aurora';
}

const THEMES: Record<TimeOfDay, Omit<AmbienceTheme, 'timeOfDay'>> = {
  morning: {
    label: 'Morning',
    wash: 'radial-gradient(1200px 600px at 20% -10%, hsl(190 90% 55% / 0.10), transparent 70%), radial-gradient(900px 500px at 85% 10%, hsl(45 95% 60% / 0.07), transparent 70%)',
    glow: 'hsl(190 95% 60%)',
    ornament: 'sun',
  },
  afternoon: {
    label: 'Afternoon',
    wash: 'radial-gradient(1200px 600px at 50% -15%, hsl(210 95% 60% / 0.10), transparent 70%), radial-gradient(800px 500px at 10% 20%, hsl(265 85% 65% / 0.06), transparent 70%)',
    glow: 'hsl(205 95% 62%)',
    ornament: 'sun',
  },
  goldenHour: {
    label: 'Golden Hour',
    wash: 'radial-gradient(1100px 600px at 80% -5%, hsl(30 95% 58% / 0.12), transparent 70%), radial-gradient(900px 500px at 15% 15%, hsl(330 80% 60% / 0.07), transparent 70%)',
    glow: 'hsl(35 95% 62%)',
    ornament: 'sun',
  },
  evening: {
    label: 'Evening',
    wash: 'radial-gradient(1200px 650px at 70% -10%, hsl(265 85% 60% / 0.12), transparent 70%), radial-gradient(900px 500px at 10% 10%, hsl(200 90% 55% / 0.07), transparent 70%)',
    glow: 'hsl(265 90% 70%)',
    ornament: 'moon',
  },
  night: {
    label: 'Night',
    wash: 'radial-gradient(1300px 700px at 60% -15%, hsl(225 90% 55% / 0.10), transparent 70%), radial-gradient(800px 500px at 5% 5%, hsl(180 90% 50% / 0.05), transparent 70%)',
    glow: 'hsl(195 90% 65%)',
    ornament: 'stars',
  },
};

export function getTimeOfDay(date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 16) return 'afternoon';
  if (h >= 16 && h < 19) return 'goldenHour';
  if (h >= 19 && h < 22) return 'evening';
  return 'night';
}

export function getAmbienceTheme(date = new Date()): AmbienceTheme {
  const timeOfDay = getTimeOfDay(date);
  return { timeOfDay, ...THEMES[timeOfDay] };
}

/* ------------------------------------------------------------------ */
/* Seasonal events                                                     */
/* ------------------------------------------------------------------ */

export type SeasonId =
  | 'newYear'
  | 'christmas'
  | 'halloween'
  | 'blackFriday'
  | 'cyberMonday'
  | 'diwali'
  | 'holi'
  | 'ramadan'
  | 'eid'
  | 'lunarNewYear'
  | 'none';

export interface SeasonEvent {
  id: SeasonId;
  label: string;
  /** Accessory drawn on the mascot — identity never changes. */
  accessory: 'none' | 'party-hat' | 'santa-hat' | 'pumpkin' | 'tag' | 'diya' | 'colors' | 'crescent' | 'lantern';
  accent: string;
  /** Ambient flourish for the weather layer. */
  flourish: 'none' | 'snow' | 'sparks' | 'petals' | 'lanterns';
}

const SEASONS: Record<Exclude<SeasonId, 'none'>, Omit<SeasonEvent, 'id'>> = {
  newYear: { label: 'New Year', accessory: 'party-hat', accent: 'hsl(45 95% 60%)', flourish: 'sparks' },
  christmas: { label: 'Christmas', accessory: 'santa-hat', accent: 'hsl(0 75% 55%)', flourish: 'snow' },
  halloween: { label: 'Halloween', accessory: 'pumpkin', accent: 'hsl(25 95% 55%)', flourish: 'none' },
  blackFriday: { label: 'Black Friday', accessory: 'tag', accent: 'hsl(45 95% 58%)', flourish: 'none' },
  cyberMonday: { label: 'Cyber Monday', accessory: 'tag', accent: 'hsl(190 95% 55%)', flourish: 'none' },
  diwali: { label: 'Diwali', accessory: 'diya', accent: 'hsl(35 95% 58%)', flourish: 'sparks' },
  holi: { label: 'Holi', accessory: 'colors', accent: 'hsl(320 85% 62%)', flourish: 'petals' },
  ramadan: { label: 'Ramadan', accessory: 'crescent', accent: 'hsl(160 70% 50%)', flourish: 'none' },
  eid: { label: 'Eid', accessory: 'crescent', accent: 'hsl(160 75% 55%)', flourish: 'sparks' },
  lunarNewYear: { label: 'Lunar New Year', accessory: 'lantern', accent: 'hsl(0 80% 58%)', flourish: 'lanterns' },
};

/** Fixed-date windows. Lunar festivals use a maintained multi-year table. */
const FIXED: Array<{ id: Exclude<SeasonId, 'none'>; from: [number, number]; to: [number, number] }> = [
  { id: 'newYear', from: [12, 29], to: [1, 3] },
  { id: 'christmas', from: [12, 18], to: [12, 28] },
  { id: 'halloween', from: [10, 25], to: [11, 1] },
];

const DATED: Array<{ id: Exclude<SeasonId, 'none'>; start: string; end: string }> = [
  // Black Friday / Cyber Monday
  { id: 'blackFriday', start: '2025-11-26', end: '2025-11-29' },
  { id: 'cyberMonday', start: '2025-11-30', end: '2025-12-02' },
  { id: 'blackFriday', start: '2026-11-25', end: '2026-11-28' },
  { id: 'cyberMonday', start: '2026-11-29', end: '2026-12-01' },
  { id: 'blackFriday', start: '2027-11-24', end: '2027-11-27' },
  { id: 'cyberMonday', start: '2027-11-28', end: '2027-11-30' },
  // Diwali
  { id: 'diwali', start: '2025-10-18', end: '2025-10-23' },
  { id: 'diwali', start: '2026-11-06', end: '2026-11-11' },
  { id: 'diwali', start: '2027-10-27', end: '2027-11-01' },
  // Holi
  { id: 'holi', start: '2026-03-03', end: '2026-03-05' },
  { id: 'holi', start: '2027-03-21', end: '2027-03-23' },
  // Ramadan + Eid al-Fitr
  { id: 'ramadan', start: '2026-02-17', end: '2026-03-18' },
  { id: 'eid', start: '2026-03-19', end: '2026-03-22' },
  { id: 'ramadan', start: '2027-02-07', end: '2027-03-08' },
  { id: 'eid', start: '2027-03-09', end: '2027-03-12' },
  // Lunar New Year
  { id: 'lunarNewYear', start: '2026-02-15', end: '2026-02-20' },
  { id: 'lunarNewYear', start: '2027-02-04', end: '2027-02-09' },
];

function inFixedWindow(date: Date, from: [number, number], to: [number, number]) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const cur = m * 100 + d;
  const a = from[0] * 100 + from[1];
  const b = to[0] * 100 + to[1];
  return a <= b ? cur >= a && cur <= b : cur >= a || cur <= b;
}

export function getSeasonEvent(date = new Date()): SeasonEvent {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

  const dated = DATED.find((s) => iso >= s.start && iso <= s.end);
  if (dated) return { id: dated.id, ...SEASONS[dated.id] };

  const fixed = FIXED.find((s) => inFixedWindow(date, s.from, s.to));
  if (fixed) return { id: fixed.id, ...SEASONS[fixed.id] };

  return { id: 'none', label: '', accessory: 'none', accent: 'hsl(195 95% 60%)', flourish: 'none' };
}
