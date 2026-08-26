// @ts-nocheck
import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onLivingEvent } from '@/lib/living/events';
import { useLivingSettings } from '@/contexts/LivingSettingsContext';

/**
 * CelebrationLayer — short confetti burst for success moments.
 * Listens on the living event bus, renders at most one burst at a time
 * and self-cleans after the animation completes.
 */

const COLORS = [
  'hsl(190 95% 60%)',
  'hsl(265 85% 68%)',
  'hsl(45 95% 60%)',
  'hsl(150 80% 55%)',
  'hsl(330 85% 65%)',
];

interface Burst {
  id: number;
  pieces: Array<{ x: number; y: number; r: number; color: string; left: number; delay: number }>;
}

const CelebrationLayer = memo(function CelebrationLayer() {
  const { motionOff, densityFactor } = useLivingSettings();
  const [burst, setBurst] = useState<Burst | null>(null);

  useEffect(() => {
    if (motionOff) return;
    let idc = 0;
    const off = onLivingEvent('celebrate', (detail) => {
      const intensity = (detail as { intensity?: 'small' | 'medium' } | undefined)?.intensity ?? 'medium';
      const count = Math.round((intensity === 'small' ? 16 : 30) * Math.max(densityFactor, 0.5));
      idc += 1;
      setBurst({
        id: idc,
        pieces: Array.from({ length: count }, (_, i) => ({
          x: (Math.random() - 0.5) * 420,
          y: 160 + Math.random() * 260,
          r: (Math.random() - 0.5) * 900,
          color: COLORS[i % COLORS.length],
          left: 50 + (Math.random() - 0.5) * 30,
          delay: Math.random() * 0.18,
        })),
      });
      window.setTimeout(() => setBurst(null), 2100);
    });
    return off;
  }, [motionOff, densityFactor]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0" aria-hidden="true">
      <AnimatePresence>
        {burst && (
          <motion.div key={burst.id} className="relative mx-auto h-0 w-full max-w-5xl">
            {burst.pieces.map((p, i) => (
              <span
                key={i}
                className="sv-confetti absolute top-24 block h-2 w-1.5 rounded-[2px]"
                style={
                  {
                    left: `${p.left}%`,
                    background: p.color,
                    animationDelay: `${p.delay}s`,
                    '--sv-confetti-x': `${p.x}px`,
                    '--sv-confetti-y': `${p.y}px`,
                    '--sv-confetti-r': `${p.r}deg`,
                  } as React.CSSProperties
                }
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default CelebrationLayer;
