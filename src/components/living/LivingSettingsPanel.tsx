// @ts-nocheck
import { memo } from 'react';
import { Settings2, RotateCcw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLivingSettings, type AnimationDensity, type AnimationSpeed } from '@/contexts/LivingSettingsContext';
import { cn } from '@/lib/utils';

/**
 * LivingSettingsPanel — visitor control over the ambient experience.
 * Every toggle is persisted and takes effect immediately.
 */

const SPEEDS: AnimationSpeed[] = ['slow', 'normal', 'brisk'];
const DENSITIES: AnimationDensity[] = ['minimal', 'balanced', 'rich'];

const LivingSettingsPanel = memo(function LivingSettingsPanel({ className }: { className?: string }) {
  const { settings, update, reset } = useLivingSettings();

  const toggles: Array<{ key: keyof typeof settings; label: string; hint: string }> = [
    { key: 'mascotsEnabled', label: 'Mascots', hint: 'Show the Software Vala characters' },
    { key: 'weatherEnabled', label: 'Ambient weather', hint: 'Drifting particles and seasonal flourishes' },
    { key: 'seasonalEnabled', label: 'Seasonal themes', hint: 'Festive accessories and accents' },
    { key: 'animationsEnabled', label: 'Animations', hint: 'Master switch for decorative motion' },
    { key: 'reduceMotion', label: 'Reduce motion', hint: 'Static, accessibility-first presentation' },
    { key: 'performanceMode', label: 'Performance mode', hint: 'Fewer ambient objects on slower devices' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Open experience settings"
          className={cn('min-h-11 min-w-11 rounded-full border-border/60 bg-background/70 backdrop-blur-md', className)}
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Experience settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-8 gap-1.5 text-xs text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>

        <div className="space-y-3">
          {toggles.map((t) => (
            <div key={t.key} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Label htmlFor={`living-${t.key}`} className="text-sm text-foreground">
                  {t.label}
                </Label>
                <p className="text-xs text-muted-foreground">{t.hint}</p>
              </div>
              <Switch
                id={`living-${t.key}`}
                checked={Boolean(settings[t.key])}
                onCheckedChange={(v) => update(t.key as 'mascotsEnabled', v)}
              />
            </div>
          ))}

          <div>
            <span className="text-sm text-foreground">Animation speed</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update('speed', s)}
                  aria-pressed={settings.speed === s}
                  className={cn(
                    'min-h-11 rounded-xl border text-xs font-medium capitalize transition-colors',
                    settings.speed === s
                      ? 'border-primary bg-primary/15 text-foreground'
                      : 'border-border/60 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm text-foreground">Ambient density</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {DENSITIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update('density', d)}
                  aria-pressed={settings.density === d}
                  className={cn(
                    'min-h-11 rounded-xl border text-xs font-medium capitalize transition-colors',
                    settings.density === d
                      ? 'border-primary bg-primary/15 text-foreground'
                      : 'border-border/60 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {settings.batterySaver && (
            <p className="rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
              Battery saver detected — ambient effects are paused automatically.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

export default LivingSettingsPanel;
