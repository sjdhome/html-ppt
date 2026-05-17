# Development server port

## Requirement

The local debug/development server should default to port `3000`, while still allowing callers to override the port through the `PORT` environment variable.

## What changed

- Added `zod` as a runtime dependency for environment-variable validation.
- Added `@types/node` as a development dependency so the Node-based Astro config can type-check `process.env`.
- Updated `astro.config.mjs` so Astro's development server uses `3000` when `PORT` is unset or blank.
- Validated `PORT` with Zod before passing it to Astro. Accepted values must coerce to an integer from `0` through `65535`.

## Usage

```sh
pnpm dev
PORT=4321 pnpm dev
```

## Open issues

No open issues are known. If a deployment or hosting platform reserves `PORT` for non-development behavior in the future, this configuration can be split by command or environment mode.
