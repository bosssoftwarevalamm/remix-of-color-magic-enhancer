import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SWITCH_BACKUP_KEY, SWITCH_LICENSE_KEY } from "@/lib/super-admin/role-dashboards";
import { getShareStats, type ShareStats } from "@/lib/marketplace-home/share-stats.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/super-admin/share-stats")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Share Stats — Super Admin" },
      { name: "description", content: "How many times marketplace products were shared on each social platform." },
      { property: "og:title", content: "Share Stats — Super Admin" },
      { property: "og:description", content: "Marketplace share counts by platform and product." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ShareStatsPage,
});

function ShareStatsPage() {
  const fetchStats = useServerFn(getShareStats);
  const [stats, setStats] = useState<ShareStats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const licenseKey = sessionStorage.getItem(SWITCH_LICENSE_KEY) ?? "";
    const backupKey = sessionStorage.getItem(SWITCH_BACKUP_KEY) ?? "";
    if (!licenseKey || !backupKey) {
      setErr("Super Admin switch is locked. Unlock it from the top bar first.");
      setLoading(false);
      return;
    }
    try {
      const r = await fetchStats({ data: { licenseKey, backupKey } });
      if (r.ok) { setStats(r.stats); setErr(null); } else setErr(r.reason);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const max = Math.max(1, ...(stats?.byPlatform.map((p) => p.count) ?? [1]));

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Share Stats</h1>
            <p className="text-sm text-muted-foreground">Kis social se kitni baar product share hua</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void load()} disabled={loading}>{loading ? "Loading…" : "Refresh"}</Button>
            <Button asChild variant="ghost"><Link to="/">Home</Link></Button>
          </div>
        </div>

        {err && <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">{err}</div>}

        {stats && (
          <>
            <div className="rounded-xl border bg-card p-5">
              <div className="text-sm text-muted-foreground">Total shares</div>
              <div className="text-4xl font-bold" data-testid="share-total">{stats.total}</div>
            </div>

            <section className="rounded-xl border bg-card p-5 space-y-3">
              <h2 className="font-semibold">By platform</h2>
              {stats.byPlatform.map((p) => (
                <div key={p.platform} className="flex items-center gap-3" data-platform={p.platform}>
                  <div className="w-28 text-sm">{p.platform}</div>
                  <div className="flex-1 h-3 rounded bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(p.count / max) * 100}%` }} />
                  </div>
                  <div className="w-12 text-right font-mono text-sm">{p.count}</div>
                </div>
              ))}
            </section>

            <section className="rounded-xl border bg-card p-5">
              <h2 className="font-semibold mb-3">Top shared products</h2>
              {stats.byProduct.length === 0 ? (
                <p className="text-sm text-muted-foreground">Abhi tak koi share nahi hua.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr><th className="py-2">Product</th><th>Platforms</th><th className="text-right">Shares</th></tr>
                  </thead>
                  <tbody>
                    {stats.byProduct.map((p) => (
                      <tr key={p.productId} className="border-t">
                        <td className="py-2">{p.productName}</td>
                        <td className="text-muted-foreground">
                          {Object.entries(p.platforms).map(([k, v]) => `${k} ${v}`).join(" · ")}
                        </td>
                        <td className="text-right font-mono">{p.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
