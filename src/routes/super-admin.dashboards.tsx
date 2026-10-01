import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  SWITCH_GROUPS,
  SWITCH_BACKUP_KEY,
  SWITCH_LICENSE_KEY,
  DASHBOARD_DETAILS_UPDATED_EVENT,
  targetKey,
  type SwitchTarget,
} from "@/lib/super-admin/role-dashboards";
import {
  listDashboardDetails,
  saveDashboardDetail,
  type DashboardDetail,
} from "@/lib/super-admin/dashboard-details.functions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/super-admin/dashboards")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard Details — Super Admin" },
      { name: "description", content: "Edit dashboard titles, descriptions and AI suggestion reasons." },
      { property: "og:title", content: "Dashboard Details — Super Admin" },
      { property: "og:description", content: "Edit dashboard titles, descriptions and AI suggestion reasons." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardDetailsPage,
});

const hrefOf = (t: SwitchTarget) =>
  t.kind === "module" ? `/m/${t.id}` : t.kind === "star" ? `/star/${t.id}` : t.path;

function DashboardDetailsPage() {
  const list = useServerFn(listDashboardDetails);
  const save = useServerFn(saveDashboardDetail);
  const [keys, setKeys] = useState<{ licenseKey: string; backupKey: string } | null>(null);
  const [details, setDetails] = useState<Record<string, DashboardDetail>>({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SwitchTarget>(SWITCH_GROUPS[0].items[0]);
  const [form, setForm] = useState({ title: "", description: "", aiReason: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const licenseKey = sessionStorage.getItem(SWITCH_LICENSE_KEY) ?? "";
    const backupKey = sessionStorage.getItem(SWITCH_BACKUP_KEY) ?? "";
    if (!licenseKey || !backupKey) {
      setError("Super Admin switch locked — unlock it from the top bar first.");
      return;
    }
    setKeys({ licenseKey, backupKey });
    list({ data: { licenseKey, backupKey } }).then((r) => {
      if (!r.ok) return setError(r.reason);
      setDetails(Object.fromEntries(r.rows.map((x) => [x.target_key, x])));
    });
  }, [list]);

  useEffect(() => {
    const d = details[targetKey(selected)];
    setForm({ title: d?.title ?? selected.label, description: d?.description ?? "", aiReason: d?.ai_reason ?? "" });
  }, [selected, details]);

  const groups = useMemo(() => {
    const q = search.toLowerCase();
    return SWITCH_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) =>
        (details[targetKey(i)]?.title ?? i.label).toLowerCase().includes(q),
      ),
    })).filter((g) => g.items.length);
  }, [search, details]);

  const onSave = async () => {
    if (!keys || !form.title.trim()) return;
    setBusy(true);
    try {
      const r = await save({ data: { ...keys, targetKey: targetKey(selected), ...form } });
      if (!r.ok) return toast.error(r.reason);
      const k = targetKey(selected);
        setDetails((p) => ({
          ...p,
          [k]: { target_key: k, title: form.title.trim(), description: form.description.trim(), ai_reason: form.aiReason.trim(), updated_at: new Date().toISOString() },
        }));
        // Tell any open AI dashboard finder to refresh with the new details.
        window.dispatchEvent(new Event(DASHBOARD_DETAILS_UPDATED_EVENT));
        toast.success("Dashboard details saved");
    } catch {
      toast.error("Could not save — please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (error)
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center p-6">
        <div className="text-center space-y-3">
          <p className="text-destructive font-medium">{error}</p>
          <Link to="/" className="text-primary underline">Go to home</Link>
        </div>
      </div>
    );

  const saved = details[targetKey(selected)];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard Details</h1>
          <p className="text-sm text-muted-foreground">Edit title, description and AI suggestion reason</p>
        </div>
        <Link to="/" className="text-sm text-primary underline">Back</Link>
      </header>
      <div className="grid md:grid-cols-[300px_1fr] gap-0">
        <aside className="border-r border-border p-4 space-y-3 md:h-[calc(100vh-73px)] overflow-y-auto">
          <Input placeholder="Search dashboards…" value={search} onChange={(e) => setSearch(e.target.value)} />
          {groups.map((g) => (
            <div key={g.group}>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mt-3 mb-1">{g.group}</div>
              {g.items.map((i) => {
                const k = targetKey(i);
                const active = k === targetKey(selected);
                return (
                  <button
                    key={k}
                    onClick={() => setSelected(i)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded flex justify-between gap-2 ${active ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                  >
                    <span className="truncate">{details[k]?.title ?? i.label}</span>
                    {details[k] && <span className="text-[10px] text-primary">edited</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </aside>
        <main className="p-6 max-w-2xl space-y-5">
          <div className="text-sm text-muted-foreground">
            Original: <span className="text-foreground">{selected.label}</span> ·{" "}
            <a href={hrefOf(selected)} className="text-primary underline">{hrefOf(selected)}</a>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Title</span>
            <Input value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Description</span>
            <Textarea rows={4} maxLength={1000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Is dashboard mein kya hai — AI isse better suggest karega" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">AI suggestion reason</span>
            <Textarea rows={2} maxLength={300} value={form.aiReason} onChange={(e) => setForm({ ...form, aiReason: e.target.value })} placeholder="Khali chhodo to AI apna reason dega" />
          </label>
          <div className="flex items-center gap-3">
            <Button onClick={onSave} disabled={busy || !form.title.trim()}>{busy ? "Saving…" : "Save"}</Button>
            {saved && <span className="text-xs text-muted-foreground">Last saved {new Date(saved.updated_at).toLocaleString()}</span>}
          </div>
        </main>
      </div>
    </div>
  );
}
