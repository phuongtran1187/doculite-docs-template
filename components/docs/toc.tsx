"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useActiveHeading } from "@/lib/toc";

interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

// Flatten TOC tree into a list of heading IDs for scrollspy
function collectIds(entries: TocEntry[]): string[] {
  const ids: string[] = [];
  for (const entry of entries) {
    ids.push(entry.url.replace("#", ""));
    if (entry.items.length > 0) ids.push(...collectIds(entry.items));
  }
  return ids;
}

// Flatten nested TOC tree into a flat list with depth info
function flattenToc(entries: TocEntry[], depth = 0): { entry: TocEntry; depth: number }[] {
  const result: { entry: TocEntry; depth: number }[] = [];
  for (const entry of entries) {
    result.push({ entry, depth });
    if (entry.items.length > 0) {
      result.push(...flattenToc(entry.items, depth + 1));
    }
  }
  return result;
}

function TocItems({
  entries,
  activeId,
}: {
  entries: TocEntry[];
  activeId: string;
}) {
  const flat = useMemo(() => flattenToc(entries), [entries]);

  return (
    <ul className="flex flex-col gap-2">
      {flat.map(({ entry, depth }) => {
        const id = entry.url.replace("#", "");
        const isActive = activeId === id;
        return (
          <li key={entry.url} style={{ paddingLeft: depth * 16 }}>
            <a
              href={entry.url}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                isActive ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {entry.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Toc({ toc }: { toc: TocEntry[] }) {
  const ids = useMemo(() => collectIds(toc), [toc]);
  const activeId = useActiveHeading(ids);

  if (toc.length === 0) return null;

  return (
    <div className="sticky top-16 -mt-10 max-h-[calc(100vh-6rem)] overflow-y-auto pt-10">
      <p className="mb-2 font-medium">On This Page</p>
      <TocItems entries={toc} activeId={activeId} />
    </div>
  );
}
