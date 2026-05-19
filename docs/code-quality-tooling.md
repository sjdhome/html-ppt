# Code quality tooling

## Requirement

The project needs TypeScript, React, ESLint, and Prettier configured. TypeScript should target the ESNext standard, Prettier should ignore `pnpm-lock.yaml`, and commits should be blocked unless full-project type checking, ESLint, and Prettier checks pass.

## What changed

- Added React support through `react`, `react-dom`, and the Astro React integration in `astro.config.mjs`.
- Configured `tsconfig.json` to use ESNext target, module, and library settings with React JSX support.
- Added ESLint flat config for JavaScript, TypeScript, Astro, React, and React Hooks.
- Added Prettier with the Astro plugin and `.prettierignore` so generated output and `pnpm-lock.yaml` are not formatted or checked.
- Configured `pnpm format` with Prettier's cache and warning-level logging so routine formatting does not print a long list of unchanged files.
- Removed lint-staged after deciding that commit-time validation should run full-project checks only, avoiding duplicate staged-file checks.
- Added Husky with a `pre-commit` hook that runs `pnpm precommit`.
- Added package scripts for `typecheck`, `lint`, `format`, `format:check`, and `precommit`.

## Format output behavior

`pnpm format` runs:

```sh
prettier . --write --cache --log-level warn
```

The cache skips files that Prettier already knows are unchanged, and warning-level logging suppresses routine per-file output. This keeps format runs focused on actionable warnings or errors instead of a long unchanged-file list.

## Commit behavior

Before a commit is accepted, Husky runs:

```sh
pnpm typecheck && pnpm lint && pnpm format:check
```

This ensures the full project passes Astro/TypeScript type checking, ESLint, and Prettier checks before each commit.

## Presentation no-level-1-heading lint

### Requirement

Presentation articles must not contain a level-1 heading. The detail page
renders the frontmatter `title` as the article's `h1`, so an in-body H1
duplicates the title and breaks the document outline. This must be enforced as
part of `pnpm lint` (so it also runs in the Husky `pre-commit` gate), and must
cover both `.md` and `.mdx` presentations.

### What changed

- Added dev dependencies `@eslint/markdown` and `eslint-plugin-mdx`.
- Added `eslint/remark-presentations.mjs`: a tiny custom remark plugin that
  walks the mdast and reports every `heading` node with `depth === 1` as a
  fatal message. Operating on the mdast covers ATX (`# `) and setext (`===`)
  H1 in both `.md` (plain remark) and `.mdx` (remark-mdx) uniformly.
- Added an ESLint flat-config block in `eslint.config.js` scoped to
  `src/content/presentations/**/*.{md,mdx}` that uses `eslint-plugin-mdx`
  (`...mdx.flat`), points `parserOptions.remarkConfigPath` at the custom
  remark config, and sets `mdx/remark` to `error`.
- Removed the body H1 from the existing presentations (`sample-md.md`,
  `sample-mdx.mdx`, `release-branch-workflow.md`) so the tree is clean.

### Why this approach

ESLint flat config has no Markdown language for `.md`, and `@eslint/markdown`
does not parse `.mdx`. `eslint-plugin-mdx` is the only option that lints both
`.md` and `.mdx` through one mechanism (remark/mdast), so the single custom
remark rule covers both formats with no format-specific duplication.

The block also disables `no-unused-vars` / `@typescript-eslint/no-unused-vars`
for these content files. The globally applied `typescript-eslint/recommended`
config has no `files` restriction, so once `.mdx` became lintable it would
otherwise flag an imported-but-JSX-used MDX component as unused. Presentation
content is not the TypeScript project, so those source rules are turned off
there rather than narrowing the global TS config.

### Known issue: eslint-mdx 3.7.0 `ignoreRemarkConfig`

`eslint.config.js` intentionally does **not** set
`parserOptions.ignoreRemarkConfig: true`. In `eslint-mdx@3.7.0`, that code
path skips `getRemarkConfig`, which is the only place that populates the
internal ignore-check cache, and the worker then crashes with
`TypeError: ignoreCheckCache.get(...) is not a function`. Passing only
`remarkConfigPath` avoids the bug; the repo has no other remark config, so the
effective behavior is the same. This workaround can be removed once
`eslint-mdx` ships a fix for that path (re-test by setting
`ignoreRemarkConfig: true` and running `pnpm lint`).

## Open issues

There are no known open issues with the current setup beyond the documented
`eslint-mdx@3.7.0` workaround above. If future major upgrades of ESLint,
TypeScript, Astro, or their plugins introduce peer dependency or configuration
incompatibilities, update the affected package versions/configuration together
and rerun `pnpm typecheck`, `pnpm lint`, and `pnpm format:check`.
