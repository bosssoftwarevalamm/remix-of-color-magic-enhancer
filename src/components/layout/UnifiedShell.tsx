// @ts-nocheck
/**
 * UNIFIED SHELL
 * =============
 * Module workspace chrome. The Control Panel (module switch dashboard) lives
 * at /control-panel and owns the global module sidebar. Inside a module we
 * render NO global sidebar — the module keeps its own internal sidebar, so
 * only ONE sidebar is ever on screen. The header exposes
 * "← Back to Control Panel" which returns to the panel with its search /
 * scroll state preserved.
 */
import { type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Bell, MessageSquare, Sparkles, ChevronLeft, Store } from "lucide-react";
import logoAsset from "@/assets/softwarevala-logo-official.jpg.asset.json";
import { MODULES } from "@/lib/module-switch";
import { Button } from "@/components/ui/button";

function titleFor(path: string) {
  const match = MODULES.filter((m) => m.path !== "/" && path.startsWith(m.path)).sort(
    (a, b) => b.path.length - a.path.length,
  )[0];
  if (match) return match.label;
  const seg = path.split("/").filter(Boolean)[0] ?? "workspace";
  return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function moduleFor(path: string) {
  const direct = MODULES.filter((module) => module.path !== "/" && path.startsWith(module.path)).sort(
    (a, b) => b.path.length - a.path.length,
  )[0];
  if (direct) return direct;
  try {
    const stored = sessionStorage.getItem("cp:active-module");
    if (stored) return JSON.parse(stored) as (typeof MODULES)[number];
  } catch { /* ignore */ }
  return { label: titleFor(path), path, navigation: ["Overview", "Reports", "Analytics", "Settings"] };
}

export function UnifiedShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const module = moduleFor(path);
  const title = module.label;
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-6">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/control-panel" })}
          className="h-9 gap-1.5 px-3 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Back to Control Panel</span>
          <span className="sm:hidden">Back</span>
        </Button>

        <div className="flex min-w-0 items-center gap-2">
          <img src={logoAsset.url} alt="Software Vala" className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[oklch(0.45_0.2_260)]/60" />
          <span className="truncate text-sm font-semibold">{title}</span>
        </div>

        <div className="relative ml-2 hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder={`Search in ${title}…`}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="hidden h-9 gap-2 px-3 text-xs lg:inline-flex">
            <Store className="h-3.5 w-3.5" />
            Marketplace
          </Button>
          <Button className="hidden h-9 gap-2 px-3 text-xs md:inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            AI Chat
          </Button>
          <IconBtn icon={MessageSquare} title="Messages" />
          <IconBtn icon={Bell} title="Notifications" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* The selected module owns all navigation below this header. Never
            synthesize a second/global sidebar inside a module workspace. */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function IconBtn({ icon: Icon, title }) {
  return (
    <Button
      variant="outline"
      size="icon"
      title={title}
      className="h-9 w-9"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export default UnifiedShell;
