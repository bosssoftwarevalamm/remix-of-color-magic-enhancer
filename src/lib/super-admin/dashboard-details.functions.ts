import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type DashboardDetail = { target_key: string; title: string; description: string; ai_reason: string; updated_at: string };

const normKey = (v: string) => v.replace(/[\s-]/g, "");
const keys = { licenseKey: z.string().min(1), backupKey: z.string().min(1) };

function checkKeys(d: { licenseKey: string; backupKey: string }): string | null {
  const lic = process.env["SUPER_ADMIN_LICENSE_KEY"] ?? "2345-3456-4567";
  const bak = process.env["SUPER_ADMIN_BACKUP_KEY"] ?? "5678-2345-3456";
  if (normKey(d.licenseKey) !== normKey(lic)) return "Invalid license key — access blocked.";
  if (normKey(d.backupKey) !== normKey(bak)) return "Invalid backup key — access blocked.";
  return null;
}

export const listDashboardDetails = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object(keys).parse(d))
  .handler(async ({ data }): Promise<{ ok: true; rows: DashboardDetail[] } | { ok: false; reason: string }> => {
    const err = checkKeys(data);
    if (err) return { ok: false, reason: err };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await (supabaseAdmin as any).from("dashboard_details").select("*");
    if (error) return { ok: false, reason: error.message };
    return { ok: true, rows: rows ?? [] };
  });

export const saveDashboardDetail = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        ...keys,
        targetKey: z.string().min(1).max(200),
        title: z.string().trim().min(1).max(120),
        description: z.string().trim().max(1000),
        aiReason: z.string().trim().max(300),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; reason: string }> => {
    const err = checkKeys(data);
    if (err) return { ok: false, reason: err };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any).from("dashboard_details").upsert({
      target_key: data.targetKey,
      title: data.title,
      description: data.description,
      ai_reason: data.aiReason,
      updated_at: new Date().toISOString(),
    });
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  });

/** Server-only helper for the AI finder. */
export async function loadDetailsMap(): Promise<Record<string, DashboardDetail>> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await (supabaseAdmin as any).from("dashboard_details").select("*");
    return Object.fromEntries((data ?? []).map((r: DashboardDetail) => [r.target_key, r]));
  } catch {
    return {};
  }
}
