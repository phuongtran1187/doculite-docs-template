import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  if (!siteConfig.footer?.text) return null;
  return (
    <footer className="relative z-40 border-t bg-background py-6">
      <div className="container mx-auto flex items-center justify-center px-4 md:px-8">
        <p className="text-sm text-muted-foreground">
          Built with{" "}
          <a
            href={`https://github.com/${siteConfig.github?.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            Doculite
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
