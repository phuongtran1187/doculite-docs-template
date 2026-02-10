"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type NavEntry, isNavGroup } from "@/lib/navigation-types";

export function SidebarNavItem({ entry }: { entry: NavEntry }) {
  const pathname = usePathname();

  if (isNavGroup(entry)) {
    // Auto-expand if the group contains the active page
    const isActive = entry.items.some(
      (item) => !isNavGroup(item) && item.href === pathname
    );

    return (
      <Collapsible defaultOpen={isActive} className="group/collapsible">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold hover:bg-accent">
          {entry.title}
          <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-2 border-l pl-2">
            {entry.items.map((child, i) => (
              <SidebarNavItem key={i} entry={child} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const isActive = pathname === entry.href;

  return (
    <Link
      href={entry.href}
      className={cn(
        "flex w-full rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
        isActive
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {entry.title}
    </Link>
  );
}
