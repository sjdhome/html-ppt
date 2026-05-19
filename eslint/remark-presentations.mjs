// Remark config consumed by eslint-plugin-mdx (the `mdx/remark` rule) for
// presentation articles only.
//
// Rule: a presentation must not contain a level-1 heading. The presentation
// page template (src/pages/presentations/[slug].astro) already renders the
// frontmatter `title` as the page's H1, so a second H1 in the body duplicates
// the title and breaks the document outline.
//
// This works for both .md (plain remark) and .mdx (remark-mdx): both produce
// mdast `heading` nodes, so ATX (`# `) and setext (`===`) H1 are both caught.

function remarkNoToplevelHeading() {
  return (tree, file) => {
    const walk = (node) => {
      if (node.type === "heading" && node.depth === 1) {
        const message = file.message(
          "Level-1 headings are not allowed in presentation articles; " +
            "the page title is rendered from frontmatter. Use ## or deeper.",
          node,
        );
        message.fatal = true;
        message.ruleId = "no-toplevel-heading";
        message.source = "remark-presentations";
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}

export default {
  plugins: [remarkNoToplevelHeading],
};
