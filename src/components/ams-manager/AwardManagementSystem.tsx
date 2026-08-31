// @ts-nocheck
/**
 * AWARD MANAGEMENT SYSTEM (AMS Manager module)
 * Sidebar-driven award administration: catalogue, creation, taxonomy,
 * libraries, rules and audit — all on the shared awards API layer.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Trash2, Copy, Archive, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  listAwards, createAward, cloneAward, deleteAward,
  publishAward, approveAward, archiveAward,
} from "@/lib/ams/awards.api";
import {
  AWARD_CATEGORIES, RARITIES, RARITY_META, DEPARTMENTS,
} from "@/lib/ams/types";

export type AwardSection =
  | "awards-overview" | "awards-all" | "awards-new" | "awards-categories"
  | "awards-libraries" | "awards-rules" | "awards-audit";

const TYPES = ["trophy", "badge", "achievement", "rank", "milestone", "streak"] as const;

function Panel({ title, description, children, actions }: any) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

export function AwardManagementSystem({
  section,
  onSection,
}: {
  section: AwardSection;
  onSection: (s: AwardSection) => void;
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [rarity, setRarity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const refresh = useCallback(async () => {
    const res = await listAwards({});
    setRows(res.rows);
  }, []);
  useEffect(() => { void refresh(); }, [refresh, section]);

  const filtered = useMemo(() => rows.filter((a) => {
    if (q && !`${a.name} ${a.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (rarity !== "all" && a.rarity !== rarity) return false;
    if (status !== "all" && a.status !== status) return false;
    return true;
  }), [rows, q, rarity, status]);

  const act = async (fn: (id: string) => Promise<unknown>, id: string, msg: string) => {
    await fn(id);
    await refresh();
    toast.success(msg);
  };

  if (section === "awards-overview") {
    const published = rows.filter((a) => a.status === "published").length;
    const drafts = rows.filter((a) => a.status === "draft").length;
    return (
      <Panel title="Award Management System" description="Design, approve and publish every recognition item in one place.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Total awards" value={rows.length} />
          <Stat label="Published" value={published} />
          <Stat label="Drafts" value={drafts} />
          <Stat label="Rarity tiers" value={RARITIES.length} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["awards-all", "All awards", "Browse, publish, clone and archive."],
            ["awards-new", "Create award", "Add a new trophy, badge or rank."],
            ["awards-categories", "Categories", "15 recognition categories."],
            ["awards-libraries", "Libraries", "Trophies, badges, ranks, achievements."],
            ["awards-rules", "Rules engine", "XP, levels, streaks, milestones, rewards."],
            ["awards-audit", "Audit trail", "Every change, with actor and timestamp."],
          ].map(([key, title, desc]) => (
            <button
              key={key}
              onClick={() => onSection(key as AwardSection)}
              className="rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/50"
            >
              <div className="font-semibold">{title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
            </button>
          ))}
        </div>
      </Panel>
    );
  }

  if (section === "awards-new") return <AwardCreate onCreated={async () => { await refresh(); onSection("awards-all"); }} />;

  if (section === "awards-categories") {
    return (
      <Panel title="Categories" description="Recognition categories available to every award.">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AWARD_CATEGORIES.map((c) => (
            <div key={c.value} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
              <span className="text-sm font-medium">{c.label}</span>
              <span className="text-xs text-muted-foreground">{rows.filter((a) => a.category === c.value).length}</span>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (section === "awards-libraries") {
    return (
      <Panel title="Libraries" description="Award inventory grouped by type.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TYPES.map((t) => {
            const items = rows.filter((a) => a.type === t);
            return (
              <div key={t} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold capitalize">{t}s</div>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {items.slice(0, 6).map((a) => <li key={a.id} className="truncate">{a.name}</li>)}
                  {items.length === 0 && <li>No {t} awards yet.</li>}
                </ul>
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }

  if (section === "awards-rules") {
    return (
      <Panel title="Rules engine" description="Rarity tiers and department accents that drive XP, levels and streaks.">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {RARITIES.map((r) => (
            <div key={r} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: RARITY_META[r].hue, boxShadow: `0 0 12px ${RARITY_META[r].glow}` }} />
                <span className="text-sm font-medium">{RARITY_META[r].label}</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">Tier {RARITY_META[r].tier}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {DEPARTMENTS.map((d) => (
            <div key={d.value} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: d.accent }} />
                <span className="text-sm font-medium">{d.label}</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground capitalize">{d.motif}</div>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (section === "awards-audit") {
    const entries = rows.flatMap((a) => a.audit.map((e: any) => ({ ...e, award: a.name })));
    entries.sort((a, b) => (a.at < b.at ? 1 : -1));
    return (
      <Panel title="Audit trail" description="Every award change with actor and timestamp.">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No award activity recorded yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2 text-left">When</th><th className="px-4 py-2 text-left">Award</th><th className="px-4 py-2 text-left">Action</th><th className="px-4 py-2 text-left">Actor</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(e.at).toLocaleString()}</td>
                    <td className="px-4 py-2">{e.award}</td>
                    <td className="px-4 py-2 capitalize">{e.action}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{e.actor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    );
  }

  // awards-all
  return (
    <Panel
      title="All awards"
      description="The complete award catalogue."
      actions={<Button className="gap-1.5" onClick={() => onSection("awards-new")}><Plus className="h-4 w-4" /> New award</Button>}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search awards…" className="h-9 pl-9" />
        </div>
        <Select value={rarity} onValueChange={setRarity}>
          <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Rarity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All rarities</SelectItem>
            {RARITIES.map((r) => <SelectItem key={r} value={r}>{RARITY_META[r].label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {["all", "draft", "approved", "published", "archived"].map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "All statuses" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <div className="text-sm font-medium">No awards yet</div>
          <p className="mt-1 text-xs text-muted-foreground">Create your first award to start the catalogue.</p>
          <Button className="mt-4 gap-1.5" onClick={() => onSection("awards-new")}><Plus className="h-4 w-4" /> Create award</Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Award</th>
                <th className="px-4 py-2 text-left w-28">Type</th>
                <th className="px-4 py-2 text-left w-32">Rarity</th>
                <th className="px-4 py-2 text-left w-28">Status</th>
                <th className="px-4 py-2 text-right w-52">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[380px]">{a.description || "—"}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{a.type}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: RARITY_META[a.rarity].hue }} />
                      {RARITY_META[a.rarity].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize">{a.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" title="Approve" onClick={() => act(approveAward, a.id, "Award approved")}><CheckCircle2 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" title="Publish" onClick={() => act(publishAward, a.id, "Award published")}><Send className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" title="Clone" onClick={() => act(cloneAward, a.id, "Award cloned")}><Copy className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" title="Archive" onClick={() => act(archiveAward, a.id, "Award archived")}><Archive className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" title="Delete" onClick={() => act(deleteAward, a.id, "Award deleted")}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function AwardCreate({ onCreated }: { onCreated: () => void | Promise<void> }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("trophy");
  const [category, setCategory] = useState("global");
  const [rarity, setRarity] = useState("common");
  const [xp, setXp] = useState("0");
  const [coins, setCoins] = useState("0");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim()) { toast.error("Award name is required"); return; }
    setBusy(true);
    try {
      await createAward({
        name: name.trim(), description, type, category, rarity,
        rewards: { xp: Number(xp) || 0, coins: Number(coins) || 0 },
      });
      toast.success("Award created");
      setName(""); setDescription("");
      await onCreated();
    } finally { setBusy(false); }
  };

  return (
    <Panel title="Create award" description="Define a new recognition item for the catalogue.">
      <div className="grid max-w-3xl gap-4 rounded-xl border border-border bg-card p-5">
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Top Performer 2026" />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What this award recognises…" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{AWARD_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Rarity</label>
            <Select value={rarity} onValueChange={setRarity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RARITIES.map((r) => <SelectItem key={r} value={r}>{RARITY_META[r].label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">XP reward</label>
            <Input value={xp} onChange={(e) => setXp(e.target.value)} inputMode="numeric" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Coin reward</label>
            <Input value={coins} onChange={(e) => setCoins(e.target.value)} inputMode="numeric" />
          </div>
        </div>
        <div>
          <Button onClick={submit} disabled={busy} className="gap-1.5"><Plus className="h-4 w-4" /> Create award</Button>
        </div>
      </div>
    </Panel>
  );
}
