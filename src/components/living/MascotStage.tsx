// @ts-nocheck
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MascotArt, { MASCOT_LIST, MASCOTS, type MascotSpecies } from './MascotArt';
import { useLivingSettings } from '@/contexts/LivingSettingsContext';
import { onLivingEvent } from '@/lib/living/events';
import { getSeasonEvent } from '@/lib/living/ambience';

/**
 * MascotStage — orchestrates which mascot is on screen, where it stands and
 * how it reacts. At most one mascot is ever visible so the page never feels
 * busy, and everything is suppressed when motion is reduced or the tab is
 * hidden.
 */

type Behavior = 'walk' | 'peek' | 'idle' | 'cheer' | 'sleep';

interface StageMascot {
  key: number;
  species: MascotSpecies;
  behavior: Behavior;
  /** Horizontal placement as a percentage of the stage width. */
  x: number;
  from: 'left' | 'right';
}

export interface PeekAnchor {
  /** Pixel offset of the search bar centre within the stage. */
  x: number;
  /** Pixel offset of the search bar top edge within the stage. */
  y: number;
}

interface MascotStageProps {
  /** Where the mascot should peek from behind. */
  peekAnchor?: PeekAnchor | null;
  className?: string;
}

const APPEAR_MIN = 14_000;
const APPEAR_MAX = 26_000;
const VISIBLE_MS = 9_000;
const IDLE_SLEEP_MS = 30_000;

function pickSpecies(exclude?: MascotSpecies): MascotSpecies {
  const pool = MASCOT_LIST.filter((m) => m.species !== exclude);
  return pool[Math.floor(Math.random() * pool.length)].species;
}

const MascotStage = memo(function MascotStage({ peekAnchor, className }: MascotStageProps) {
  const { mascotsActive, motionOff, speedFactor, settings } = useLivingSettings();
  const [mascot, setMascot] = useState<StageMascot | null>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const [asleep, setAsleep] = useState(false);
  const keyRef = useRef(0);
  const hideTimer = useRef<number>();
  const spawnTimer = useRef<number>();
  const bubbleTimer = useRef<number>();

  const season = useMemo(() => getSeasonEvent(), []);
  const accessory = settings.seasonalEnabled ? season.accessory : 'none';

  const clearTimers = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    window.clearTimeout(spawnTimer.current);
  }, []);

  const spawn = useCallback(
    (behavior: Behavior = 'walk', species?: MascotSpecies) => {
      keyRef.current += 1;
      const from: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right';
      setMascot((prev) => ({
        key: keyRef.current,
        species: species ?? pickSpecies(prev?.species),
        behavior,
        x: behavior === 'peek' ? 50 : 16 + Math.random() * 68,
        from,
      }));
    },
    []
  );

  /* Ambient appearance loop -------------------------------------------- */
  useEffect(() => {
    if (!mascotsActive) {
      clearTimers();
      setMascot(null);
      return;
    }

    let cancelled = false;

    const schedule = (delay: number) => {
      spawnTimer.current = window.setTimeout(() => {
        if (cancelled) return;
        if (document.hidden) {
          schedule(6_000);
          return;
        }
        spawn('walk');
        hideTimer.current = window.setTimeout(() => {
          if (!cancelled) setMascot(null);
        }, VISIBLE_MS * speedFactor);
        schedule(APPEAR_MIN + Math.random() * (APPEAR_MAX - APPEAR_MIN));
      }, delay);
    };

    schedule(3_500);
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [mascotsActive, spawn, speedFactor, clearTimers]);

  /* Idle → sleep -------------------------------------------------------- */
  useEffect(() => {
    if (!mascotsActive) return;
    let timer = window.setTimeout(() => setAsleep(true), IDLE_SLEEP_MS);
    const wake = () => {
      setAsleep(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setAsleep(true), IDLE_SLEEP_MS);
    };
    const events: Array<keyof WindowEventMap> = ['pointermove', 'keydown', 'scroll', 'pointerdown'];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [mascotsActive]);

  /* Event reactions ----------------------------------------------------- */
  useEffect(() => {
    if (!mascotsActive) return;

    const say = (text: string, ms = 3200) => {
      setBubble(text);
      window.clearTimeout(bubbleTimer.current);
      bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
    };

    const offs = [
      onLivingEvent('search:typing', () => {
        setAsleep(false);
        window.clearTimeout(hideTimer.current);
        spawn('peek', 'cat');
        hideTimer.current = window.setTimeout(() => setMascot(null), 6_000);
      }),
      onLivingEvent('search:complete', () => {
        spawn('cheer', 'fox');
        say(MASCOTS.fox.greeting);
        window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setMascot(null), 5_000);
      }),
      onLivingEvent('loading:start', () => {
        spawn('idle', 'penguin');
        say(MASCOTS.penguin.greeting);
      }),
      onLivingEvent('loading:end', () => setMascot(null)),
      onLivingEvent('ai:respond', () => {
        spawn('idle', 'owl');
        say(MASCOTS.owl.greeting);
        window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setMascot(null), 6_000);
      }),
      onLivingEvent('celebrate', (detail) => {
        const label = (detail as { label?: string } | undefined)?.label;
        spawn('cheer');
        say(label ?? 'Nicely done!');
        window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setMascot(null), 5_000);
      }),
    ];

    return () => {
      offs.forEach((off) => off());
      window.clearTimeout(bubbleTimer.current);
    };
  }, [mascotsActive, spawn]);

  if (!mascotsActive || !mascot) return null;

  const isPeek = mascot.behavior === 'peek' && peekAnchor;
  const size = isPeek ? 84 : 76;

  const positionStyle: React.CSSProperties = isPeek
    ? { left: peekAnchor!.x, top: peekAnchor!.y, transform: 'translate(-50%, -62%)' }
    : { left: `${mascot.x}%`, bottom: 12, transform: 'translateX(-50%)' };

  const enterX = motionOff ? 0 : mascot.from === 'left' ? -80 : 80;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={mascot.key}
          className="absolute"
          style={positionStyle}
          initial={motionOff ? { opacity: 0 } : { opacity: 0, x: enterX, y: isPeek ? 30 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={motionOff ? { opacity: 0 } : { opacity: 0, y: isPeek ? 26 : 10, scale: 0.94 }}
          transition={{ duration: 0.55 * speedFactor, ease: [0.2, 0.8, 0.3, 1] }}
        >
          <div className={motionOff ? '' : 'sv-breathe'}>
            <MascotArt
              species={mascot.species}
              size={size}
              asleep={asleep && mascot.behavior === 'walk'}
              cheering={mascot.behavior === 'cheer'}
              accessory={accessory}
            />
          </div>

          <AnimatePresence>
            {bubble && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                className="absolute bottom-full left-1/2 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-xl border border-primary/30 bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md"
                role="status"
              >
                {bubble}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Screen-reader friendly, non-intrusive description of the ambient scene */}
      <span className="sr-only">
        Decorative Software Vala mascot {MASCOTS[mascot.species].name} is visible.
      </span>
    </div>
  );
});

export default MascotStage;
