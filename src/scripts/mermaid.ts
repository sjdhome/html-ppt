// Client-side Mermaid rendering for presentation pages.
//
// rehypeMermaid turns ```mermaid fences into <pre class="mermaid">SOURCE</pre>.
// This module lazy-loads the mermaid bundle only when such elements exist,
// renders them, and re-renders on light/dark scheme changes so diagrams match
// the OS-driven theme used by the rest of the site.

const SELECTOR = "pre.mermaid";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const SRC_ATTRIBUTE = "data-mermaid-src";
const FALLBACK_CLASS = "mermaid-fallback";

const getTheme = (matches: boolean): "dark" | "default" =>
  matches ? "dark" : "default";

const revealSource = (elements: HTMLElement[]): void => {
  for (const element of elements) {
    const source = element.getAttribute(SRC_ATTRIBUTE);

    if (source !== null) {
      element.textContent = source;
    }

    element.classList.add(FALLBACK_CLASS);
  }
};

const setupMermaid = async (): Promise<void> => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

  if (elements.length === 0) {
    return;
  }

  for (const element of elements) {
    element.setAttribute(SRC_ATTRIBUTE, element.textContent ?? "");
  }

  const { default: mermaid } = await import("mermaid");
  const darkMedia = window.matchMedia(DARK_QUERY);

  const render = async (matches: boolean): Promise<void> => {
    for (const element of elements) {
      const source = element.getAttribute(SRC_ATTRIBUTE);

      if (source !== null) {
        element.textContent = source;
      }

      element.removeAttribute("data-processed");
    }

    mermaid.initialize({
      startOnLoad: false,
      theme: getTheme(matches),
    });

    await mermaid.run({ nodes: elements });
  };

  try {
    await render(darkMedia.matches);
  } catch (error) {
    console.error("Failed to render Mermaid diagrams:", error);
    revealSource(elements);
    return;
  }

  darkMedia.addEventListener("change", (event) => {
    void render(event.matches).catch((error: unknown) => {
      console.error("Failed to re-render Mermaid diagrams:", error);
      revealSource(elements);
    });
  });
};

void setupMermaid();
