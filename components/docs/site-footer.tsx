import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  if (!siteConfig.footer?.text) return null;
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto flex items-center justify-center px-4 md:px-8">
        <p className="text-sm text-muted-foreground">{siteConfig.footer.text}</p>
      </div>
    </footer>
  );
}
