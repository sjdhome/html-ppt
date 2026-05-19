type HastProperties = Record<
  string,
  string | number | boolean | null | undefined | Array<string | number>
>;

type HastNode = {
  type: string;
  tagName?: string;
  properties?: HastProperties;
  value?: string;
  children?: HastNode[];
};

type HastRoot = {
  type: "root";
  children: HastNode[];
};

const LANGUAGE_CLASS_PREFIX = "language-";
const MERMAID_LANGUAGE = "mermaid";

const isElement = (node: HastNode): boolean => node.type === "element";

const getClassNames = (node: HastNode): string[] => {
  const className = node.properties?.className;

  if (Array.isArray(className)) {
    return className.map(String);
  }

  if (typeof className === "string") {
    return className.split(/\s+/).filter(Boolean);
  }

  return [];
};

const collectText = (node: HastNode): string => {
  if (node.type === "text") {
    return node.value ?? "";
  }

  return node.children?.map(collectText).join("") ?? "";
};

const getMermaidCodeNode = (preNode: HastNode): HastNode | undefined => {
  if (!isElement(preNode) || preNode.tagName !== "pre") {
    return undefined;
  }

  const codeNode = preNode.children?.find(
    (child) => isElement(child) && child.tagName === "code",
  );

  if (!codeNode) {
    return undefined;
  }

  const isMermaid = getClassNames(codeNode).includes(
    `${LANGUAGE_CLASS_PREFIX}${MERMAID_LANGUAGE}`,
  );

  return isMermaid ? codeNode : undefined;
};

// Rewrites fenced ```mermaid blocks into <pre class="mermaid">SOURCE</pre>,
// the markup mermaid.run() looks for on the client. Stripping the
// language-mermaid code child also stops rehypeMarkdownRendering from adding a
// misleading data-language badge, so this plugin must run before it.
const rewriteMermaidBlocks = (node: HastNode): void => {
  const codeNode = getMermaidCodeNode(node);

  if (codeNode) {
    const source = collectText(codeNode).replace(/\n$/, "");

    node.properties = {
      ...node.properties,
      className: ["mermaid"],
    };
    node.children = [{ type: "text", value: source }];

    return;
  }

  node.children?.forEach(rewriteMermaidBlocks);
};

export const rehypeMermaid =
  () =>
  (tree: HastRoot): void => {
    rewriteMermaidBlocks(tree);
  };
