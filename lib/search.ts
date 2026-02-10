import { docs } from "#site/content";
import { DEFAULT_LOCALE } from "@/lib/i18n-config";

export interface SearchEntry {
  title: string;
  description: string;
  slug: string;
  href: string;
  headings: string[];
  category: string;
}

/**
 * Build search index for a specific locale.
 * Only includes docs that are actually translated (no fallback — search shows what exists).
 * Hrefs are WITHOUT locale prefix (next-intl Link/router handles prefix).
 */
export function getSearchIndex(locale: string = DEFAULT_LOCALE): SearchEntry[] {
  return docs
    .filter((doc) => doc.published && doc.locale === locale)
    .map((doc) => ({
      title: doc.title,
      description: doc.description || "",
      slug: doc.slugAsParams,
      href: `/docs/${doc.slugAsParams}`,
      headings: doc.toc?.map((h: { title: string }) => h.title) || [],
      category: doc.slugAsParams.split("/")[0] || "docs",
    }));
}
