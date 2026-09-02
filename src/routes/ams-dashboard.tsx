// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AmsRoleDashboard } from "@/components/ams-manager/AmsRoleDashboard";

export const Route = createFileRoute("/ams-dashboard")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    role: typeof search.role === "string" ? search.role : undefined,
  }),
  head: () => ({
    meta: [
      { title: "My AMS Dashboard — Role Recognition" },
      { name: "description", content: "Your role-based AMS dashboard: identity, journey, awards, trophies and the full AMS Center flow." },
      { property: "og:title", content: "My AMS Dashboard — Role Recognition" },
      { property: "og:description", content: "Role-based AMS dashboard with identity, journey, awards and AMS Center." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { role } = Route.useSearch();
  return <AmsRoleDashboard roleParam={role} />;
}
