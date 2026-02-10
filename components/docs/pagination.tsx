import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildNavTree, type NavEntry, isNavGroup } from "@/lib/navigation";

// Flatten nav tree into ordered list of { title, href }
function flattenTree(entries: NavEntry[]): { title: string; href: string }[] {
  const result: { title: string; href: string }[] = [];
  for (const entry of entries) {
    if (isNavGroup(entry)) {
      result.push(...flattenTree(entry.items));
    } else {
      result.push({ title: entry.title, href: entry.href });
    }
  }
  return result;
}

export function DocPagination({ slug }: { slug: string }) {
  const tree = buildNavTree();
  const flat = flattenTree(tree);
  const currentHref = slug ? `/docs/${slug}` : "/docs";
  const index = flat.findIndex((item) => item.href === currentHref);

  if (index === -1) return null;

  const prev = index > 0 ? flat[index - 1] : null;
  const next = index < flat.length - 1 ? flat[index + 1] : null;

  return (
    <div className="mt-12 flex items-center justify-between">
      {prev ? (
        <Link
          href={prev.href}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {next.title}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
