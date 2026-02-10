import { Sidebar } from "@/components/docs/sidebar";
import { MobileNav } from "@/components/docs/mobile-nav";
import { buildNavTree } from "@/lib/navigation";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = buildNavTree();

  return (
    <div className="container mx-auto flex-1 items-start px-4 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 md:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <Sidebar />
      </aside>
      <div className="fixed top-14 z-30 flex h-12 items-center md:hidden">
        <MobileNav tree={tree} />
      </div>
      <main className="relative py-6 pt-18 md:pt-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">{children}</div>
      </main>
    </div>
  );
}
