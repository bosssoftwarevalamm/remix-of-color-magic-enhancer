// @ts-nocheck
/**
 * Page wrapper — density/heading composition copied from the reference
 * author-manager "WallShell". Presentation only.
 */
import type { ReactNode } from "react";

interface PageShellProps {
  title?: string;
  subtitle?: string;
  count?: number | string;
  actions?: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, subtitle, count, actions, banner, children }: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {banner}
      {title && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl lg:text-[34px]">
              {title}
              {count !== undefined && (
                <span className="ml-3 align-middle rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                  {count}
                </span>
              )}
            </h1>
            {subtitle && (
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-[15px]">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default PageShell;
