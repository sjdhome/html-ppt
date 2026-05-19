const CALLOUT_MARKER_PATTERN =
  /^\[!([A-Za-z][A-Za-z0-9_-]*)\]([+-]?)([^\S\r\n]*)([^\r\n]*)(?:\r?\n)?/;

const DEFAULT_TITLES = new Map([
  ["abstract", "Abstract"],
  ["attention", "Attention"],
  ["bug", "Bug"],
  ["caution", "Caution"],
  ["check", "Check"],
  ["cite", "Cite"],
  ["danger", "Danger"],
  ["done", "Done"],
  ["error", "Error"],
  ["example", "Example"],
  ["fail", "Fail"],
  ["failure", "Failure"],
  ["faq", "FAQ"],
  ["help", "Help"],
  ["hint", "Hint"],
  ["important", "Important"],
  ["info", "Info"],
  ["missing", "Missing"],
  ["note", "Note"],
  ["question", "Question"],
  ["quote", "Quote"],
  ["success", "Success"],
  ["summary", "Summary"],
  ["tip", "Tip"],
  ["tldr", "TL;DR"],
  ["todo", "Todo"],
  ["warning", "Warning"],
]);

type MarkdownNode = {
  type?: string;
  value?: string;
  children?: MarkdownNode[];
  data?: {
    hProperties?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type CalloutMarker = {
  type: string;
  foldMarker: string;
  title: string;
  remainingText: string;
};

const getChildren = (node: MarkdownNode): MarkdownNode[] => node.children ?? [];

const getData = (node: MarkdownNode): NonNullable<MarkdownNode["data"]> => {
  node.data ??= {};
  return node.data;
};

const getHProperties = (node: MarkdownNode): Record<string, unknown> => {
  const data = getData(node);
  data.hProperties ??= {};
  return data.hProperties;
};

const readClassNames = (className: unknown): string[] => {
  if (Array.isArray(className)) {
    return className.filter(
      (value): value is string => typeof value === "string",
    );
  }

  if (typeof className === "string") {
    return className.split(/\s+/).filter(Boolean);
  }

  return [];
};

const addClassNames = (node: MarkdownNode, classNames: string[]): void => {
  const hProperties = getHProperties(node);
  hProperties.className = Array.from(
    new Set([...readClassNames(hProperties.className), ...classNames]),
  );
};

const normalizeCalloutType = (value: string): string =>
  value
    .toLowerCase()
    .replaceAll("_", "-")
    .replace(/[^a-z0-9-]/g, "");

const getDefaultTitle = (type: string): string => {
  const knownTitle = DEFAULT_TITLES.get(type);

  if (knownTitle !== undefined) {
    return knownTitle;
  }

  return type
    .split("-")
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
};

const parseCalloutMarker = (value: string): CalloutMarker | undefined => {
  const match = CALLOUT_MARKER_PATTERN.exec(value);

  if (match === null) {
    return undefined;
  }

  const [, rawType, foldMarker, whitespace, rawTitle] = match;
  const markerHasSeparator = whitespace.length > 0 || match[0].endsWith("\n");

  if (rawTitle.length > 0 && !markerHasSeparator) {
    return undefined;
  }

  const type = normalizeCalloutType(rawType);

  if (type.length === 0) {
    return undefined;
  }

  return {
    type,
    foldMarker,
    title: rawTitle.trim(),
    remainingText: value.slice(match[0].length),
  };
};

const createCalloutTitle = (callout: CalloutMarker): MarkdownNode => ({
  type: "paragraph",
  data: {
    hProperties: {
      className: ["obsidian-callout-title"],
    },
  },
  children: [
    {
      type: "text",
      value:
        callout.title.length > 0
          ? callout.title
          : getDefaultTitle(callout.type),
    },
  ],
});

const visit = (
  node: MarkdownNode,
  visitor: (node: MarkdownNode) => void,
): void => {
  visitor(node);

  for (const child of getChildren(node)) {
    visit(child, visitor);
  }
};

const transformBlockquote = (node: MarkdownNode): void => {
  if (node.type !== "blockquote") {
    return;
  }

  const blockquoteChildren = getChildren(node);
  const firstChild = blockquoteChildren[0];

  if (firstChild?.type !== "paragraph") {
    return;
  }

  const paragraphChildren = getChildren(firstChild);
  const firstParagraphChild = paragraphChildren[0];

  if (
    firstParagraphChild?.type !== "text" ||
    firstParagraphChild.value === undefined
  ) {
    return;
  }

  const callout = parseCalloutMarker(firstParagraphChild.value);

  if (callout === undefined) {
    return;
  }

  addClassNames(node, ["obsidian-callout", `obsidian-callout-${callout.type}`]);
  const hProperties = getHProperties(node);
  hProperties.dataCallout = callout.type;

  if (callout.foldMarker.length > 0) {
    hProperties.dataCalloutFold = callout.foldMarker;
  }

  const titleNode = createCalloutTitle(callout);

  if (callout.remainingText.length > 0) {
    firstParagraphChild.value = callout.remainingText;
    blockquoteChildren.unshift(titleNode);
    return;
  }

  paragraphChildren.shift();

  if (paragraphChildren.length === 0) {
    blockquoteChildren.splice(0, 1, titleNode);
    return;
  }

  blockquoteChildren.unshift(titleNode);
};

// The public transformer accepts `unknown` so it stays assignable to Astro's
// strict `RemarkPlugin` type (mdast `Root` is not structurally compatible with
// the local `MarkdownNode` shape). The tree is treated as `MarkdownNode`
// internally, matching the structural style of the other local plugins.
export const remarkObsidianCallouts =
  () =>
  (tree: unknown): void => {
    visit(tree as MarkdownNode, transformBlockquote);
  };
