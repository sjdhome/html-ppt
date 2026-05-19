---
title: Markdown Mermaid Preview
description: A draft plain-Markdown presentation that verifies Mermaid rendering works in .md files, not only .mdx.
date: 2026-05-19
draft: true
---

# Mermaid in plain Markdown

This draft `.md` page confirms that fenced `mermaid` code blocks render as
diagrams in plain Markdown presentations, just like in `.mdx`.

```mermaid
flowchart TD
  A[.md file] --> B[markdown.rehypePlugins: rehypeMermaid]
  B --> C[pre.mermaid + source]
  C --> D[Client script]
  D --> E[Rendered SVG]
```

Plain Markdown still works around the diagram: **bold**, _italic_, and
`inline code`.
