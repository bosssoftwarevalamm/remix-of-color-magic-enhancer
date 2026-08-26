// @ts-nocheck
import { memo } from 'react';
import type { SeasonEvent } from '@/lib/living/ambience';

/**
 * Software Vala original mascot artwork.
 * Every shape here is authored from scratch for this project — geometric,
 * enterprise-friendly silhouettes with a soft luminous visor instead of
 * cartoon faces. No third-party or referenced character art is used.
 */

export type MascotSpecies = 'dog' | 'cat' | 'owl' | 'fox' | 'penguin' | 'camel';

export interface MascotProfile {
  species: MascotSpecies;
  name: string;
  personality: string;
  /** Short line the mascot can show in its speech bubble. */
  greeting: string;
  hue: string;
  hueSoft: string;
  accent: string;
}

export const MASCOTS: Record<MascotSpecies, MascotProfile> = {
  dog: {
    species: 'dog',
    name: 'Vaan',
    personality: 'Greeting · Welcome',
    greeting: 'Welcome to Software Vala.',
    hue: 'hsl(200 90% 58%)',
    hueSoft: 'hsl(200 80% 38%)',
    accent: 'hsl(190 100% 72%)',
  },
  cat: {
    species: 'cat',
    name: 'Miso',
    personality: 'Curiosity · Search',
    greeting: 'Curious? Try a search.',
    hue: 'hsl(265 80% 66%)',
    hueSoft: 'hsl(265 65% 44%)',
    accent: 'hsl(280 100% 80%)',
  },
  owl: {
    species: 'owl',
    name: 'Vidya',
    personality: 'Knowledge · AI Assistant',
    greeting: 'Ask me anything about software.',
    hue: 'hsl(160 65% 50%)',
    hueSoft: 'hsl(165 55% 32%)',
    accent: 'hsl(150 90% 70%)',
  },
  fox: {
    species: 'fox',
    name: 'Rea',
    personality: 'Smart Suggestions',
    greeting: 'I found something you may like.',
    hue: 'hsl(24 90% 58%)',
    hueSoft: 'hsl(18 75% 40%)',
    accent: 'hsl(38 100% 70%)',
  },
  penguin: {
    species: 'penguin',
    name: 'Pico',
    personality: 'Loading · Updates',
    greeting: 'Getting things ready…',
    hue: 'hsl(215 40% 40%)',
    hueSoft: 'hsl(220 45% 24%)',
    accent: 'hsl(45 95% 62%)',
  },
  camel: {
    species: 'camel',
    name: 'Sahra',
    personality: 'Global Marketplace',
    greeting: 'Serving 50+ countries.',
    hue: 'hsl(38 60% 60%)',
    hueSoft: 'hsl(32 45% 42%)',
    accent: 'hsl(45 90% 72%)',
  },
};

export const MASCOT_LIST = Object.values(MASCOTS);

interface MascotArtProps {
  species: MascotSpecies;
  size?: number;
  /** Sleeping mascots close their visor. */
  asleep?: boolean;
  /** Celebrating mascots raise a paw / flipper. */
  cheering?: boolean;
  accessory?: SeasonEvent['accessory'];
  className?: string;
}

function Accessory({ kind, accent }: { kind: SeasonEvent['accessory']; accent: string }) {
  switch (kind) {
    case 'party-hat':
      return (
        <g>
          <path d="M46 22 L54 4 L62 22 Z" fill={accent} />
          <circle cx="54" cy="3" r="2.6" fill="hsl(0 0% 100%)" />
        </g>
      );
    case 'santa-hat':
      return (
        <g>
          <path d="M42 22 Q52 2 66 12 L60 23 Z" fill="hsl(0 75% 52%)" />
          <rect x="40" y="20" width="24" height="5" rx="2.5" fill="hsl(0 0% 98%)" />
          <circle cx="67" cy="12" r="4" fill="hsl(0 0% 98%)" />
        </g>
      );
    case 'pumpkin':
      return (
        <g>
          <circle cx="56" cy="12" r="7" fill="hsl(25 95% 55%)" />
          <path d="M56 5 v-4" stroke="hsl(120 40% 35%)" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case 'tag':
      return (
        <g>
          <path d="M44 8 h16 l6 7 -6 7 H44 Z" fill={accent} />
          <circle cx="49" cy="15" r="2" fill="hsl(220 40% 12%)" />
        </g>
      );
    case 'diya':
      return (
        <g>
          <path d="M46 18 q8 6 16 0 q-8 4 -16 0 Z" fill="hsl(30 70% 45%)" />
          <path d="M54 16 q3-6 0-9 q-3 4 0 9 Z" fill="hsl(45 100% 62%)" />
        </g>
      );
    case 'colors':
      return (
        <g opacity="0.9">
          <circle cx="44" cy="14" r="3.2" fill="hsl(320 85% 62%)" />
          <circle cx="55" cy="9" r="3.6" fill="hsl(180 85% 55%)" />
          <circle cx="65" cy="15" r="3" fill="hsl(45 95% 60%)" />
        </g>
      );
    case 'crescent':
      return (
        <g>
          <path d="M62 14 a7 7 0 1 1 -6 -7 a5.6 5.6 0 1 0 6 7 Z" fill={accent} />
          <circle cx="47" cy="8" r="1.6" fill={accent} />
        </g>
      );
    case 'lantern':
      return (
        <g>
          <rect x="50" y="6" width="10" height="13" rx="5" fill="hsl(0 80% 55%)" />
          <rect x="52" y="18" width="6" height="3" rx="1.4" fill="hsl(45 95% 60%)" />
        </g>
      );
    default:
      return null;
  }
}

const MascotArt = memo(function MascotArt({
  species,
  size = 72,
  asleep = false,
  cheering = false,
  accessory = 'none',
  className,
}: MascotArtProps) {
  const p = MASCOTS[species];
  const gid = `sv-mascot-${species}`;

  const Visor = ({ cx, cy, rx = 9, ry = 6 }: { cx: number; cy: number; rx?: number; ry?: number }) =>
    asleep ? (
      <path
        d={`M${cx - rx} ${cy} q${rx} ${ry} ${rx * 2} 0`}
        stroke={p.accent}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    ) : (
      <g className="sv-mascot-blink" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="hsl(220 45% 10%)" />
        <ellipse cx={cx + rx * 0.28} cy={cy - ry * 0.2} rx={rx * 0.3} ry={ry * 0.42} fill={p.accent} />
      </g>
    );

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.hue} />
          <stop offset="100%" stopColor={p.hueSoft} />
        </linearGradient>
        <radialGradient id={`${gid}-glow`}>
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft ground glow */}
      <ellipse cx="50" cy="92" rx="26" ry="6" fill={`url(#${gid}-glow)`} />

      {species === 'dog' && (
        <g>
          <path d="M30 88 v-10 M42 88 v-10 M58 88 v-10 M70 88 v-10" stroke={p.hueSoft} strokeWidth="7" strokeLinecap="round" />
          <path d="M24 62 q-8 -12 -2 -20" stroke={p.hue} strokeWidth="6" strokeLinecap="round" fill="none" className={cheering ? 'sv-mascot-tail-fast' : 'sv-mascot-tail'} style={{ transformOrigin: '24px 62px' }} />
          <rect x="24" y="46" width="52" height="34" rx="17" fill={`url(#${gid}-body)`} />
          <circle cx="66" cy="40" r="20" fill={`url(#${gid}-body)`} />
          <path d="M52 28 q-8 2 -6 16 q6 2 9 -6 Z" fill={p.hueSoft} />
          <path d="M80 28 q8 2 6 16 q-6 2 -9 -6 Z" fill={p.hueSoft} />
          <ellipse cx="76" cy="48" rx="10" ry="7" fill="hsl(0 0% 98%)" opacity="0.9" />
          <circle cx="83" cy="46" r="3" fill="hsl(220 45% 12%)" />
          <Visor cx={66} cy={36} rx={11} ry={7} />
          <Accessory kind={accessory} accent={p.accent} />
        </g>
      )}

      {species === 'cat' && (
        <g>
          <path d="M34 88 v-8 M46 88 v-8 M58 88 v-8 M68 88 v-8" stroke={p.hueSoft} strokeWidth="6" strokeLinecap="round" />
          <path d="M26 74 q-14 -6 -8 -22 q3 -8 10 -6" stroke={p.hue} strokeWidth="6" strokeLinecap="round" fill="none" className="sv-mascot-tail" style={{ transformOrigin: '26px 74px' }} />
          <rect x="28" y="50" width="46" height="30" rx="15" fill={`url(#${gid}-body)`} />
          <circle cx="66" cy="42" r="18" fill={`url(#${gid}-body)`} />
          <path d="M52 30 L50 14 L62 26 Z" fill={p.hueSoft} />
          <path d="M80 30 L84 14 L70 25 Z" fill={p.hueSoft} />
          <Visor cx={66} cy={40} rx={11} ry={7} />
          <path d="M60 52 h12" stroke={p.accent} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
          <Accessory kind={accessory} accent={p.accent} />
        </g>
      )}

      {species === 'owl' && (
        <g>
          <path d="M42 90 h8 M56 90 h8" stroke={p.accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M50 22 q28 4 26 38 q-2 30 -26 30 q-24 0 -26 -30 q-2 -34 26 -38 Z" fill={`url(#${gid}-body)`} />
          <path d="M32 32 L28 16 L42 26 Z" fill={p.hueSoft} />
          <path d="M68 32 L72 16 L58 26 Z" fill={p.hueSoft} />
          <circle cx="40" cy="46" r="13" fill="hsl(220 45% 12%)" opacity="0.85" />
          <circle cx="60" cy="46" r="13" fill="hsl(220 45% 12%)" opacity="0.85" />
          <g className={asleep ? undefined : 'sv-mascot-blink'} style={{ transformOrigin: '50px 46px' }}>
            <circle cx="40" cy="46" r={asleep ? 0 : 5} fill={p.accent} />
            <circle cx="60" cy="46" r={asleep ? 0 : 5} fill={p.accent} />
          </g>
          {asleep && (
            <path d="M34 46 q6 5 12 0 M54 46 q6 5 12 0" stroke={p.accent} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          )}
          <path d="M50 54 L45 62 h10 Z" fill={p.accent} />
          <path d="M26 58 q-6 16 4 24 M74 58 q6 16 -4 24" stroke={p.hueSoft} strokeWidth="5" fill="none" strokeLinecap="round" className={cheering ? 'sv-mascot-wave' : undefined} />
          <Accessory kind={accessory} accent={p.accent} />
        </g>
      )}

      {species === 'fox' && (
        <g>
          <path d="M36 88 v-8 M48 88 v-8 M60 88 v-8 M70 88 v-8" stroke={p.hueSoft} strokeWidth="6" strokeLinecap="round" />
          <path d="M28 72 q-20 -4 -16 -24 q10 4 12 14" fill={p.hue} opacity="0.95" className="sv-mascot-tail" style={{ transformOrigin: '28px 72px' }} />
          <rect x="26" y="48" width="48" height="32" rx="16" fill={`url(#${gid}-body)`} />
          <path d="M66 26 q20 6 16 28 q-4 18 -20 16 q-16 -2 -16 -20 q0 -20 20 -24 Z" fill={`url(#${gid}-body)`} />
          <path d="M52 30 L48 12 L64 24 Z" fill={p.hueSoft} />
          <path d="M80 30 L88 14 L72 23 Z" fill={p.hueSoft} />
          <path d="M62 56 q10 10 20 2 q-8 8 -20 -2 Z" fill="hsl(0 0% 98%)" opacity="0.85" />
          <Visor cx={68} cy={40} rx={11} ry={7} />
          <Accessory kind={accessory} accent={p.accent} />
        </g>
      )}

      {species === 'penguin' && (
        <g>
          <path d="M38 90 q-8 2 -2 4 h12 Z" fill={p.accent} />
          <path d="M62 90 q8 2 2 4 h-12 Z" fill={p.accent} />
          <ellipse cx="50" cy="56" rx="26" ry="34" fill={`url(#${gid}-body)`} />
          <ellipse cx="50" cy="62" rx="16" ry="25" fill="hsl(210 40% 96%)" opacity="0.92" />
          <ellipse
            cx="22"
            cy="58"
            rx="7"
            ry="17"
            fill={p.hueSoft}
            className={cheering ? 'sv-mascot-wave' : undefined}
            style={{ transformOrigin: '24px 44px' }}
          />
          <ellipse cx="78" cy="58" rx="7" ry="17" fill={p.hueSoft} />
          <Visor cx={50} cy={38} rx={13} ry={7} />
          <path d="M44 50 h12 l-6 7 Z" fill={p.accent} />
          <Accessory kind={accessory} accent={p.accent} />
        </g>
      )}

      {species === 'camel' && (
        <g>
          <path d="M32 88 v-14 M44 88 v-14 M58 88 v-14 M70 88 v-14" stroke={p.hueSoft} strokeWidth="6" strokeLinecap="round" />
          <path d="M26 66 q6 -22 24 -22 q18 0 24 22 q-24 10 -48 0 Z" fill={`url(#${gid}-body)`} />
          <path d="M38 48 q4 -16 14 -16 q10 0 14 16 Z" fill={p.hue} />
          <path d="M68 58 q10 -6 8 -24 q-2 -14 6 -16 q10 -2 12 8 q2 12 -6 14" stroke={p.hue} strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="86" cy="24" r="10" fill={`url(#${gid}-body)`} />
          <path d="M80 15 L78 6 L86 13 Z" fill={p.hueSoft} />
          <Visor cx={88} cy={23} rx={7} ry={5} />
          <Accessory kind={accessory} accent={p.accent} />
        </g>
      )}
    </svg>
  );
});

export default MascotArt;
