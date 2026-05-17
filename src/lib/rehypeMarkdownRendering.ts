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

const isElement = (node: HastNode): boolean => node.type === "element";

const isCheckboxInput = (node: HastNode): boolean =>
  isElement(node) &&
  node.tagName === "input" &&
  node.properties?.type === "checkbox";

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

const getCodeLanguage = (preNode: HastNode): string | undefined => {
  const codeNode = preNode.children?.find(
    (child) => isElement(child) && child.tagName === "code",
  );

  if (!codeNode) {
    return undefined;
  }

  const languageClass = getClassNames(codeNode).find((className) =>
    className.startsWith(LANGUAGE_CLASS_PREFIX),
  );

  return languageClass?.slice(LANGUAGE_CLASS_PREFIX.length) || undefined;
};

const removeWhitespaceAfterCheckboxes = (node: HastNode): void => {
  node.children?.forEach((child, index, children) => {
    if (isCheckboxInput(child)) {
      const nextChild = children[index + 1];

      if (nextChild?.type === "text" && nextChild.value) {
        nextChild.value = nextChild.value.replace(/^[\t ]+/, "");
      }
    }

    removeWhitespaceAfterCheckboxes(child);
  });
};

const addCodeBlockLanguages = (node: HastNode): void => {
  if (isElement(node) && node.tagName === "pre") {
    const language = getCodeLanguage(node);

    if (language) {
      node.properties = {
        ...node.properties,
        "data-language": language,
      };
    }
  }

  node.children?.forEach(addCodeBlockLanguages);
};

export const rehypeMarkdownRendering =
  () =>
  (tree: HastRoot): void => {
    removeWhitespaceAfterCheckboxes(tree);
    addCodeBlockLanguages(tree);
  };
