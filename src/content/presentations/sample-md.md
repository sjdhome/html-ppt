---
title: Markdown Parity Preview
description: A draft plain-Markdown presentation that verifies .md renders identically to .mdx (Mermaid, Obsidian callouts, code badge, task lists).
date: 2026-05-19
draft: true
---

This draft `.md` page confirms that plain Markdown presentations render with
the same pipeline as `.mdx`: Mermaid diagrams, Obsidian callouts, the
code-language badge, and task-list cleanup.

## Mermaid

```mermaid
flowchart TD
  A[.md or .mdx] --> B[markdown pipeline]
  B --> C[rehypeMermaid]
  C --> D[Rendered SVG]
```

## Obsidian callout

> [!NOTE]
> Callout syntax works in plain Markdown, not just MDX.

> [!WARNING] Custom title
> Warnings stay readable in light and dark themes.

## Code and task list

```ts
const parity: boolean = true;
```

- [x] Mermaid renders in `.md`
- [x] Callouts render in `.md`
- [ ] Anything else still missing
