"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type NavEntry, isNavGroup } from "@/lib/navigation-types";

export function SidebarNavItem({ entry }: { entry: NavEntry }) {
  // usePathname from i18n/navigation returns path WITHOUT locale prefix
  const pathname = usePathname();

  if (isNavGroup(entry)) {
    return (
      <Collapsible defaultOpen className="group/collapsible">
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

  // Both pathname and entry.href are WITHOUT locale prefix, so comparison works
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
