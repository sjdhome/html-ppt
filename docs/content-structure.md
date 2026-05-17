# MDX presentation content structure

## Requirement

The project needs a basic content structure where the home page automatically lists every displayable presentation, each detail page renders MDX as a Markdown article using GitHub Markdown Light/Dark styling, and MDX files can import external React components.

## What changed

- Added MDX support through `@astrojs/mdx` in `astro.config.mjs`.
- Added GitHub Markdown styling through `github-markdown-css`, imported from `src/styles/global.css`.
- Added an Astro 6 content collection in `src/content.config.ts` using the `glob()` loader from `astro/loaders`.
- Added a reusable `src/layouts/BaseLayout.astro` wrapper so document metadata can be expanded later for OpenGraph, Twitter cards, and other shared head tags.
- Updated `src/pages/index.astro` to load presentations with `getCollection("presentations")` instead of hard-coding content links.
- Added `src/pages/presentations/[slug].astro` to render presentation detail pages with `render()` from `astro:content`.
- Added a draft sample at `src/content/presentations/sample-mdx.mdx` and a React component at `src/components/DemoCounter.tsx`.

## Adding a presentation

Create an MDX file under `src/content/presentations/`:

```mdx
---
title: My Presentation
description: Optional summary shown on the home page and in metadata.
date: 2026-05-17
draft: false
---

Your Markdown or MDX content goes here.
```

The file path determines the route. For example:

- `src/content/presentations/demo.mdx` becomes `/presentations/demo/`.
- `src/content/presentations/team/report.mdx` becomes `/presentations/team/report/`.

## Draft behavior

The `draft` frontmatter field controls visibility:

- `draft: true` entries are visible during local development (`pnpm dev`).
- `draft: true` entries are excluded from production builds and generated routes.
- `draft: false` entries are visible everywhere.

This lets unfinished presentation work remain available for local review without publishing it in production output.

## Sample Markdown preview

`src/content/presentations/sample-mdx.mdx` is a draft-only kitchen-sink page used to preview the rendered effect of many Markdown and MDX constructs before writing real presentation content. It now covers headings, paragraphs, inline formatting, blockquotes, nested lists, task-list style items, fenced code, links, images, tables, horizontal rules, native details blocks, callout-style blockquotes, escaped characters, and a hydrated React component.

The sample keeps table and callout source in Markdown form for parser-support visibility, and also includes an HTML table fallback so table styling can be reviewed even when GitHub-flavored table parsing is not enabled. No extra Markdown parser plugins were added for this content-only update. The fallback can be removed if the project later enables a GitHub-flavored Markdown plugin such as `remark-gfm`.

## React components in MDX

MDX files can import React components from `src/components/` and hydrate them with Astro client directives when interactivity is needed:

```mdx
import DemoCounter from "../../components/DemoCounter.tsx";

<DemoCounter client:load />
```

Static components do not need a client directive. Interactive React components should use the narrowest suitable directive for the presentation behavior.

## Styling conventions

Styles are split by scope:

- `src/styles/global.css` contains global reset/base styles and imports `github-markdown-css`.
- `*.module.css` files contain page-specific or component-specific styles.
- Detail pages apply GitHub Markdown styles with the global `markdown-body` class and combine it with local CSS Module classes for layout.

This keeps global CSS limited to intentional shared behavior while avoiding accidental page or component style leakage.

## Detail page title spacing

The presentation detail body keeps the original horizontal and bottom padding values, but its top padding subtracts GitHub Markdown CSS's heading top margin (`--base-size-24`). This makes the rendered `h1` title's distance from the article border equal to the previous padding value: 45px on desktop and 24px on narrow screens.

No open issues are known for this spacing adjustment. If `github-markdown-css` changes its `h1` top margin token in the future, the top padding calculation should be reviewed against the updated upstream heading styles.

## Open issues

OpenGraph, Twitter large-image cards, and final presentation metadata are not implemented yet. They can be added in `src/layouts/BaseLayout.astro` once the required image assets, canonical URL policy, and sharing metadata fields are decided.
