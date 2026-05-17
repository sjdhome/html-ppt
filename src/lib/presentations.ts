import type { CollectionEntry } from "astro:content";

export type PresentationEntry = CollectionEntry<"presentations">;

export const shouldIncludePresentation = (
  presentation: PresentationEntry,
): boolean => import.meta.env.DEV || !presentation.data.draft;

export const sortPresentationsByDateDesc = (
  presentations: PresentationEntry[],
): PresentationEntry[] =>
  presentations.toSorted(
    (left, right) => right.data.date.getTime() - left.data.date.getTime(),
  );
