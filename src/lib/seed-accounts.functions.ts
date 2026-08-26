import { createServerFn } from "@tanstack/react-start";

/**
 * One-time provisioning of the fixed demo/staff accounts.
 * Guarded by a shared token so it cannot be triggered casually.
 */
export const seedAccounts = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    if (data?.token !== "sv-seed-2026") {
      throw new Error("Forbidden");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ACCOUNTS } = await import("./seed-accounts.data");

    const results: Array<{ email: string; status: string }> = [];

    for (const account of ACCOUNTS) {
      let userId: string | null = null;
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.name },
      });
      if (created?.user) {
        userId = created.user.id;
        results.push({ email: account.email, status: "created" });
      } else {
        // Already exists — find it and reset the password so the documented one works.
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const existing = list?.users.find((u) => u.email?.toLowerCase() === account.email.toLowerCase());
        if (!existing) {
          results.push({ email: account.email, status: `error: ${error?.message ?? "unknown"}` });
          continue;
        }
        userId = existing.id;
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password: account.password,
          email_confirm: true,
          user_metadata: { full_name: account.name },
        });
        results.push({ email: account.email, status: "updated" });
      }

      if (!userId) continue;

      await supabaseAdmin.from("profiles").upsert(
        {
          id: userId,
          email: account.email,
          full_name: account.name,
          home_path: account.homePath,
        },
        { onConflict: "id" },
      );

      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: userId, role: account.role }, { onConflict: "user_id,role" });
    }

    return { results };
  });
