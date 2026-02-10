import Link from "next/link";

import { ThemeToggle } from "@/components/docs/theme-toggle";
import { SearchCommand } from "@/components/docs/search-command";
import { siteConfig } from "@/lib/site-config";
import { getSearchIndex } from "@/lib/search";

export function SiteHeader() {
  const entries = getSearchIndex();
  const githubLink = siteConfig.socialLinks?.find((link) => link.platform === "github");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 md:px-8">
        <Link href="/" className="mr-6 font-bold">
          {siteConfig.name}
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm">
          {siteConfig.navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.title}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.title}
              </Link>
            )
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchCommand entries={entries} />
          {githubLink && (
            <a
              href={githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" /></svg>
              <span className="sr-only">GitHub</span>
            </a>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
