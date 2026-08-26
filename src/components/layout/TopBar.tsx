import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell, Search, Sparkles, Trophy, Zap, ChevronDown, User2,
  LayoutDashboard, Shield, Award, ArrowUpCircle, Crown, Target,
  Gift, BarChart3, LineChart, Star, Settings, UsersRound,
  BookMarked, Fingerprint, Ribbon, Layers, Archive, CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RouteHistoryArrows } from "@/components/layout/RouteHistory";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

// AMS Manager top navigation — every item opens its own complete dashboard.
// No secondary sidebar. No nested navigation. This is the ONLY navigation
// surface inside the AMS Manager module.
const AMS_NAV: NavItem[] = [
  { to: "/command-center",              label: "Overview",      icon: LayoutDashboard },
  { to: "/role-manager",  label: "Role Manager",  icon: UsersRound },
  { to: "/passport",      label: "Passport",      icon: BookMarked },
  { to: "/identity",      label: "Identity",      icon: Fingerprint },
  { to: "/achievements",  label: "Achievements",  icon: Trophy },
  { to: "/awards",        label: "Awards",        icon: Award },
  { to: "/badges",        label: "Badges",        icon: Shield },
  { to: "/passport-vault", label: "Passport Vault", icon: BookMarked },
  { to: "/achievement-vault", label: "Achievement Vault", icon: Trophy },
  { to: "/award-vault",   label: "Award Vault",   icon: Award },
  { to: "/trophies",      label: "Trophies",      icon: Trophy },
  { to: "/certificates",  label: "Certificates",  icon: Ribbon },
  { to: "/membership-vault", label: "Membership Vault", icon: CreditCard },
  { to: "/rank-vault",    label: "Rank Vault",    icon: Crown },
  { to: "/verification-vault", label: "Verification Vault", icon: Shield },
  { to: "/xp",            label: "XP",            icon: Zap },
  { to: "/levels",        label: "Levels",        icon: ArrowUpCircle },
  { to: "/ranks",         label: "Ranks",         icon: Crown },
  { to: "/missions",      label: "Missions",      icon: Target },
  { to: "/rewards",       label: "Rewards",       icon: Gift },
  { to: "/leaderboards",  label: "Leaderboard",   icon: BarChart3 },
  { to: "/hall-of-fame",  label: "Hall of Fame",  icon: Star },
  { to: "/legacy",        label: "Legacy",        icon: Archive },
  { to: "/collections",   label: "Collections",   icon: Layers },
  { to: "/trophy-gallery", label: "Trophy Gallery", icon: Trophy },
  { to: "/role-showcase", label: "Role Rooms",    icon: Crown },
  { to: "/developer-progression", label: "Dev Progression", icon: ArrowUpCircle },
  { to: "/author-progression", label: "Author Progression", icon: ArrowUpCircle },
  { to: "/vendor-progression", label: "Vendor Progression", icon: ArrowUpCircle },

  { to: "/analytics",     label: "Analytics",     icon: LineChart },
  { to: "/settings",      label: "Settings",      icon: Settings },

];

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
      {/* Row 1 — brand + search + actions */}
      <div className="h-14 flex items-center gap-3 px-5">
        <Link to={"/command-center" as never} className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-trophy to-legendary flex items-center justify-center shadow-[0_0_20px_-4px_oklch(0.82_0.17_85/60%)]">
            <Trophy className="h-4.5 w-4.5 text-background" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight text-gradient-trophy">AMS Manager</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">Software Vala</div>
          </div>
        </Link>

        <div className="h-7 w-px bg-border mx-1" />

        <RouteHistoryArrows className="shrink-0" />

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search achievements, users, rewards…"
            className="pl-9 h-9 bg-muted/30 border-border/60"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted/60 px-1.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon" title="Achievement alerts" className="relative">
            <Trophy className="h-4 w-4 text-trophy" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-trophy glow-trophy" />
          </Button>
          <Button variant="ghost" size="icon" title="Notifications" className="relative">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="AI Assistant">
            <Sparkles className="h-4 w-4 text-trophy" />
          </Button>
          <Button variant="ghost" size="icon" title="Quick actions">
            <Zap className="h-4 w-4 text-xp" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-trophy to-legendary flex items-center justify-center text-xs font-semibold text-background">
                  A
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User2 className="h-4 w-4 mr-2" /> Profile</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={"/settings" as never}><Settings className="h-4 w-4 mr-2" /> Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 2 — horizontal nav (every item opens a complete dashboard) */}
      <nav className="h-11 flex items-center gap-1 px-3 overflow-x-auto border-t border-border/40 scrollbar-thin">
        {AMS_NAV.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                active
                  ? "text-trophy bg-trophy/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
              {active && <span className="absolute -bottom-[10px] left-2 right-2 h-[2px] rounded-full bg-trophy glow-trophy" />}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
