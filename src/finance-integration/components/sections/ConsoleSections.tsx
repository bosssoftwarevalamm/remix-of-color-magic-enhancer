import type { FinanceView } from "@/finance-integration/lib/finance/views";
import RevenueDashboard from "@/finance-integration/components/consoles/RevenueDashboard";
import PayoutManager from "@/finance-integration/components/consoles/PayoutManager";
import WalletSystem from "@/finance-integration/components/consoles/WalletSystem";
import CommissionLedger from "@/finance-integration/components/consoles/CommissionLedger";
import InvoiceCenter from "@/finance-integration/components/consoles/InvoiceCenter";
import TransactionHeatmap from "@/finance-integration/components/consoles/TransactionHeatmap";
import FraudScanner from "@/finance-integration/components/consoles/FraudScanner";
import AuditLogs from "@/finance-integration/components/consoles/AuditLogs";

export default function ConsoleSections({ view }: { view: FinanceView }) {
  switch (view) {
    case "payouts":
      return <PayoutManager />;
    case "wallets":
      return <WalletSystem />;
    case "commissions":
      return <CommissionLedger />;
    case "invoices":
      return <InvoiceCenter />;
    case "heatmap":
      return <TransactionHeatmap />;
    case "fraud":
      return <FraudScanner />;
    case "audit":
      return <AuditLogs />;
    case "revenue":
    default:
      return <RevenueDashboard />;
  }
}
