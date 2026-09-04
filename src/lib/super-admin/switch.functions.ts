import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Super Admin switch verification.
 * Credentials + 12-digit license key + backup key are validated on the server
 * only — the handler body is stripped from the client bundle.
 */
const inputSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(1),
  licenseKey: z.string().min(1),
  backupKey: z.string().min(1),
});

const norm = (v: string) => v.trim().toLowerCase();
const normKey = (v: string) => v.replace(/[\s-]/g, "");

export const verifySuperAdminSwitch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const expectedEmail = process.env["SUPER_ADMIN_EMAIL"] ?? "Softwarevala@admim.com";
    const expectedPassword = process.env["SUPER_ADMIN_PASSWORD"] ?? "softwarevala#123456";
    const expectedLicense = process.env["SUPER_ADMIN_LICENSE_KEY"] ?? "2345-3456-4567";
    const expectedBackup = process.env["SUPER_ADMIN_BACKUP_KEY"] ?? "5678-2345-3456";

    const okEmail = norm(data.email) === norm(expectedEmail);
    const okPassword = data.password === expectedPassword;
    const okLicense = normKey(data.licenseKey) === normKey(expectedLicense);
    const okBackup = normKey(data.backupKey) === normKey(expectedBackup);

    if (!okEmail || !okPassword) return { ok: false as const, reason: "Invalid username or password" };
    if (!okLicense) return { ok: false as const, reason: "Invalid license key" };
    if (!okBackup) return { ok: false as const, reason: "Invalid backup key" };

    return { ok: true as const, reason: "" };
  });
