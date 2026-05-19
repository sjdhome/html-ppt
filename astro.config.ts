import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { z } from "zod";
import { rehypeMarkdownRendering } from "./src/lib/rehypeMarkdownRendering";
import { rehypeMermaid } from "./src/lib/rehypeMermaid";
import { remarkObsidianCallouts } from "./src/lib/remarkObsidianCallouts";

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
  // Skip Shiki highlighting for `mermaid` fences so rehypeMermaid still sees
  // the original `language-mermaid` code block. `math` keeps Astro's default
  // exclusion. @astrojs/mdx inherits this markdown config.
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid", "math"],
    },
    // Enables Mermaid in plain `.md` presentations. @astrojs/mdx replaces
    // (does not merge) rehypePlugins when its own list is set, so `.mdx`
    // keeps using the mdx() list below and is unaffected by this.
    rehypePlugins: [rehypeMermaid],
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkObsidianCallouts],
      rehypePlugins: [rehypeMermaid, rehypeMarkdownRendering],
    }),
    react(),
  ],
});
