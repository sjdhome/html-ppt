// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { z } from "zod";

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
  integrations: [mdx(), react()],
});
