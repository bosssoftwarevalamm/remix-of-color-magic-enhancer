// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { CollectibleVault } from "@/components/ams/collectible/CollectibleVault";
import { ROLE_CERTIFICATE } from "@/lib/ams/role-assets";

export const Route = createFileRoute("/_authenticated/certificate-vault")({
  head: () => ({
    meta: [
      { title: "Certificate Vault — Premium 3D Certificates" },
      { name: "description", content: "Foil-embossed 3D role certificates with rotation and PNG export." },
      { property: "og:title", content: "Certificate Vault — Premium 3D Certificates" },
      { property: "og:description", content: "11 role certificates with gold foil borders, seals and guilloché detail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CollectibleVault
      kicker="Certificate Vault"
      title="Premium 3D Certificate Collection"
      description="Foil-embossed certificates with guilloché borders, wax seals and role-specific crests."
      suffix="certificate"
      singular="Certificate"
      assets={ROLE_CERTIFICATE}
      unlockKind="achievement"
    />
  ),
});
