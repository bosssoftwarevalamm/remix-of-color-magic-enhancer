// @ts-nocheck
/**
 * Slim top bar that sits next to the sidebar (search + actions only).
 * Navigation lives in SideNav.
 */
import { Link } from "@tanstack/react-router";
import { Bell, Command, LifeBuoy, Menu, Search, Settings, Sparkles, ChevronDown, User2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteHistoryArrows } from "@/components/layout/RouteHistory";

export function ShellTopBar({ onOpenMenu }: { onOpenMenu?: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 lg:px-6">
        <button
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link to={"/command-center" as never} className="hidden shrink-0 items-center gap-2 sm:flex lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow font-bold text-primary-foreground">
            SV
          </span>
        </Link>

        <RouteHistoryArrows className="hidden shrink-0 sm:flex" />

        <div className="relative min-w-0 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="global-search"
            placeholder="Search achievements, users, rewards…"
            className="h-11 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40 sm:h-9"
          />
        </div>

        <button
          type="button"
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:h-9"
          title="Command palette — ⌘K / Ctrl+K"
        >
          <Command className="h-4 w-4" aria-hidden="true" />
          <span className="hidden lg:inline">⌘K</span>
        </button>

        <button className="hidden h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground lg:grid" aria-label="AI assistant">
          <Sparkles className="h-4 w-4" />
        </button>
        <button className="hidden h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground lg:grid" aria-label="Support">
          <LifeBuoy className="h-4 w-4" />
        </button>
        <button className="relative grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-pink" />
        </button>
        <Link to={"/settings" as never} className="hidden h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground lg:grid" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-border px-1.5 pr-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-[11px] font-semibold text-primary-foreground">
                A
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User2 className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={"/settings" as never}><Settings className="mr-2 h-4 w-4" /> Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default ShellTopBar;
