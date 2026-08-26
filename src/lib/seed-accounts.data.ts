import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export interface SeedAccount {
  email: string;
  password: string;
  name: string;
  role: AppRole;
  /** Where this account lands after signing in. */
  homePath: string;
}

export const ACCOUNTS: SeedAccount[] = [
  {
    email: "bosssoftwarevala@gmail.com",
    password: "G7#vQ2!mZ9@rL4$X8^pN6&kT3*W5",
    name: "Control Panel",
    role: "control_panel",
    homePath: "/control-panel",
  },
  { email: "test.author@softwarevala.test", password: "Test@12345", name: "Author", role: "author", homePath: "/star/author" },
  { email: "test.vendor@softwarevala.test", password: "Test@12345", name: "Vendor", role: "vendor", homePath: "/star/vendor" },
  { email: "test.reseller@softwarevala.test", password: "Test@12345", name: "Reseller", role: "reseller", homePath: "/star/reseller" },
  { email: "test.affiliate@softwarevala.test", password: "Test@12345", name: "Affiliate", role: "affiliate", homePath: "/star/affiliate" },
  { email: "test.influencer@softwarevala.test", password: "Test@12345", name: "Influencer", role: "influencer", homePath: "/star/influencer" },
  { email: "test.franchise@softwarevala.test", password: "Test@12345", name: "Franchise", role: "franchise", homePath: "/star/franchise" },
  { email: "test.seo@softwarevala.test", password: "Test@12345", name: "SEO", role: "seo", homePath: "/star/seo" },
  { email: "test.admin@softwarevala.test", password: "Test@12345", name: "Admin", role: "admin", homePath: "/star/admin" },
  { email: "test.developer@softwarevala.test", password: "Test@12345", name: "Developer", role: "developer", homePath: "/star/developer" },
  {
    email: "test.marketplace@softwarevala.test",
    password: "Test@12345",
    name: "Marketplace Manager",
    role: "marketplace_manager",
    homePath: "/star/dev-manager",
  },
];
