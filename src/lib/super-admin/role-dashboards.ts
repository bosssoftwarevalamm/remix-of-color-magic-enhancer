/**
 * Catalogue of every role dashboard reachable from the Super Admin switch.
 * Data only — no UI. Paths point at existing routes:
 *  - /m/$module  → control-panel role dashboards
 *  - /star/$role → user role dashboards
 *  - fixed paths → standalone module routes
 */
export type SwitchTarget =
  | { label: string; kind: "module"; id: string }
  | { label: string; kind: "star"; id: string }
  | { label: string; kind: "path"; path: string };

export type SwitchGroup = { group: string; items: SwitchTarget[] };

const mod = (label: string, id: string): SwitchTarget => ({ label, kind: "module", id });
const star = (label: string, id: string): SwitchTarget => ({ label, kind: "star", id });
const path = (label: string, p: string): SwitchTarget => ({ label, kind: "path", path: p });

export const SWITCH_GROUPS: SwitchGroup[] = [
  {
    group: "Command & Control",
    items: [
      path("Control Panel", "/control-panel"),
      path("Command Center", "/command-center"),
      path("Cockpit", "/cockpit"),
      mod("Boss Dashboard", "boss_owner"),
      mod("CEO Dashboard", "ceo"),
      mod("Super Admin System", "super_admin_system"),
      mod("Master Control Center", "master_control"),
      mod("Enterprise Control", "enterprise_control"),
      mod("Vala Control Center", "vala_control"),
      mod("Security", "security"),
      mod("Settings", "settings"),
      mod("Home", "home"),
    ],
  },
  {
    group: "AI & Development",
    items: [
      mod("Vala AI", "vala_ai_management"),
      mod("AI API Manager", "api_ai_manager"),
      mod("API Manager", "api_manager"),
      mod("Auto Dev Engine", "auto_dev"),
      mod("Development Manager", "developer_management"),
      mod("Dev Command Center", "dev_command_center"),
      mod("Developer Dashboard", "developer_dashboard"),
      mod("Server Manager", "server_manager"),
      mod("Server Orchestration", "server_orchestration"),
      mod("R&D Manager", "rnd_manager"),
      mod("Performance Manager", "performance_manager"),
      mod("Incident & Crisis", "incident_crisis"),
      mod("Internal Support AI", "internal_support_ai"),
    ],
  },
  {
    group: "Business Operations",
    items: [
      mod("Product Manager", "product_manager"),
      mod("Demo Manager", "demo_manager"),
      mod("Task Manager", "task_management"),
      mod("Promise Tracker", "promise_tracker_manager"),
      mod("Promise Management", "promise_management"),
      mod("Assist Manager", "assist_manager"),
      mod("Safe Assist", "safe_assist"),
      mod("Marketing Manager", "marketing_management"),
      mod("SEO Manager", "seo_manager"),
      mod("Lead Manager", "lead_manager"),
      mod("Sales & Support", "sales_support_manager"),
      mod("Sales CRM", "sales_crm"),
      mod("Customer Support", "customer_support_management"),
      mod("Client Success", "client_success"),
      mod("Client Portal", "client_portal"),
      mod("Notification Console", "notification_console"),
      mod("Internal Chat", "internal_chat"),
      mod("HR Manager", "hr_manager"),
      mod("Legal Manager", "legal_manager"),
      mod("Accounting Manager", "accounting_manager"),
      mod("Business Dashboard", "business_dashboard"),
      mod("Marketplace Manager", "marketplace_manager"),
      mod("School Software", "school_software"),
      mod("Retail POS", "retail_pos"),
      path("Finance Manager", "/finance-manager"),
      mod("Finance Manager (Panel)", "finance_manager"),
    ],
  },
  {
    group: "Partners & Regions",
    items: [
      mod("Franchise Owner", "franchise_manager"),
      mod("Multi-Branch Manager", "multi_branch"),
      mod("Reseller Manager", "reseller_manager"),
      mod("Influencer Manager", "influencer_manager"),
      mod("Influencer Dashboard", "influencer_dashboard"),
      mod("Continent Admin", "continent_super_admin"),
      mod("Country Admin", "country_head"),
      mod("Pro Manager", "pro_manager"),
      mod("Pro User Dashboard", "pro_user_dashboard"),
      mod("Basic User Dashboard", "basic_user_dashboard"),
    ],
  },
  {
    group: "Recognition (AMS)",
    items: [
      path("AMS Manager", "/ams-manager"),
      path("My AMS Dashboard", "/ams-dashboard"),
      mod("AMS Manager (Panel)", "ams_manager"),
      mod("Award Management System", "award_management"),
    ],
  },
  {
    group: "Role Workspaces",
    items: [
      mod("Author Workspace", "ws_author"),
      mod("Vendor Workspace", "ws_vendor"),
      mod("Reseller Workspace", "ws_reseller"),
      mod("Affiliate Workspace", "ws_affiliate"),
      mod("Influencer Workspace", "ws_influencer"),
      mod("Franchise Workspace", "ws_franchise"),
      mod("SEO Workspace", "ws_seo"),
      mod("Admin Workspace", "ws_admin"),
      mod("Developer Workspace", "ws_developer"),
      mod("Dev Manager Workspace", "ws_dev_manager"),
      mod("Promise Tracker Workspace", "ws_promise_tracker"),
    ],
  },
  {
    group: "User Role Dashboards",
    items: [
      star("Author Dashboard", "author"),
      star("Vendor Dashboard", "vendor"),
      star("Reseller Dashboard", "reseller"),
      star("Affiliate Dashboard", "affiliate"),
      star("Influencer Dashboard", "influencer"),
      star("Franchise Dashboard", "franchise"),
      star("SEO Dashboard", "seo"),
      star("Admin Dashboard", "admin"),
      star("Developer Dashboard", "developer"),
      star("Dev Manager Dashboard", "dev-manager"),
      star("Promise Tracker Dashboard", "promise-tracker"),
    ],
  },
];

export const SWITCH_STORAGE_KEY = "sv_super_admin_switch";
export const SWITCH_LICENSE_KEY = "sv_super_admin_license";
export const SWITCH_BACKUP_KEY = "sv_super_admin_backup";
