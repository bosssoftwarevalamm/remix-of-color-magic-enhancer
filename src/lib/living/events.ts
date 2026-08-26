// @ts-nocheck
/**
 * Living Homepage event bus.
 * Lightweight, dependency-free pub/sub used to let any part of the app
 * signal the mascot / celebration layers without prop drilling.
 */

export type LivingEventName =
  | 'search:start'
  | 'search:typing'
  | 'search:complete'
  | 'ai:respond'
  | 'notification'
  | 'loading:start'
  | 'loading:end'
  | 'celebrate';

export interface CelebrateDetail {
  /** Short label shown in the celebration toast bubble. */
  label?: string;
  /** Intensity of the confetti burst. */
  intensity?: 'small' | 'medium';
}

type LivingEventDetail = CelebrateDetail | Record<string, unknown> | undefined;

const CHANNEL = 'software-vala:living';

type Handler = (detail: LivingEventDetail) => void;

const listeners = new Map<LivingEventName, Set<Handler>>();

export function emitLivingEvent(name: LivingEventName, detail?: LivingEventDetail) {
  const set = listeners.get(name);
  if (set) set.forEach((fn) => fn(detail));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`${CHANNEL}:${name}`, { detail }));
  }
}

export function onLivingEvent(name: LivingEventName, handler: Handler) {
  let set = listeners.get(name);
  if (!set) {
    set = new Set();
    listeners.set(name, set);
  }
  set.add(handler);
  return () => {
    set?.delete(handler);
  };
}

/** Convenience helper for success moments (purchase, license, upgrade...). */
export function celebrate(label: string, intensity: CelebrateDetail['intensity'] = 'medium') {
  emitLivingEvent('celebrate', { label, intensity });
}
