// @ts-nocheck
/**
 * ROLE-BASED AMS DASHBOARD
 * Signed-in user ka apna AMS world — role DNA (identity, journey, awards,
 * trophies, passport) + poora AMS Center flow, left sidebar ke saath.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Menu, LogOut, Sparkles, Compass, Trophy, IdCard, Route as RouteIcon,
  ShieldCheck, LayoutGrid, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ROLES, type RoleSlug } from "@/lib/ams/roles";
import { ROLE_THEMES } from "@/lib/ams/role-themes";
import { RoleAchievementShowcase } from "@/components/ams/shared/RoleAchievementShowcase";
import { AMSCenterWorkspace, TABS, type Tab } from "@/components/dashboard/AMSCenterWorkspace";
import { useAmsIdentity, isAmsRoleSlug } from "@/lib/ams/role-access";

const MY_SECTIONS = [
  { key: "me:identity", label: "My Identity", icon: IdCard },
  { key: "me:journey", label: "My Journey", icon: RouteIcon },
  { key: "me:awards", label: "Awards & Trophies", icon: Trophy },
  { key: "me:goals", label: "Goals & Language", icon: Compass },
];

export function AmsRoleDashboard({ roleParam }: { roleParam?: string }) {
  const identity = useAmsIdentity();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("me:identity");
  const [viewSlug, setViewSlug] = useState<RoleSlug | null>(null);

  useEffect(() => {
    if (!identity.loading && !identity.signedIn) {
      navigate({ to: "/login", search: { redirect: "/ams-dashboard" }, replace: true });
    }
  }, [identity.loading, identity.signedIn, navigate]);

  useEffect(() => {
    if (roleParam && isAmsRoleSlug(roleParam)) setViewSlug(roleParam);
  }, [roleParam]);

  const slug: RoleSlug = viewSlug ?? identity.roleSlug;
  const role = useMemo(() => ROLES.find((r) => r.slug === slug) ?? ROLES[0], [slug]);
  const theme = ROLE_THEMES[role.slug];

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  if (identity.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-background text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your AMS world…
      </div>
    );
  }
  if (!identity.signedIn) return null;

  const displayName =
    identity.fullName || identity.email?.split("@")[0] || `${role.name} Member`;
  const holderId = `${role.passportPrefix}-${(identity.userId ?? "0000").slice(0, 4).toUpperCase()}`;
  const amsTab = (active.startsWith("ams:") ? active.slice(4) : "overview") as Tab;

  const Item = ({ item }: { item: { key: string; label: string; icon: any } }) => (
    <button
      onClick={() => setActive(item.key)}
      title={item.label}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition",
        active === item.key
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
      {/* ── Sidebar ── */}
      <aside className={cn("shrink-0 border-r border-border bg-sidebar transition-[width]", collapsed ? "w-16" : "w-64")}>
        <div className="flex items-center gap-2 border-b border-border px-3 py-4">
          <button onClick={() => setCollapsed((c) => !c)} className="rounded-md p-1.5 hover:bg-muted/50" aria-label="Toggle sidebar">
            <Menu className="h-4 w-4" />
          </button>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">My AMS</div>
              <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{role.name}</div>
            </div>
          )}
        </div>

        <nav className="space-y-4 overflow-y-auto p-3">
          <div className="space-y-1">
            {!collapsed && <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">My World</div>}
            {MY_SECTIONS.map((s) => <Item key={s.key} item={s} />)}
          </div>

          <div className="space-y-1">
            {!collapsed && <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">AMS Center</div>}
            {TABS.map((t) => (
              <Item key={t.key} item={{ key: `ams:${t.key}`, label: t.label, icon: t.icon }} />
            ))}
          </div>

          <div className="space-y-1 border-t border-border pt-3">
            <Link to="/ams-manager" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground">
              <LayoutGrid className="h-4 w-4 shrink-0" />
              {!collapsed && <span>AMS Manager</span>}
            </Link>
            <button onClick={signOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground">
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="min-w-0 flex-1">
        {/* Role hero */}
        <header className="relative overflow-hidden border-b border-border" style={{ background: theme.cover }}>
          <div className="relative flex flex-wrap items-end justify-between gap-4 px-6 py-8">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.35em]" style={{ color: `${theme.accent}cc` }}>
                {theme.environmentLabel} · {role.archetype}
              </div>
              <h1 className="mt-1 text-3xl font-bold leading-tight text-white" style={{ fontFamily: theme.displayFont }}>
                {role.greeting}, {displayName}
              </h1>
              <p className="mt-2 max-w-2xl text-sm italic text-white/75">"{role.motto}" — {role.welcome}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full px-2.5 py-1 font-mono" style={{ background: theme.metallic, color: theme.ink }}>{holderId}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-2.5 py-1 text-white/85">
                  <ShieldCheck className="h-3 w-3" /> {identity.primaryAppRole?.replace("_", " ") ?? "member"}
                </span>
                <span className="rounded-full border border-white/25 px-2.5 py-1 text-white/70">{identity.email}</span>
              </div>
            </div>

            {identity.canSwitchRole && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] uppercase tracking-wider text-white/60">Preview role</span>
                <select
                  value={slug}
                  onChange={(e) => setViewSlug(e.target.value as RoleSlug)}
                  className="rounded-md border border-white/25 bg-black/40 px-2 py-1 text-xs text-white"
                >
                  {ROLES.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </header>

        <div className="p-6">
          {active === "me:identity" && <IdentityPanel role={role} theme={theme} name={displayName} id={holderId} />}
          {active === "me:journey" && <JourneyPanel role={role} theme={theme} />}
          {active === "me:awards" && (
            <div className="space-y-6">
              <SectionTitle icon={Trophy} title={role.awardStyle} caption={role.trophyStyle} />
              <RoleAchievementShowcase defaultRole={role.slug} name={displayName} />
            </div>
          )}
          {active === "me:goals" && <GoalsPanel role={role} theme={theme} />}
          {active.startsWith("ams:") && (
            <AMSCenterWorkspace tab={amsTab} onTabChange={() => {}} hideTabs hideHeader />
          )}
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, caption }: any) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-[11px] text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}

function Card({ label, children }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-sm text-foreground/90">{children}</div>
    </div>
  );
}

function IdentityPanel({ role, theme, name, id }: any) {
  return (
    <div className="space-y-6">
      <SectionTitle icon={IdCard} title="Identity & Passport" caption={role.philosophy} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Holder">{name} · <span className="font-mono text-xs">{id}</span></Card>
        <Card label="Archetype">{role.archetype} — {role.behavior.join(" · ")}</Card>
        <Card label="Verification">{role.passport.verification}</Card>
        <Card label="Vision">{role.vision}</Card>
        <Card label="Mission">{role.mission}</Card>
        <Card label="Signature">{role.signature}</Card>
      </div>
      <div className="rounded-xl border border-border p-4" style={{ background: `${theme.primary}0d` }}>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Passport chapters</div>
        <ol className="mt-2 grid gap-2 md:grid-cols-4">
          {role.passport.timeline.map((c: string, i: number) => (
            <li key={c} className="rounded-lg border border-border bg-card px-3 py-2 text-xs">
              <span className="mr-1 font-mono text-[10px]" style={{ color: theme.primary }}>{String(i + 1).padStart(2, "0")}</span>{c}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function JourneyPanel({ role, theme }: any) {
  return (
    <div className="space-y-6">
      <SectionTitle icon={RouteIcon} title="Career Journey" caption={role.legacyLine} />
      <div className="space-y-2">
        {role.journey.map((stage: any, i: number) => (
          <div key={stage.key} className="flex gap-3 rounded-xl border border-border bg-card p-4">
            <div className="mt-0.5 h-7 w-7 shrink-0 rounded-full text-center text-xs font-bold leading-7"
              style={{ background: `${theme.primary}22`, color: theme.primary }}>{i + 1}</div>
            <div>
              <div className="text-sm font-semibold">{stage.label}</div>
              <p className="text-xs text-muted-foreground">{stage.narrative}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card label="Career path">{role.careerPath.join(" → ")}</Card>
        <Card label="Reputation pillars">{role.reputationPillars.join(" · ")}</Card>
      </div>
    </div>
  );
}

function GoalsPanel({ role, theme }: any) {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Sparkles} title="Goals, Language & Motivation" caption={role.successDefinition} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card label="Motivation">{role.motivation}</Card>
        <Card label="Celebration">{role.celebration}</Card>
        <Card label="Congratulations">{role.congratulations}</Card>
        <Card label="Collections">{role.collections.join(" · ")}</Card>
      </div>
      <div className="rounded-xl border border-border p-4" style={{ background: `${theme.accent}0d` }}>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Domain language</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {role.language.map((w: string) => (
            <span key={w} className="rounded-full border border-border px-2.5 py-1 text-[11px]">{w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
