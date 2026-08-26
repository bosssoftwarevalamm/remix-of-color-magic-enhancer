// @ts-nocheck
import type { ReactNode } from "react";

/**
 * Role gating is intentionally disabled in this workspace — the merged module
 * dashboards are rendered directly, with no login screen.
 */
export default function RequireRole({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
