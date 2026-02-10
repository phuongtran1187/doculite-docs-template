"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import { type NavTree } from "@/lib/navigation";
import { SidebarNavItem } from "@/components/docs/sidebar-nav-item";

export function MobileNav({ tree }: { tree: NavTree }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sheet on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <ScrollArea className="h-full px-4 py-6">
          <nav className="flex flex-col gap-1">
            {tree.map((entry, i) => (
              <SidebarNavItem key={i} entry={entry} />
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
