# HTML PPT

A minimal Astro project for building presentation-style HTML pages.

## Project Expectations

This project is built with Astro and React for conference and meeting presentation reports. Traditional Microsoft PowerPoint is not dynamic enough for some presentation scenarios, and this project uses familiar frontend technologies to create richer presentation effects, such as dynamic and interactive components.

Markdown content is rendered with MDX, while custom presentation components are written in React. Astro is used to reduce unnecessary client-side JavaScript and keep pages lightweight. The site is not intended for search engine indexing or public discovery; it is only for presentation use during talks.

## Toolchain

Use Node.js 25 and pnpm 11. The project intentionally locks only major versions.

```sh
pnpm install
pnpm dev
pnpm build
```

See `docs/toolchain.md` for the version policy and `docs/dependency-build-scripts.md` for dependency build-script handling.
