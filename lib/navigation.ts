import { docs } from "#site/content";
import fs from "fs";
import path from "path";
import type { NavItem, NavGroup, NavTree, NavEntry } from "@/lib/navigation-types";
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

// Intermediate tree node for recursive tree building
interface TreeNode {
  docs: NavItem[];                    // leaf docs at this directory level
  children: Map<string, TreeNode>;    // sub-directories
}

function createTreeNode(): TreeNode {
  return { docs: [], children: new Map() };
}

/**
 * Recursively convert a TreeNode into sorted NavEntry[].
 * Loads _meta.json at each level for titles/orders of both docs and sub-groups.
 */
function convertTreeNode(node: TreeNode, metaDir: string, locale: string): NavEntry[] {
  const meta = loadMeta(metaDir, locale);
  const entries: NavEntry[] = [];

  // Leaf docs — apply meta overrides for title/order
  for (const item of node.docs) {
    const slug = item.href.split("/").pop()!;
    const itemMeta = meta[slug];
    entries.push({
      ...item,
      title: itemMeta?.title ?? item.title,
      order: itemMeta?.order ?? item.order,
    });
  }

  // Sub-directories → NavGroup (recursive)
  for (const [dir, childNode] of node.children) {
    const dirMeta = meta[dir];
    const childEntries = convertTreeNode(childNode, `${metaDir}/${dir}`, locale);
    entries.push({
      title: dirMeta?.title ?? formatTitle(dir),
      order: dirMeta?.order ?? 999,
      items: childEntries,
    } satisfies NavGroup);
  }

  return entries.sort((a, b) => a.order - b.order);
}

/**
 * Build navigation tree from Velite docs collection + _meta.json files.
 * Server-only: uses fs to read _meta.json files.
 *
 * Supports arbitrary nesting depth — sub-directories become collapsible NavGroups.
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

  // Build intermediate tree by walking slug segments
  const root = createTreeNode();

  for (const doc of mergedDocs) {
    const segments = doc.slugAsParams.split("/").filter(Boolean);

    if (segments.length <= 1) {
      // Root-level doc (e.g., /docs or /docs/getting-started)
      root.docs.push({
        title: doc.title,
        href: segments.length === 0 ? "/docs" : `/docs/${doc.slugAsParams}`,
        order: doc.order,
      });
    } else {
      // Nested doc — walk to the parent directory node
      let node = root;
      for (let i = 0; i < segments.length - 1; i++) {
        if (!node.children.has(segments[i])) {
          node.children.set(segments[i], createTreeNode());
        }
        node = node.children.get(segments[i])!;
      }
      node.docs.push({
        title: doc.title,
        href: `/docs/${doc.slugAsParams}`,
        order: doc.order,
      });
    }
  }

  return convertTreeNode(root, "docs", locale);
}
