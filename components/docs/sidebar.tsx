import { ScrollArea } from "@/components/ui/scroll-area";
import { buildNavTree } from "@/lib/navigation";
import { SidebarNavItem } from "@/components/docs/sidebar-nav-item";

export function Sidebar() {
  const tree = buildNavTree();

  return (
    <ScrollArea className="h-full py-6 pr-4">
      <nav className="flex flex-col gap-1">
        {tree.map((entry, i) => (
          <SidebarNavItem key={i} entry={entry} />
        ))}
      </nav>
    </ScrollArea>
  );
}
