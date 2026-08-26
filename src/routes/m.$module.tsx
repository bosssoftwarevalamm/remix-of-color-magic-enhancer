import { createFileRoute, useParams } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { RoleDashboard } from "@/components/super-admin-wireframe/roleDashboards";
import type { RoleId } from "@/components/super-admin-wireframe/ControlPanelSidebar";

export const Route = createFileRoute("/m/$module")({
  head: () => ({
    meta: [
      { title: "Module — Control Panel" },
      { name: "description", content: "Open a management module dashboard." },
      { property: "og:title", content: "Module — Control Panel" },
      { property: "og:description", content: "Open a management module dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ModulePage,
});

function ModulePage() {
  const { module } = useParams({ from: "/m/$module" });

  return (
    <AuthProvider>
      <TranslationProvider>
        <TooltipProvider>
          {/* Original module UI, exactly as in the source repo — no extra chrome. */}
          <div className="dark min-h-screen w-full bg-background text-foreground">
            <RoleDashboard role={module as RoleId} />
          </div>
        </TooltipProvider>
      </TranslationProvider>
    </AuthProvider>
  );
}
