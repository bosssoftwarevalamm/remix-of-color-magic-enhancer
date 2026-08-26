// @ts-nocheck
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLivingSettings } from '@/contexts/LivingSettingsContext';
import { cn } from '@/lib/utils';

/**
 * MagneticCard — subtle 3D tilt + magnetic cursor pull.
 * Pointer-driven, transform-only, and automatically inert on touch devices
 * or when motion is reduced.
 */

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  tilt?: number;
  /** Max magnetic translation in px. */
  pull?: number;
  /** Adds a cursor-following gradient highlight. */
  glow?: boolean;
  as?: 'div' | 'article' | 'li';
}

const MagneticCard = memo(function MagneticCard({
  children,
  className,
  tilt = 7,
  pull = 6,
  glow = true,
  as: Tag = 'div',
}: MagneticCardProps) {
  const { motionOff } = useLivingSettings();
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number>();
  const [fine, setFine] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const active = fine && !motionOff;

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!active || !ref.current) return;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * tilt * 2}deg) rotateY(${
          (px - 0.5) * tilt * 2
        }deg) translate3d(${(px - 0.5) * pull * 2}px, ${(py - 0.5) * pull * 2}px, 0)`;
        if (glow) {
          el.style.setProperty('--sv-glow-x', `${px * 100}%`);
          el.style.setProperty('--sv-glow-y', `${py * 100}%`);
        }
      });
    },
    [active, tilt, pull, glow]
  );

  const reset = useCallback(() => {
    if (!ref.current) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    ref.current.style.transform = '';
  }, []);

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  const Element = Tag as React.ElementType;

  return (
    <Element
      ref={ref}

      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn('sv-tilt relative', className)}
      style={
        glow && active
          ? ({
              backgroundImage:
                'radial-gradient(320px circle at var(--sv-glow-x, 50%) var(--sv-glow-y, 50%), hsl(var(--primary) / 0.12), transparent 65%)',
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Element>

  );
});

export default MagneticCard;
