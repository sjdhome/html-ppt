# Toolchain version policy

## Requirement

The project should declare the expected Node.js and pnpm toolchain versions without relying on Corepack, which is deprecated in Node.js 25.

## What changed

The project now uses explicit engine constraints:

- `.node-version` contains `25` so Node version managers can select Node.js 25.
- `package.json` declares `engines.node` as `>=25 <26`.
- `package.json` declares `engines.pnpm` as `>=10`.
- `.npmrc` enables `engine-strict=true` so installs fail clearly when the toolchain version is outside the supported range.

No `packageManager` field or Corepack configuration was added.

## Rationale

Node.js remains locked to the tested major version family while still allowing patch and minor updates for fixes. pnpm is intentionally broader: version 10 and newer are accepted so contributors do not need to upgrade to pnpm 11 when pnpm 10 is sufficient for this project. The current local toolchain is Node.js 25.9.0 and pnpm 11.1.2.

## Open issues

If Node.js 26 becomes the desired baseline, update `.node-version`, `package.json` engines, and this document together, then run `pnpm install` to refresh lockfile metadata if needed. If a future pnpm feature requires raising the package-manager baseline, update `engines.pnpm` and this document at the same time.
