import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { getRequestOrigin } from "@/lib/marketplace-home/share-stats.functions";

const search = z.object({
  name: z.string().max(200).optional(),
  desc: z.string().max(400).optional(),
  to: z.string().max(300).optional(),
});

const safeTo = (to: string | undefined, id: string) =>
  to && to.startsWith("/") && !to.startsWith("//") ? to : `/#product-${encodeURIComponent(id)}`;

export const Route = createFileRoute("/product/$id")({
  validateSearch: (s) => search.parse(s),
  loaderDeps: ({ search }) => search,
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ params, match, loaderData }) => {
    const s = (match?.search ?? {}) as z.infer<typeof search>;
    const name = s.name || params.id.replace(/-/g, " ");
    const title = `${name} — Live Demo & Source Code | Software Vala`;
    const description = s.desc || `${name}: ready-to-deploy software with live demo, full source code and lifetime access on Software Vala.`;
    const path = `/product/${encodeURIComponent(params.id)}`;
    const img = loaderData?.origin ? `${loaderData.origin}/og-product.jpg` : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: path },
        { property: "og:site_name", content: "Software Vala" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(img
          ? [
              { property: "og:image", content: img },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { name: "twitter:image", content: img },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: path }],
    };
  },
  component: ProductShareLanding,
});

function ProductShareLanding() {
  const { id } = Route.useParams();
  const s = Route.useSearch();
  const dest = safeTo(s.to, id);
  useEffect(() => {
    window.location.replace(dest);
  }, [dest]);
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="text-xl font-semibold">{s.name || id}</h1>
        {s.desc && <p className="mt-2 text-muted-foreground max-w-md">{s.desc}</p>}
        <a href={dest} className="mt-4 inline-block underline">Open product →</a>
      </div>
    </main>
  );
}
