// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AmbientLayer, { useAmbience } from './AmbientLayer';
import MascotStage, { type PeekAnchor } from './MascotStage';
import LivingSearchBar from './LivingSearchBar';
import LivingSettingsPanel from './LivingSettingsPanel';
import { useLivingSettings } from '@/contexts/LivingSettingsContext';
import './living.css';

/**
 * LivingHero — the composed "living" homepage stage:
 * ambient environment → mascot layer → search bar → foreground content.
 * Layer order is explicit so the mascot always reads as being *behind*
 * the search bar while remaining fully non-interactive.
 */

interface LivingHeroProps {
  onSearch?: (query: string) => void;
  children?: React.ReactNode;
}

export default function LivingHero({ onSearch, children }: LivingHeroProps) {
  const navigate = useNavigate();
  const { settings, motionOff } = useLivingSettings();
  const { theme, season } = useAmbience();
  const stageRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [peekAnchor, setPeekAnchor] = useState<PeekAnchor | null>(null);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const search = searchRef.current;
    if (!stage || !search) return;
    const s = stage.getBoundingClientRect();
    const b = search.getBoundingClientRect();
    setPeekAnchor({ x: b.left - s.left + b.width / 2, y: b.top - s.top });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [measure]);

  const handleSearch = (query: string) => {
    if (onSearch) return onSearch(query);
    navigate(`/sectors?q=${encodeURIComponent(query)}`);
  };

  return (
    <section
      ref={stageRef}
      className="relative isolate flex min-h-[72vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      aria-label="Software Vala marketplace search"
    >
      {/* z-0 — ambient environment */}
      <div className="absolute inset-0 z-0">
        {settings.weatherEnabled || settings.animationsEnabled ? <AmbientLayer /> : null}
      </div>

      {/* z-10 — mascots, always behind the search bar */}
      <div className="absolute inset-0 z-10">
        <MascotStage peekAnchor={peekAnchor} />
      </div>

      {/* z-20 — foreground content */}
      <div className="relative z-20 flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <motion.p
          initial={motionOff ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {theme.label}
          {season.id !== 'none' && settings.seasonalEnabled ? ` · ${season.label}` : ''} · Software Vala™ Marketplace
        </motion.p>

        {children}

        <div className="flex w-full items-center justify-center gap-3">
          <LivingSearchBar ref={searchRef} onSubmit={handleSearch} />
          <LivingSettingsPanel />
        </div>
      </div>
    </section>
  );
}
