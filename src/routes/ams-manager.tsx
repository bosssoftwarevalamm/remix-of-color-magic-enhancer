// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AmsManagerModule } from "@/components/ams-manager/AmsManagerModule";

export const Route = createFileRoute("/ams-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "AMS Manager — Award Management System" },
      { name: "description", content: "Manage awards, rewards, missions and recognition rules from the AMS Manager module." },
      { property: "og:title", content: "AMS Manager — Award Management System" },
      { property: "og:description", content: "Manage awards, rewards, missions and recognition rules from one module." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AmsManagerModule,
});
