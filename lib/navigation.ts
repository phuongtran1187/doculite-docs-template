import { docs } from "#site/content";
import fs from "fs";
import path from "path";
import type { NavItem, NavGroup, NavTree } from "@/lib/navigation-types";

// Re-export types for convenience in server components
export type { NavItem, NavGroup, NavEntry, NavTree } from "@/lib/navigation-types";
export { isNavGroup } from "@/lib/navigation-types";

interface MetaEntry {
  title: string;
  order: number;
}

function loadMeta(dir: string): Record<string, MetaEntry> {
  const metaPath = path.join(process.cwd(), "content", dir, "_meta.json");
  if (fs.existsSync(metaPath)) {
    return JSON.parse(fs.readFileSync(metaPath, "utf-8"));
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
 */
export function buildNavTree(): NavTree {
  const published = docs.filter((doc) => doc.published);

  const rootDocs: NavItem[] = [];
  const grouped = new Map<string, NavItem[]>();

  for (const doc of published) {
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

  const docsMeta = loadMeta("docs");
  const groups: NavGroup[] = [];

  for (const [dir, items] of grouped) {
    const meta = docsMeta[dir];
    const dirMeta = loadMeta(`docs/${dir}`);

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
