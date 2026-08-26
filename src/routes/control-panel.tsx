// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search, LayoutGrid } from "lucide-react";
import logoAsset from "@/assets/softwarevala-logo-official.jpg.asset.json";
import { MODULES } from "@/lib/module-switch";

export const Route = createFileRoute("/control-panel")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Control Panel — Software Vala" },
      { name: "description", content: "Open any Software Vala workspace: Boss, CEO, Vala AI, managers and dashboards." },
      { property: "og:title", content: "Control Panel — Software Vala" },
      { property: "og:description", content: "Open any Software Vala workspace from one control panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ControlPanel,
});

const Q_KEY = "cp:q";
const SCROLL_KEY = "cp:scroll";
const ACTIVE_MODULE_KEY = "cp:active-module";

function ControlPanel() {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [q, setQ] = useState(() => {
    try { return sessionStorage.getItem(Q_KEY) ?? ""; } catch { return ""; }
  });

  // Restore scroll position exactly where the user left the panel.
  useEffect(() => {
    try {
      const y = Number(sessionStorage.getItem(SCROLL_KEY) ?? "0");
      if (y) requestAnimationFrame(() => listRef.current?.scrollTo({ top: y }));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem(Q_KEY, q); } catch { /* ignore */ }
  }, [q]);

  const persistScroll = () => {
    try { sessionStorage.setItem(SCROLL_KEY, String(listRef.current?.scrollTop ?? 0)); } catch { /* ignore */ }
  };

  const needle = q.trim().toLowerCase();
  const items = needle
    ? MODULES.filter((m) => m.label.toLowerCase().includes(needle) || m.path.toLowerCase().includes(needle))
    : MODULES;

  const open = (path: string) => {
    persistScroll();
    const module = MODULES.find((item) => item.path === path);
    try {
      if (module) sessionStorage.setItem(ACTIVE_MODULE_KEY, JSON.stringify(module));
    } catch { /* ignore */ }
    navigate({ href: path });
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Control Panel sidebar — the ONLY sidebar on this screen */}
      <aside className="flex w-20 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground sm:w-64">
        <div className="flex items-center gap-2.5 border-b border-border px-5 pb-4 pt-5">
          <img src={logoAsset.url} alt="Software Vala" className="h-10 w-10 rounded-full object-cover ring-2 ring-[oklch(0.45_0.2_260)]/60" />
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-sm font-bold leading-tight tracking-tight">Software Vala™</div>
            <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Control Panel</div>
          </div>
        </div>
        <div ref={listRef} onScroll={persistScroll} className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((m) => (
            <button
              key={m.path}
              onClick={() => open(m.path)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-sidebar-foreground/80 transition hover:bg-white/5 hover:text-foreground"
            >
              <span className="truncate text-[10px] sm:text-sm">{m.label}</span>
            </button>
          ))}
          {items.length === 0 && (
            <div className="px-3 py-4 text-xs text-muted-foreground">No module matches “{q}”.</div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
          <LayoutGrid className="h-4 w-4 text-brand" />
          <h1 className="text-sm font-semibold">Control Panel</h1>
          <div className="relative ml-auto w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search modules…"
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-6">
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((m) => (
              <button
                key={m.path}
                onClick={() => open(m.path)}
                className="btn-3d group rounded-xl border border-border bg-card p-4 text-left transition hover:border-brand/50"
              >
                <div className="text-sm font-semibold">{m.label}</div>
                <div className="mt-1 truncate text-[11px] text-muted-foreground">{m.path}</div>
              </button>
            ))}
          </div>
          {items.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">No module matches “{q}”.</div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ControlPanel;