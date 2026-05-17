# Code quality tooling

## Requirement

The project needs TypeScript, React, ESLint, Prettier, and lint-staged configured. TypeScript should target the ESNext standard, Prettier should ignore `pnpm-lock.yaml`, and commits should be blocked unless type checking, ESLint, and Prettier checks pass.

## What changed

- Added React support through `react`, `react-dom`, and the Astro React integration in `astro.config.mjs`.
- Configured `tsconfig.json` to use ESNext target, module, and library settings with React JSX support.
- Added ESLint flat config for JavaScript, TypeScript, Astro, React, and React Hooks.
- Added Prettier with the Astro plugin and `.prettierignore` so generated output and `pnpm-lock.yaml` are not formatted or checked.
- Added lint-staged for staged-file ESLint and Prettier checks.
- Added Husky with a `pre-commit` hook that runs `pnpm precommit`.
- Added package scripts for `typecheck`, `lint`, `format`, `format:check`, and `precommit`.

## Commit behavior

Before a commit is accepted, Husky runs:

```sh
pnpm typecheck && pnpm lint && pnpm format:check && pnpm lint-staged
```

This ensures the full project passes Astro/TypeScript type checking, ESLint, and Prettier checks before the staged-file lint-staged checks run.

## Open issues

There are no known open issues with the current setup. If future major upgrades of ESLint, TypeScript, Astro, or their plugins introduce peer dependency or configuration incompatibilities, update the affected package versions/configuration together and rerun `pnpm typecheck`, `pnpm lint`, and `pnpm format:check`.
