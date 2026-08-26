import { createFileRoute } from "@tanstack/react-router";
import { seedAccounts } from "@/lib/seed-accounts.functions";

export const Route = createFileRoute("/api/public/seed-accounts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("x-seed-token") ?? "";
        if (token !== "sv-seed-2026") {
          return new Response("Forbidden", { status: 403 });
        }
        const result = await seedAccounts({ data: { token } });
        return Response.json(result);
      },
    },
  },
});
