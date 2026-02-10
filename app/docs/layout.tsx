import { Sidebar } from "@/components/docs/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex-1 items-start px-4 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 md:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside aria-label="Documentation sidebar" className="hidden shrink-0 md:block">
        <div className="fixed top-14 z-30 h-[calc(100vh-3.5rem)] w-[220px] lg:w-[240px]">
          <Sidebar />
        </div>
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_260px]">
        {children}
      </main>
    </div>
  );
}
