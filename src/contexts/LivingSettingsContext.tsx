// @ts-nocheck
import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';

/**
 * Living Homepage settings.
 * Persisted per-visitor, respects prefers-reduced-motion and Battery Status
 * where available. Every ambient subsystem reads from here.
 */

export type AnimationSpeed = 'slow' | 'normal' | 'brisk';
export type AnimationDensity = 'minimal' | 'balanced' | 'rich';

export interface LivingSettings {
  mascotsEnabled: boolean;
  weatherEnabled: boolean;
  seasonalEnabled: boolean;
  animationsEnabled: boolean;
  reduceMotion: boolean;
  performanceMode: boolean;
  batterySaver: boolean;
  speed: AnimationSpeed;
  density: AnimationDensity;
}

const DEFAULTS: LivingSettings = {
  mascotsEnabled: true,
  weatherEnabled: true,
  seasonalEnabled: true,
  animationsEnabled: true,
  reduceMotion: false,
  performanceMode: false,
  batterySaver: false,
  speed: 'normal',
  density: 'balanced',
};

const STORAGE_KEY = 'sv:living-settings:v1';

interface LivingSettingsContextValue {
  settings: LivingSettings;
  update: <K extends keyof LivingSettings>(key: K, value: LivingSettings[K]) => void;
  reset: () => void;
  /** Derived: true when all decorative motion must be suppressed. */
  motionOff: boolean;
  /** Derived multiplier applied to every duration. */
  speedFactor: number;
  /** Derived count multiplier for particles / ambient objects. */
  densityFactor: number;
  /** Derived: mascots may be shown right now. */
  mascotsActive: boolean;
}

const LivingSettingsContext = createContext<LivingSettingsContextValue | undefined>(undefined);

function readStored(): Partial<LivingSettings> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<LivingSettings>) : {};
  } catch {
    return {};
  }
}

export function LivingSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LivingSettings>(() => ({ ...DEFAULTS, ...readStored() }));

  // System reduced-motion preference wins over the stored default on first load.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (mq.matches) setSettings((s) => ({ ...s, reduceMotion: true }));
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Battery saver: auto-enable under 20% while discharging.
  useEffect(() => {
    let cancelled = false;
    const nav = navigator as Navigator & { getBattery?: () => Promise<any> };
    if (!nav.getBattery) return;
    nav
      .getBattery()
      .then((battery: any) => {
        if (cancelled) return;
        const sync = () => {
          const low = battery.level < 0.2 && !battery.charging;
          setSettings((s) => (s.batterySaver === low ? s : { ...s, batterySaver: low }));
        };
        sync();
        battery.addEventListener('levelchange', sync);
        battery.addEventListener('chargingchange', sync);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable — settings stay in-memory */
    }
  }, [settings]);

  const update = useCallback(
    <K extends keyof LivingSettings>(key: K, value: LivingSettings[K]) =>
      setSettings((s) => ({ ...s, [key]: value })),
    []
  );

  const reset = useCallback(() => setSettings({ ...DEFAULTS }), []);

  const value = useMemo<LivingSettingsContextValue>(() => {
    const motionOff =
      settings.reduceMotion || !settings.animationsEnabled || settings.batterySaver;
    const speedFactor = settings.speed === 'slow' ? 1.45 : settings.speed === 'brisk' ? 0.7 : 1;
    const densityBase =
      settings.density === 'minimal' ? 0.4 : settings.density === 'rich' ? 1.6 : 1;
    const densityFactor =
      motionOff || settings.performanceMode ? Math.min(densityBase, 0.4) : densityBase;

    return {
      settings,
      update,
      reset,
      motionOff,
      speedFactor,
      densityFactor,
      mascotsActive: settings.mascotsEnabled && !settings.reduceMotion && !settings.batterySaver,
    };
  }, [settings, update, reset]);

  return <LivingSettingsContext.Provider value={value}>{children}</LivingSettingsContext.Provider>;
}

export function useLivingSettings() {
  const ctx = useContext(LivingSettingsContext);
  if (!ctx) throw new Error('useLivingSettings must be used within a LivingSettingsProvider');
  return ctx;
}
