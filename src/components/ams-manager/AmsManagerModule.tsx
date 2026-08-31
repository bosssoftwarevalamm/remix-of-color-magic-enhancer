// @ts-nocheck
/**
 * AMS MANAGER MODULE
 * Standalone module shell with its own left sidebar (no top tab bar):
 *  - AMS Center sections (offers, rewards, missions, bonuses, wallet, games…)
 *  - Award Management System (catalogue, creation, taxonomy, rules, audit)
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft, Menu, Award, Trophy, LayoutGrid, Plus, Tags,
  Library, SlidersHorizontal, History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AMSCenterWorkspace, TABS, type Tab } from "@/components/dashboard/AMSCenterWorkspace";
import { AwardManagementSystem, type AwardSection } from "./AwardManagementSystem";

type Section = { key: string; label: string; icon: any };

const AWARD_ITEMS: Section[] = [
  { key: "awards-overview",   label: "Overview",     icon: Award },
  { key: "awards-all",        label: "All Awards",   icon: Trophy },
  { key: "awards-new",        label: "Create Award", icon: Plus },
  { key: "awards-categories", label: "Categories",   icon: Tags },
  { key: "awards-libraries",  label: "Libraries",    icon: Library },
  { key: "awards-rules",      label: "Rules Engine", icon: SlidersHorizontal },
  { key: "awards-audit",      label: "Audit Trail",  icon: History },
];

export function AmsManagerModule() {
  const [active, setActive] = useState<string>("ams:overview");
  const [collapsed, setCollapsed] = useState(false);

  const isAward = active.startsWith("awards-");
  const amsTab = (active.startsWith("ams:") ? active.slice(4) : "overview") as Tab;

  const Item = ({ item, activeKey }: { item: Section; activeKey: string }) => (
    <button
      onClick={() => setActive(item.key)}
      title={item.label}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition",
        activeKey === item.key
          ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  );

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className={cn("shrink-0 border-r border-border bg-sidebar transition-[width]", collapsed ? "w-16" : "w-64")}>
        <div className="flex items-center gap-2 border-b border-border px-3 py-4">
          <button onClick={() => setCollapsed((c) => !c)} className="rounded-md p-1.5 hover:bg-muted/50" aria-label="Toggle sidebar">
            <Menu className="h-4 w-4" />
          </button>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">AMS Manager</div>
              <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Module</div>
            </div>
          )}
        </div>

        <nav className="space-y-4 overflow-y-auto p-3">
          <div className="space-y-1">
            {!collapsed && <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">AMS Center</div>}
            {TABS.map((t) => (
              <Item key={t.key} item={{ key: `ams:${t.key}`, label: t.label, icon: t.icon }} activeKey={active} />
            ))}
          </div>

          <div className="space-y-1">
            {!collapsed && <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Award Management System</div>}
            {AWARD_ITEMS.map((i) => <Item key={i.key} item={i} activeKey={active} />)}
          </div>

          <div className="border-t border-border pt-3">
            <Link
              to="/command-center"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Command Center</span>}
            </Link>
          </div>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">
        <header className="flex h-14 items-center gap-2 border-b border-border px-5">
          <LayoutGrid className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-semibold">
            AMS Manager {isAward ? "· Award Management System" : "· AMS Center"}
          </h1>
        </header>
        <div className="p-5 lg:p-6">
          {isAward ? (
            <AwardManagementSystem section={active as AwardSection} onSection={(s) => setActive(s)} />
          ) : (
            <AMSCenterWorkspace hideTabs hideHeader tab={amsTab} onTabChange={(t) => setActive(`ams:${t}`)} />
          )}
        </div>
      </main>
    </div>
  );
}

export default AmsManagerModule;
