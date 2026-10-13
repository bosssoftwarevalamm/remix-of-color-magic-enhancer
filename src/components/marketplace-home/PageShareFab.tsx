import { useRouterState } from "@tanstack/react-router";
import { ProductShare } from "@/components/marketplace-home/ProductShare";

/** Floating Share button for Super Admin pages and every Star dashboard. */
export function PageShareFab() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (!path.startsWith("/star/") && !path.startsWith("/super-admin")) return null;
  const slug = path.replace(/^\/+/, "").replace(/\//g, "-") || "home";
  const role = path.split("/")[2] ?? "";
  const name = path.startsWith("/star/")
    ? `${role.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Dashboard`
    : "Super Admin";
  return (
    <div className="fixed bottom-5 right-5 z-50 mpc-home" data-page-share>
      <ProductShare id={`page-${slug}`} name={`${name} — Software Vala`} description={`Open the ${name} on Software Vala.`} url={path} />
    </div>
  );
}
