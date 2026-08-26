// @ts-nocheck
import { memo, useEffect, useMemo, useState } from 'react';
import { useLivingSettings } from '@/contexts/LivingSettingsContext';
import { getAmbienceTheme, getSeasonEvent, type AmbienceTheme, type SeasonEvent } from '@/lib/living/ambience';

/**
 * Ambient environment layer: time-of-day lighting wash, sky ornament,
 * drifting depth particles and light seasonal flourishes.
 * Purely decorative — never intercepts pointer events.
 */

export function useAmbience() {
  const [theme, setTheme] = useState<AmbienceTheme>(() => getAmbienceTheme());
  const [season, setSeason] = useState<SeasonEvent>(() => getSeasonEvent());

  useEffect(() => {
    const tick = () => {
      setTheme(getAmbienceTheme());
      setSeason(getSeasonEvent());
    };
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return { theme, season };
}

const AmbientLayer = memo(function AmbientLayer() {
  const { settings, motionOff, densityFactor, speedFactor } = useLivingSettings();
  const { theme, season } = useAmbience();

  const particles = useMemo(() => {
    const count = Math.round(18 * densityFactor);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: (i * 37) % 100,
      top: (i * 53) % 100,
      size: 1 + (i % 3),
      duration: (10 + (i % 7) * 2) * speedFactor,
      delay: (i % 9) * 0.7,
      depth: i % 3,
    }));
  }, [densityFactor, speedFactor]);

  const flourish = settings.seasonalEnabled && settings.weatherEnabled ? season.flourish : 'none';

  const flakes = useMemo(() => {
    if (flourish === 'none' || motionOff) return [];
    const count = Math.round(14 * densityFactor);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: (i * 71) % 100,
      size: flourish === 'lanterns' ? 10 + (i % 3) * 4 : 3 + (i % 3),
      duration: (9 + (i % 6) * 2.5) * speedFactor,
      delay: (i % 10) * 1.1,
      drift: ((i % 5) - 2) * 24,
    }));
  }, [flourish, densityFactor, speedFactor, motionOff]);

  const flourishColor =
    flourish === 'snow'
      ? 'hsl(0 0% 100%)'
      : flourish === 'petals'
        ? season.accent
        : flourish === 'lanterns'
          ? 'hsl(0 80% 58%)'
          : season.accent;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      data-time-of-day={theme.timeOfDay}
      data-season={season.id}
    >
      {/* Time-of-day lighting wash */}
      <div
        className="absolute inset-0 transition-[background] duration-[3000ms] ease-out"
        style={{ background: theme.wash }}
      />

      {/* Sky ornament */}
      <div className="absolute right-[8%] top-[12%]">
        {theme.ornament === 'sun' && (
          <div
            className={motionOff ? '' : 'sv-breathe'}
            style={{
              width: 90,
              height: 90,
              borderRadius: '9999px',
              background: `radial-gradient(circle, ${theme.glow} 0%, transparent 68%)`,
              opacity: 0.35,
            }}
          />
        )}
        {theme.ornament === 'moon' && (
          <div
            className={motionOff ? '' : 'sv-breathe'}
            style={{
              width: 66,
              height: 66,
              borderRadius: '9999px',
              boxShadow: `inset -16px 6px 0 0 ${theme.glow}`,
              opacity: 0.28,
            }}
          />
        )}
      </div>

      {/* Parallax depth particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className={motionOff ? 'absolute rounded-full' : 'sv-drift absolute rounded-full'}
            style={
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                background: theme.glow,
                opacity: 0.1 + p.depth * 0.12,
                boxShadow: `0 0 ${6 + p.depth * 4}px ${theme.glow}`,
                animationDelay: `${p.delay}s`,
                '--sv-drift-duration': `${p.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Night starfield */}
      {theme.ornament === 'stars' && (
        <div className="absolute inset-0">
          {Array.from({ length: Math.round(22 * densityFactor) }, (_, i) => (
            <span
              key={i}
              className={motionOff ? 'absolute rounded-full' : 'sv-twinkle absolute rounded-full'}
              style={
                {
                  left: `${(i * 43) % 100}%`,
                  top: `${(i * 29) % 60}%`,
                  width: 2,
                  height: 2,
                  background: 'hsl(0 0% 100%)',
                  opacity: 0.4,
                  animationDelay: `${(i % 8) * 0.45}s`,
                  '--sv-twinkle-duration': `${(2.6 + (i % 4)) * speedFactor}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Seasonal flourish */}
      {flakes.map((f) => (
        <span
          key={`f-${f.id}`}
          className="sv-fall absolute"
          style={
            {
              left: `${f.left}%`,
              top: 0,
              width: f.size,
              height: flourish === 'lanterns' ? f.size * 1.4 : f.size,
              borderRadius: flourish === 'petals' ? '60% 0 60% 0' : '9999px',
              background: flourishColor,
              animationDelay: `${f.delay}s`,
              '--sv-fall-duration': `${f.duration}s`,
              '--sv-fall-drift': `${f.drift}px`,
              '--sv-fall-opacity': flourish === 'snow' ? 0.75 : 0.6,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
});

export default AmbientLayer;
