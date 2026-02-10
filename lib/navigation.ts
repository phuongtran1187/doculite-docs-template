import { docs } from "#site/content";
import fs from "fs";
import path from "path";
import type { NavItem, NavGroup, NavTree } from "@/lib/navigation-types";
import { DEFAULT_LOCALE } from "@/lib/i18n-config";

// Re-export types for convenience in server components
export type { NavItem, NavGroup, NavEntry, NavTree } from "@/lib/navigation-types";
export { isNavGroup } from "@/lib/navigation-types";

interface MetaEntry {
  title: string;
  order: number;
}

/**
 * Load _meta.json for a directory, with locale-specific override.
 * Tries _meta.{locale}.json first for non-default locales, falls back to _meta.json.
 */
function loadMeta(dir: string, locale: string = DEFAULT_LOCALE): Record<string, MetaEntry> {
  const base = path.join(process.cwd(), "content", dir);

  // Try locale-specific meta first (e.g., _meta.vi.json)
  if (locale !== DEFAULT_LOCALE) {
    const localePath = path.join(base, `_meta.${locale}.json`);
    if (fs.existsSync(localePath)) {
      return JSON.parse(fs.readFileSync(localePath, "utf-8"));
    }
  }

  // Fallback to default _meta.json
  const defaultPath = path.join(base, "_meta.json");
  if (fs.existsSync(defaultPath)) {
    return JSON.parse(fs.readFileSync(defaultPath, "utf-8"));
  }
  return {};
}

// Format slug segment into display title (kebab-case → Title Case)
function formatTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Build navigation tree from Velite docs collection + _meta.json files.
 * Server-only: uses fs to read _meta.json files.
 *
 * For non-default locales, includes EN docs as fallback for untranslated pages
 * so the sidebar shows ALL pages (untranslated ones link to EN fallback + banner).
 *
 * Hrefs are returned WITHOUT locale prefix (e.g., /docs/slug).
 * Use next-intl Link which adds the prefix automatically.
 */
export function buildNavTree(locale: string = DEFAULT_LOCALE): NavTree {
  const published = docs.filter((doc) => doc.published);

  // Get docs for requested locale
  const localeDocs = published.filter((doc) => doc.locale === locale);

  // For non-default locale, merge in EN docs as fallback for untranslated pages
  let mergedDocs = localeDocs;
  if (locale !== DEFAULT_LOCALE) {
    const enDocs = published.filter((doc) => doc.locale === DEFAULT_LOCALE);
    const localeSlugSet = new Set(localeDocs.map((d) => d.slugAsParams));
    const fallbackDocs = enDocs.filter((d) => !localeSlugSet.has(d.slugAsParams));
    mergedDocs = [...localeDocs, ...fallbackDocs];
  }

  const rootDocs: NavItem[] = [];
  const grouped = new Map<string, NavItem[]>();

  for (const doc of mergedDocs) {
    const params = doc.slugAsParams;
    const segments = params.split("/").filter(Boolean);

    if (segments.length === 0) {
      rootDocs.push({ title: doc.title, href: "/docs", order: doc.order });
    } else if (segments.length === 1) {
      rootDocs.push({ title: doc.title, href: `/docs/${params}`, order: doc.order });
    } else {
      const dir = segments[0];
      if (!grouped.has(dir)) grouped.set(dir, []);
      grouped.get(dir)!.push({ title: doc.title, href: `/docs/${params}`, order: doc.order });
    }
  }

  const docsMeta = loadMeta("docs", locale);
  const groups: NavGroup[] = [];

  for (const [dir, items] of grouped) {
    const meta = docsMeta[dir];
    const dirMeta = loadMeta(`docs/${dir}`, locale);

    const sortedItems = items
      .map((item) => {
        const slug = item.href.split("/").pop()!;
        const itemMeta = dirMeta[slug];
        return {
          ...item,
          title: itemMeta?.title ?? item.title,
          order: itemMeta?.order ?? item.order,
        };
      })
      .sort((a, b) => a.order - b.order);

    groups.push({
      title: meta?.title ?? formatTitle(dir),
      order: meta?.order ?? 999,
      items: sortedItems,
    });
  }

  const sortedRoot = rootDocs.sort((a, b) => a.order - b.order);
  const sortedGroups = groups.sort((a, b) => a.order - b.order);

  return [...sortedRoot, ...sortedGroups];
}
