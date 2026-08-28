import { createFileRoute } from "@tanstack/react-router";
import { FinanceManager } from "@/finance-integration/components/FinanceManager";

export const Route = createFileRoute("/finance-manager")({
  head: () => ({
    meta: [
      { title: "Finance Manager — Software Vala" },
      {
        name: "description",
        content:
          "Wallets, payouts, invoices, commissions, tax and fraud controls in one finance console.",
      },
      { property: "og:title", content: "Finance Manager — Software Vala" },
      {
        property: "og:description",
        content:
          "Wallets, payouts, invoices, commissions, tax and fraud controls in one finance console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FinanceManager,
});
