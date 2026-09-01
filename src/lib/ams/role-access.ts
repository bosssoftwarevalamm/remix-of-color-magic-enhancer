// @ts-nocheck
// Maps the signed-in user's app_role to an AMS RoleDNA slug and exposes the
// identity used by the role-based AMS dashboard.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ROLES, type RoleSlug } from "@/lib/ams/roles";

export type AppRole =
  | "control_panel" | "author" | "vendor" | "reseller" | "affiliate"
  | "influencer" | "franchise" | "seo" | "admin" | "developer"
  | "marketplace_manager";

/** app_role (auth) → AMS role DNA slug (showcase / awards world). */
export const APP_ROLE_TO_AMS: Record<AppRole, RoleSlug> = {
  control_panel: "developer",
  admin: "support",
  author: "author",
  vendor: "vendor",
  reseller: "reseller",
  affiliate: "affiliate",
  influencer: "influencer",
  franchise: "franchise",
  seo: "seo",
  developer: "developer",
  marketplace_manager: "creator",
};

/** Roles allowed to preview every other role's AMS world. */
export const SUPERVISOR_ROLES: AppRole[] = ["control_panel", "admin"];

export const AMS_ROLE_SLUGS: RoleSlug[] = ROLES.map((r) => r.slug);

export const isAmsRoleSlug = (v: unknown): v is RoleSlug =>
  typeof v === "string" && AMS_ROLE_SLUGS.includes(v as RoleSlug);

export interface AmsIdentity {
  loading: boolean;
  signedIn: boolean;
  userId: string | null;
  email: string | null;
  fullName: string | null;
  appRoles: AppRole[];
  primaryAppRole: AppRole | null;
  roleSlug: RoleSlug;
  canSwitchRole: boolean;
}

const EMPTY: AmsIdentity = {
  loading: true,
  signedIn: false,
  userId: null,
  email: null,
  fullName: null,
  appRoles: [],
  primaryAppRole: null,
  roleSlug: "user",
  canSwitchRole: false,
};

export function useAmsIdentity(): AmsIdentity {
  const [state, setState] = useState<AmsIdentity>(EMPTY);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        if (active) setState({ ...EMPTY, loading: false });
        return;
      }
      const userId = session.user.id;
      const [{ data: roleRows }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.from("profiles").select("full_name, email").eq("id", userId).maybeSingle(),
      ]);
      const appRoles = (roleRows ?? []).map((r) => r.role as AppRole);
      const primary = appRoles[0] ?? null;
      if (!active) return;
      setState({
        loading: false,
        signedIn: true,
        userId,
        email: profile?.email ?? session.user.email ?? null,
        fullName: profile?.full_name ?? null,
        appRoles,
        primaryAppRole: primary,
        roleSlug: primary ? APP_ROLE_TO_AMS[primary] ?? "user" : "user",
        canSwitchRole: appRoles.some((r) => SUPERVISOR_ROLES.includes(r)),
      });
    };

    void load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void load();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
