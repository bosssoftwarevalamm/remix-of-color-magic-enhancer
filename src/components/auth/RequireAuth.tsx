// @ts-nocheck
import type { ReactNode } from "react";

/**
 * Auth gating is intentionally disabled in this workspace — the merged module
 * dashboards are rendered directly, with no login screen.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
