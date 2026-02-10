import { docs } from "#site/content";

export interface SearchEntry {
  title: string;
  description: string;
  slug: string;
  href: string;
  headings: string[];
  category: string;
}

export function getSearchIndex(): SearchEntry[] {
  return docs
    .filter((doc) => doc.published)
    .map((doc) => ({
      title: doc.title,
      description: doc.description || "",
      slug: doc.slugAsParams,
      href: `/docs/${doc.slugAsParams}`,
      headings: doc.toc?.map((h: { title: string }) => h.title) || [],
      category: doc.slugAsParams.split("/")[0] || "docs",
    }));
}
