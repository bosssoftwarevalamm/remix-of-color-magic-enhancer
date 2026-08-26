// @ts-nocheck
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp, Clock, X } from 'lucide-react';
import { useLivingSettings } from '@/contexts/LivingSettingsContext';
import { emitLivingEvent } from '@/lib/living/events';
import { cn } from '@/lib/utils';

/**
 * LivingSearchBar — the centrepiece of the homepage.
 * Focus lifts and glows, typing wakes the mascot behind it, and suggestions
 * animate in from the AI layer. Fully keyboard operable.
 */

const TRENDING = [
  'Restaurant POS',
  'Sales CRM',
  'HRM Suite',
  'Retail Billing',
  'School ERP',
  'Accounting Pro',
];

const CATALOG = [
  'Restaurant POS', 'Retail POS', 'SaaS POS', 'Sales CRM', 'Lead Manager',
  'Corporate HRM', 'Simple HRM', 'SaaS HRM', 'Pro Accounting', 'Accounting Suite',
  'School Software', 'Inventory Manager', 'Billing & Invoicing', 'Marketplace Portal',
];

const RECENT_KEY = 'sv:living-recent-searches';

interface LivingSearchBarProps {
  onSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const LivingSearchBar = forwardRef<HTMLDivElement, LivingSearchBarProps>(function LivingSearchBar(
  { onSubmit, placeholder = 'Search software, demos, industries…', className },
  ref
) {
  const { motionOff, speedFactor } = useLivingSettings();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<number>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CATALOG.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const panelItems = query.trim() ? suggestions : [...recent.slice(0, 3), ...TRENDING].slice(0, 7);
  const showPanel = focused && panelItems.length > 0;

  const commit = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const next = [v, ...recent.filter((r) => r !== v)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setQuery(v);
    setFocused(false);
    inputRef.current?.blur();
    emitLivingEvent('search:complete', { query: v });
    onSubmit?.(v);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => {
      if (value.trim().length >= 2) emitLivingEvent('search:typing', { query: value });
    }, 320);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && showPanel) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % panelItems.length);
    } else if (e.key === 'ArrowUp' && showPanel) {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? panelItems.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit(activeIndex >= 0 ? panelItems[activeIndex] : query);
    } else if (e.key === 'Escape') {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={ref} className={cn('relative w-full max-w-2xl', className)}>
      <motion.div
        animate={
          motionOff
            ? undefined
            : { y: focused ? -4 : 0, scale: focused ? 1.015 : 1 }
        }
        transition={{ duration: 0.28 * speedFactor, ease: [0.2, 0.8, 0.3, 1] }}
        className={cn(
          'relative flex items-center gap-3 rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur-xl transition-shadow duration-300',
          focused
            ? 'border-primary/60 shadow-[0_18px_60px_-18px_hsl(var(--primary)/0.65)]'
            : 'border-border/50 shadow-[0_10px_36px_-20px_hsl(var(--primary)/0.4)]'
        )}
      >
        <Search className={cn('h-5 w-5 shrink-0 transition-colors', focused ? 'text-primary' : 'text-muted-foreground')} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            setFocused(true);
            emitLivingEvent('search:start');
          }}
          onBlur={() => window.setTimeout(() => setFocused(false), 140)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search Software Vala marketplace"
          aria-expanded={showPanel}
          aria-controls="sv-search-suggestions"
          role="combobox"
          aria-autocomplete="list"
          className="min-h-[28px] w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => commit(query)}
          className="hidden min-h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] sm:inline-flex"
        >
          <Sparkles className="h-4 w-4" />
          Search
        </button>
      </motion.div>

      <AnimatePresence>
        {showPanel && (
          <motion.ul
            id="sv-search-suggestions"
            role="listbox"
            initial={motionOff ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={motionOff ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 * speedFactor }}
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur-xl"
          >
            {panelItems.map((item, i) => {
              const isRecent = !query.trim() && recent.includes(item);
              return (
                <li key={`${item}-${i}`} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(item)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors',
                      i === activeIndex ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isRecent ? (
                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <TrendingUp className="h-4 w-4 shrink-0 text-primary" />
                    )}
                    <span className="truncate">{item}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});

export default LivingSearchBar;
