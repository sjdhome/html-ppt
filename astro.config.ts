import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { z } from "zod";
import { rehypeMarkdownRendering } from "./src/lib/rehypeMarkdownRendering";
import { rehypeMermaid } from "./src/lib/rehypeMermaid";
import { remarkObsidianCallouts } from "./src/lib/remarkObsidianCallouts";

import cloudflare from "@astrojs/cloudflare";

const DEFAULT_DEV_SERVER_PORT = 3000;

const portSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.coerce.number().int().min(0).max(65535).default(DEFAULT_DEV_SERVER_PORT),
);

// https://astro.build/config
export default defineConfig({
  server: {
    port: portSchema.parse(process.env.PORT),
  },

  // Single source of truth for the Markdown pipeline so `.md` and `.mdx`
  // render identically (Obsidian callouts, code-language badge, checkbox
  // cleanup, Mermaid). @astrojs/mdx inherits this markdown config because
  // mdx() below does not set its own remark/rehype lists (it replaces, not
  // merges, when set). Skipping Shiki for `mermaid` keeps the original
  // `language-mermaid` block for rehypeMermaid; `math` is Astro's default.
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid", "math"],
    },
    remarkPlugins: [remarkObsidianCallouts],
    rehypePlugins: [rehypeMermaid, rehypeMarkdownRendering],
  },

  integrations: [mdx(), react()],
  adapter: cloudflare(),
});