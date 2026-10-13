import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const SHARE_PLATFORMS = ["Instagram", "Facebook", "WhatsApp", "Telegram", "X / Twitter", "LinkedIn", "Email", "Copy URL"] as const;

const normKey = (v: string) => v.replace(/[\s-]/g, "");

/** Public: records one share click. Only whitelisted platforms are accepted. */
export const recordShare = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      productId: z.string().trim().min(1).max(120),
      productName: z.string().trim().min(1).max(200),
      platform: z.enum(SHARE_PLATFORMS),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await (supabaseAdmin as any).from("product_share_events").insert({
      product_id: data.productId,
      product_name: data.productName,
      platform: data.platform,
    });
    return { ok: true };
  });

export type ShareStats = {
  total: number;
  byPlatform: { platform: string; count: number }[];
  byProduct: { productId: string; productName: string; count: number; platforms: Record<string, number> }[];
};

/** Super Admin only: aggregated share counts. */
export const getShareStats = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ licenseKey: z.string().min(1), backupKey: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<{ ok: true; stats: ShareStats } | { ok: false; reason: string }> => {
    const lic = process.env["SUPER_ADMIN_LICENSE_KEY"] ?? "2345-3456-4567";
    const bak = process.env["SUPER_ADMIN_BACKUP_KEY"] ?? "5678-2345-3456";
    if (normKey(data.licenseKey) !== normKey(lic)) return { ok: false, reason: "Invalid license key — access blocked." };
    if (normKey(data.backupKey) !== normKey(bak)) return { ok: false, reason: "Invalid backup key — access blocked." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await (supabaseAdmin as any)
      .from("product_share_events").select("product_id, product_name, platform").limit(50000);
    if (error) return { ok: false, reason: error.message };
    const plat: Record<string, number> = Object.fromEntries(SHARE_PLATFORMS.map((p) => [p, 0])) as Record<string, number>;
    const prod = new Map<string, ShareStats["byProduct"][number]>();
    for (const r of rows ?? []) {
      plat[r.platform] = (plat[r.platform] ?? 0) + 1;
      const p = prod.get(r.product_id) ?? { productId: r.product_id, productName: r.product_name, count: 0, platforms: {} as Record<string, number> };
      p.count++;
      p.platforms[r.platform] = (p.platforms[r.platform] ?? 0) + 1;
      prod.set(r.product_id, p);
    }
    return {
      ok: true,
      stats: {
        total: rows?.length ?? 0,
        byPlatform: Object.entries(plat).map(([platform, count]) => ({ platform, count })).sort((a, b) => b.count - a.count),
        byProduct: [...prod.values()].sort((a, b) => b.count - a.count).slice(0, 100),
      },
    };
  });

/** Public: request origin for absolute Open Graph URLs. */
export const getRequestOrigin = createServerFn({ method: "GET" }).handler(() => {
  const req = getRequest();
  const url = new URL(req.url);
  const sandboxHost = url.hostname === "localhost" ? req.headers.get("x-forwarded-host") : null;
  return sandboxHost ? `https://${sandboxHost}` : url.origin;
});
