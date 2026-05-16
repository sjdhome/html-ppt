# Toolchain version policy

## Requirement

The project should declare the expected Node.js and pnpm toolchain versions without relying on Corepack, which is deprecated in Node.js 25.

## What changed

The project now uses major-version locks:

- `.node-version` contains `25` so Node version managers can select Node.js 25.
- `package.json` declares `engines.node` as `>=25 <26`.
- `package.json` declares `engines.pnpm` as `>=11 <12`.
- `.npmrc` enables `engine-strict=true` so installs fail clearly when the major toolchain version is outside the supported range.

No `packageManager` field or Corepack configuration was added.

## Rationale

Locking to the major version keeps the project on the tested toolchain family while still allowing patch and minor updates for fixes. This matches the current local toolchain, Node.js 25.9.0 and pnpm 11.1.2, without over-constraining contributors to an exact patch release.

## Open issues

If Node.js 26 or pnpm 12 becomes the desired baseline, update `.node-version`, `package.json` engines, and this document together, then run `pnpm install` to refresh lockfile metadata if needed.
