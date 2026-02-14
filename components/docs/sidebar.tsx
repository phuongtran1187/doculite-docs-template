import { ScrollArea } from "@/components/ui/scroll-area";
import { buildNavTree } from "@/lib/navigation";
import { SidebarNavItem } from "@/components/docs/sidebar-nav-item";

export function Sidebar({ locale = "en" }: { locale?: string }) {
  const tree = buildNavTree(locale);

  return (
    <div className="h-full pt-6 pb-20">
      <ScrollArea className="h-full pr-4">
        <nav className="flex flex-col gap-1">
          {tree.map((entry, i) => (
            <SidebarNavItem key={i} entry={entry} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
