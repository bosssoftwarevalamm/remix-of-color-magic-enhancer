// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: [
        // Merged feature modules were written for react-router-dom v6.
        { find: /^react-router-dom$/, replacement: r("./src/lib/router-compat.tsx") },
        // Route their Supabase imports to schema-typed compat wrappers.
        {
          find: /^@\/integrations\/supabase\/client$/,
          replacement: r("./src/lib/supabase-client-compat.ts"),
        },
        {
          find: /^@\/integrations\/supabase\/types$/,
          replacement: r("./src/lib/supabase-types-compat.ts"),
        },
      ],
    },
  },
});

