"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchEntry } from "@/lib/search";

interface SearchCommandProps {
  entries: SearchEntry[];
}

export function SearchCommand({ entries }: SearchCommandProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  // Group entries by category
  const grouped = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.category]) {
        acc[entry.category] = [];
      }
      acc[entry.category].push(entry);
      return acc;
    },
    {} as Record<string, SearchEntry[]>
  );

  return (
    <>
      {/* Icon-only on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="size-5" />
        <span className="sr-only">Search</span>
      </Button>
      {/* Full button on desktop */}
      <Button
        variant="outline"
        className="relative hidden h-9 justify-start text-sm text-muted-foreground sm:pr-12 md:flex md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 size-4" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(grouped).map(([category, items]) => (
            <CommandGroup
              key={category}
              heading={category.charAt(0).toUpperCase() + category.slice(1)}
            >
              {items.map((entry) => (
                <CommandItem
                  key={entry.href}
                  value={`${entry.title} ${entry.description}`}
                  onSelect={() => handleSelect(entry.href)}
                >
                  <FileText />
                  <span>{entry.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
