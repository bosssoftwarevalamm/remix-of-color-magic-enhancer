import type { RoleConfig } from "@/star/lib/roles";
import { CrudWorkspace } from "@/star/components/dashboard/CrudWorkspace";
import { ResellerClientsWorkspace } from "@/star/components/dashboard/reseller/ResellerClientsWorkspace";
import { ResellerLicensesWorkspace } from "@/star/components/dashboard/reseller/ResellerLicensesWorkspace";
import { ResellerLeadsWorkspace } from "@/star/components/dashboard/reseller/ResellerLeadsWorkspace";
import { AMSEngine } from "@/star/components/dashboard/ams/AMSEngine";
import { AMSWorkspace } from "@/star/components/dashboard/AMSWorkspace";
import { AMSCenterWorkspace } from "@/star/components/dashboard/AMSCenterWorkspace";

export function ResellerModulePage({ role, moduleKey, onBack }: { role: RoleConfig; moduleKey: string; onBack: () => void }) {
  if (moduleKey === "clients")      return <ResellerClientsWorkspace onBack={onBack} />;
  if (moduleKey === "licenses")     return <ResellerLicensesWorkspace onBack={onBack} />;
  if (moduleKey === "leads")        return <ResellerLeadsWorkspace onBack={onBack} />;
  if (moduleKey === "achievements") return <AMSEngine role={role} onBack={onBack} />;
  if (moduleKey === "ams")          return <AMSWorkspace role={role} onBack={onBack} />;
  if (moduleKey === "ams-center")   return <AMSCenterWorkspace onBack={onBack} />;
  return <CrudWorkspace role={role} moduleKey={moduleKey} onBack={onBack} />;
}

