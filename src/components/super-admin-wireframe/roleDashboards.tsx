/**
 * ROLE → DASHBOARD REGISTRY
 * Maps every Control Panel sidebar module to its full dashboard,
 * lazily loaded so the cockpit stays fast.
 */
import { lazy, Suspense, type ComponentType } from "react";
import type { RoleId } from "./ControlPanelSidebar";

const noop = () => {};

const workspace = (role: string) =>
  lazy(async () => {
    const m = await import("@/components/dashboard/RoleWorkspace");
    return { default: () => <m.RoleWorkspace role={role as never} /> };
  });

const lazyDefault = (loader: () => Promise<{ default: ComponentType<any> }>) => lazy(loader);

export const ROLE_DASHBOARDS: Partial<Record<RoleId, ComponentType<any>>> = {
  // GRADE 1
  ceo: lazyDefault(() => import("@/pages/ai-ceo/AICEODashboard")),
  vala_ai_management: lazyDefault(() => import("@/pages/OverAI")),
  server_manager: lazyDefault(() => import("@/pages/server-manager/ServerManagerDashboard")),
  api_ai_manager: lazyDefault(() => import("@/pages/ai-api-management/AIAPIManagementDashboard")),
  // GRADE 2
  developer_management: lazyDefault(() => import("@/pages/dev-manager/SecureDevManagerDashboard")),
  product_manager: lazyDefault(() => import("@/pages/product-demo-manager/ProductDashboard")),
  demo_manager: lazyDefault(() => import("@/pages/DemoManagerDashboard")),
  task_management: lazyDefault(() => import("@/pages/TaskManager")),
  promise_tracker_manager: lazyDefault(() => import("@/pages/promise-tracker/PromiseTrackerDashboard")),
  assist_manager: lazyDefault(() => import("@/pages/assist-manager/AssistManagerDashboard")),
  ams_manager: lazy(async () => {
    const m = await import("@/components/dashboard/AMSCenterWorkspace");
    return { default: () => <m.AMSCenterWorkspace onBack={noop} /> };
  }),
  award_management: lazy(async () => {
    const [m, roles] = await Promise.all([
      import("@/components/dashboard/AMSWorkspace"),
      import("@/lib/roles"),
    ]);
    return { default: () => <m.AMSWorkspace role={roles.ROLES.admin} onBack={noop} /> };
  }),
  auto_dev: lazyDefault(() => import("@/pages/auto-dev/AutoDevDashboard")),
  // GRADE 3
  marketing_management: lazyDefault(() => import("@/pages/MarketingManager")),
  seo_manager: lazyDefault(() => import("@/pages/seo-manager/SEOManagerDashboard")),
  lead_manager: lazyDefault(() => import("@/pages/LeadManager")),
  sales_support_manager: lazyDefault(() => import("@/pages/SalesSupportDashboard")),
  customer_support_management: lazyDefault(() => import("@/pages/SupportDashboard")),
  sales_crm: lazyDefault(() => import("@/pages/sales-crm/SalesCRMDashboard")),
  client_success: lazyDefault(() => import("@/pages/ClientSuccessDashboard")),
  internal_support_ai: lazyDefault(() => import("@/pages/InternalSupportAI")),
  notification_console: lazyDefault(() => import("@/pages/NotificationBuzzerConsole")),
  // GRADE 4
  franchise_manager: lazyDefault(() => import("@/pages/FranchiseManagement")),
  reseller_manager: lazyDefault(() => import("@/pages/reseller-manager/SecureResellerManagerDashboard")),
  influencer_manager: lazyDefault(() => import("@/pages/InfluencerManager")),
  influencer_dashboard: lazyDefault(() => import("@/pages/InfluencerDashboard")),
  multi_branch: lazyDefault(() => import("@/pages/multi-branch/MultiBranchDashboard")),
  // GRADE 5
  continent_super_admin: lazyDefault(() => import("@/pages/continent-super-admin/ContinentSuperAdminDashboard")),
  country_head: lazyDefault(() => import("@/components/country-dashboard/CountryHeadDashboard")),
  // GRADE 6
  finance_manager: lazyDefault(() => import("@/pages/FinanceManager")),
  accounting_manager: lazyDefault(() => import("@/pages/accounting/AccountingDemo")),
  legal_manager: lazyDefault(() => import("@/pages/LegalComplianceManager")),
  developer_dashboard: lazyDefault(() => import("@/pages/DeveloperDashboard")),
  pro_manager: lazyDefault(() => import("@/pages/pro-manager/SecureProManagerDashboard")),
  hr_manager: lazyDefault(() => import("@/pages/hr-manager/SecureHRManagerDashboard")),
  performance_manager: lazyDefault(() => import("@/pages/PerformanceManager")),
  rnd_manager: lazyDefault(() => import("@/pages/RnDDashboard")),
  incident_crisis: lazyDefault(() => import("@/pages/IncidentCrisisDashboard")),
  business_dashboard: lazyDefault(() => import("@/pages/business/BusinessDashboard")),
  api_manager: lazyDefault(() => import("@/pages/api-manager/APIManagerDashboard")),
  server_orchestration: lazyDefault(() => import("@/pages/server-orchestration/ServerOrchestrationDashboard")),
  enterprise_control: lazyDefault(() => import("@/pages/enterprise-control/EnterpriseControlHub")),
  master_control: lazyDefault(() => import("@/pages/master-control/MasterControlCenter")),
  // GRADE 6.5 — PLATFORM MODULES
  marketplace_manager: lazyDefault(() => import("@/pages/super-admin/ProductManagerPage")),
  super_admin_system: lazyDefault(() => import("@/pages/super-admin-system/RoleSwitch/RoleSwitchDashboard")),
  vala_control: lazy(async () => {
    const m = await import("@/pages/vala-control/ValaControlCenter");
    return { default: () => <m.default roleView="operations" /> };
  }),
  safe_assist: lazyDefault(() => import("@/pages/safe-assist/SafeAssistDashboard")),
  promise_management: lazyDefault(() => import("@/pages/promise-management/PromiseManagementDashboard")),
  dev_command_center: lazyDefault(() => import("@/pages/DevCommandCenter")),
  internal_chat: lazyDefault(() => import("@/pages/InternalChat")),
  client_portal: lazyDefault(() => import("@/pages/ClientPortal")),
  school_software: lazyDefault(() => import("@/pages/school-software/SchoolSoftwareHomepage")),
  retail_pos: lazyDefault(() => import("@/pages/retail-pos/RetailPOSDemo")),
  // GRADE 6.6 — PARTNER WORKSPACES (/dashboard/$role in the source repo)
  ws_author: workspace("author"),
  ws_vendor: workspace("vendor"),
  ws_reseller: workspace("reseller"),
  ws_affiliate: workspace("affiliate"),
  ws_influencer: workspace("influencer"),
  ws_franchise: workspace("franchise"),
  ws_seo: workspace("seo"),
  ws_admin: workspace("admin"),
  ws_developer: workspace("developer"),
  ws_dev_manager: workspace("dev-manager"),
  ws_promise_tracker: workspace("promise-tracker"),
  // GRADE 7
  pro_user_dashboard: lazyDefault(() => import("@/pages/prime/PrimeDashboardPage")),
  basic_user_dashboard: lazyDefault(() => import("@/pages/SimpleUserDashboard")),
  // GRADE 8
  home: lazyDefault(() => import("@/pages/Homepage")),
  security: lazyDefault(() => import("@/pages/security-command/SecurityCommandCenter")),
  settings: lazyDefault(() => import("@/pages/Settings")),
};

export function RoleDashboard({ role }: { role: RoleId }) {
  const Dashboard = ROLE_DASHBOARDS[role];
  if (!Dashboard) return null;

  return (
    <Suspense
      fallback={
        <div className="flex h-[60vh] items-center justify-center text-sm text-white/60">
          Loading module…
        </div>
      }
    >
      {/* Render the original page exactly as it is in the source repo — no extra chrome. */}
      <Dashboard />
    </Suspense>
  );
}
