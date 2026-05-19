# Obsidian callout syntax in Markdown and MDX

## Requirement

Presentation `.md` and `.mdx` files should understand Obsidian-style callout blockquotes such as `[!NOTE]`, `[!WARNING]`, and related variants, so presentation authors can paste or write familiar Obsidian notes without rewriting them as custom HTML or React components.

## How it works

- `astro.config.ts` registers the local `remarkObsidianCallouts` plugin in the top-level `markdown` config, which Astro applies to `.md` files and `@astrojs/mdx` inherits for `.mdx` (it sets no remark/rehype lists of its own). This single source of truth keeps both file types identical.
- `src/lib/remarkObsidianCallouts.ts` scans Markdown blockquotes for an initial Obsidian marker line.
- Matching blockquotes receive stable classes such as `obsidian-callout` and `obsidian-callout-warning`.
- The marker line is replaced with a title paragraph using either the marker's custom title or a default title for the callout type.
- `src/styles/markdown.css` contains the visual styling and is imported by `src/styles/global.css` after GitHub Markdown CSS. The file also contains other Markdown-specific overrides such as task-list checkbox styling and code-block language badges.

## Authoring examples

```mdx
> [!NOTE]
> This becomes a note callout.

> [!WARNING] Custom warning title
> This becomes a warning callout with a custom title.
```

Supported marker names are normalized to lowercase and may include letters, numbers, `_`, or `-`. Known names such as `note`, `tip`, `warning`, `danger`, `quote`, and their aliases receive grouped colors and icons. Unknown names still render as callouts with the default note color and a generated title.

## Open issues

Obsidian fold markers (`[!NOTE]+` and `[!NOTE]-`) are parsed and emitted as metadata, but they do not currently create collapsible callouts. This can be implemented later if presentation content needs interactive open/closed behavior, likely by rendering a `<details>` structure or adding a small hydrated component.

The callout CSS now lives in the consolidated Markdown override file instead of a callout-only stylesheet. If callout styling becomes large enough to maintain separately, it can be split again as long as `src/styles/global.css` preserves import order after GitHub Markdown CSS.
