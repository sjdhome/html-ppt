import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import * as mdx from "eslint-plugin-mdx";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const presentationRemarkConfig = fileURLToPath(
  new URL("./eslint/remark-presentations.mjs", import.meta.url),
);

export default defineConfig(
  {
    ignores: [".astro/", "dist/", "node_modules/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,astro}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    // Presentation articles (.md/.mdx) must not contain a level-1 heading:
    // the page title is rendered from frontmatter. Enforced via eslint-plugin-mdx
    // running the custom remark rule in eslint/remark-presentations.mjs.
    ...mdx.flat,
    files: ["src/content/presentations/**/*.{md,mdx}"],
    languageOptions: {
      ...mdx.flat.languageOptions,
      parserOptions: {
        ...(mdx.flat.languageOptions?.parserOptions ?? {}),
        // NOTE: do not set `ignoreRemarkConfig: true` — eslint-mdx 3.7.0 has a
        // bug where that path leaves its ignore-check cache unpopulated and
        // crashes ("ignoreCheckCache.get(...) is not a function"). Pointing at
        // an explicit config is enough; the repo has no other remark config.
        remarkConfigPath: presentationRemarkConfig,
      },
    },
    rules: {
      ...mdx.flat.rules,
      "mdx/remark": "error",
      // Presentation .md/.mdx are content, not the TS project. The globally
      // applied typescript-eslint/eslint recommended configs would otherwise
      // flag e.g. an imported MDX component as unused (JSX usage in .mdx is
      // not tracked by those rules). Disable them for content files only.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  eslintConfigPrettier,
);
