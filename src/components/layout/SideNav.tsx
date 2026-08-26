// @ts-nocheck
/**
 * Left sidebar navigation (converted from the previous horizontal TopBar nav).
 * Visual layer only — same destinations, same routing behaviour.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown, PanelLeftClose, PanelLeftOpen, Search, X,
  LayoutDashboard, Shield, Award, ArrowUpCircle, Crown, Target,
  Gift, BarChart3, LineChart, Star, Settings, UsersRound, Trophy, Zap,
  BookMarked, Fingerprint, Ribbon, Layers, Archive, CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "sv:ams:sidebar:collapsed";

export const PRIMARY_NAV = [
  { to: "/command-center", label: "Overview", icon: LayoutDashboard },
  { to: "/role-manager", label: "Role Manager", icon: UsersRound },
  { to: "/analytics", label: "Analytics", icon: LineChart },
];

export const NAV_GROUPS = [
  {
    label: "Identity",
    items: [
      { to: "/passport", label: "Passport", icon: BookMarked },
      { to: "/identity", label: "Identity", icon: Fingerprint },
      { to: "/role-showcase", label: "Role Rooms", icon: Crown },
    ],
  },
  {
    label: "Recognition",
    items: [
      { to: "/achievements", label: "Achievements", icon: Trophy },
      { to: "/awards", label: "Awards", icon: Award },
      { to: "/badges", label: "Badges", icon: Shield },
      { to: "/trophies", label: "Trophies", icon: Trophy },
      { to: "/certificates", label: "Certificates", icon: Ribbon },
      { to: "/hall-of-fame", label: "Hall of Fame", icon: Star },
      { to: "/legacy", label: "Legacy", icon: Archive },
      { to: "/collections", label: "Collections", icon: Layers },
      { to: "/trophy-gallery", label: "Trophy Gallery", icon: Trophy },
    ],
  },
  {
    label: "Vaults",
    items: [
      { to: "/passport-vault", label: "Passport Vault", icon: BookMarked },
      { to: "/achievement-vault", label: "Achievement Vault", icon: Trophy },
      { to: "/award-vault", label: "Award Vault", icon: Award },
      { to: "/membership-vault", label: "Membership Vault", icon: CreditCard },
      { to: "/rank-vault", label: "Rank Vault", icon: Crown },
      { to: "/verification-vault", label: "Verification Vault", icon: Shield },
    ],
  },
  {
    label: "Progression",
    items: [
      { to: "/xp", label: "XP", icon: Zap },
      { to: "/levels", label: "Levels", icon: ArrowUpCircle },
      { to: "/ranks", label: "Ranks", icon: Crown },
      { to: "/missions", label: "Missions", icon: Target },
      { to: "/rewards", label: "Rewards", icon: Gift },
      { to: "/leaderboards", label: "Leaderboard", icon: BarChart3 },
      { to: "/developer-progression", label: "Dev Progression", icon: ArrowUpCircle },
      { to: "/author-progression", label: "Author Progression", icon: ArrowUpCircle },
      { to: "/vendor-progression", label: "Vendor Progression", icon: ArrowUpCircle },
    ],
  },
  {
    label: "Admin",
    items: [{ to: "/settings", label: "Settings", icon: Settings }],
  },
];

export const ALL_NAV = [...PRIMARY_NAV, ...NAV_GROUPS.flatMap((g) => g.items)];

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch { /* ignore */ }
  }, []);

  const toggleCollapsed = () =>
    setCollapsed((v) => {
      const next = !v;
      try { localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });

  return { collapsed, toggleCollapsed, mobileOpen, setMobileOpen };
}

export function SideNav({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  const groupOpen = (label: string, items) =>
    openGroups[label] ?? items.some((i) => isActive(i.to));

  const ItemLink = ({ item }) => (
    <Link
      to={item.to as never}
      preload="intent"
      onClick={onCloseMobile}
      title={collapsed ? item.label : undefined}
      aria-current={isActive(item.to) ? "page" : undefined}
      className={cn(
        "group/item flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-200",
        collapsed && "justify-center px-0",
        isActive(item.to)
          ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  const content = (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 shrink-0 items-center gap-2 border-b border-border px-3", collapsed && "justify-center px-0")}>
        <Link to={"/command-center" as never} className="flex min-w-0 items-center gap-2" onClick={onCloseMobile}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow font-bold text-primary-foreground">
            SV
          </span>
          {!collapsed && <span className="truncate text-sm font-semibold tracking-tight">AMS Manager</span>}
        </Link>
        {!collapsed && (
          <button
            onClick={onToggleCollapsed}
            className="ml-auto hidden h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground lg:grid"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onCloseMobile}
          className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={onToggleCollapsed}
          className="mx-auto mt-3 hidden h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground lg:grid"
          aria-label="Expand sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {!collapsed && (
        <div className="shrink-0 px-3 pt-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="sidebar-module-search" className="sr-only">Find a module</label>
            <input
              id="sidebar-module-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a module…  (/)"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      <nav className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {PRIMARY_NAV.map((item) => <ItemLink key={item.to} item={item} />)}
        </div>

        {(filtered ?? NAV_GROUPS).map((group) => {
          const open = filtered ? true : groupOpen(group.label, group.items);
          if (collapsed) {
            return (
              <div key={group.label} className="space-y-0.5 border-t border-border/60 pt-2">
                {group.items.map((item) => <ItemLink key={item.to} item={item} />)}
              </div>
            );
          }
          return (
            <div key={group.label}>
              <button
                onClick={() => setOpenGroups((s) => ({ ...s, [group.label]: !open }))}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {group.label}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
              </button>
              {open && (
                <div className="mt-0.5 space-y-0.5">
                  {group.items.map((item) => <ItemLink key={item.to} item={item} />)}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-background/80 backdrop-blur-xl transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-[264px]",
        )}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onCloseMobile} aria-label="Close menu overlay" />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-border bg-background shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

export default SideNav;
