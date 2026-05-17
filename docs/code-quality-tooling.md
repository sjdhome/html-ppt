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

## Open issues

There are no known open issues with the current setup. If future major upgrades of ESLint, TypeScript, Astro, or their plugins introduce peer dependency or configuration incompatibilities, update the affected package versions/configuration together and rerun `pnpm typecheck`, `pnpm lint`, and `pnpm format:check`.
