# Dependency build scripts

## Requirement

The project should make pnpm explicitly skip dependency build scripts for packages that normally provide prebuilt binaries on the target platforms used by this project.

## What changed

`pnpm-workspace.yaml` now declares:

```yaml
allowBuilds:
  esbuild: false
  sharp: false
```

This tells pnpm that the install/build scripts for `esbuild` and `sharp` are intentionally denied, rather than left as unapproved pending scripts.

## Rationale

Both packages usually resolve to platform-specific prebuilt optional dependencies:

- `esbuild` uses packages such as `@esbuild/darwin-arm64` for its native executable.
- `sharp` uses packages such as `@img/sharp-darwin-arm64` and `@img/sharp-libvips-darwin-arm64` for its native addon and libvips runtime.

On platforms where these prebuilt packages are available, skipping their install/build scripts avoids unnecessary native build behavior while keeping runtime functionality intact.

## Open issues

If this project is installed on a platform without suitable prebuilt packages, or with optional dependencies disabled, `esbuild` or `sharp` may fail at runtime. In that case, change the affected package from `false` to `true` in `allowBuilds`, or re-run pnpm's build approval workflow.
