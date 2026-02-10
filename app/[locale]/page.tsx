import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Code,
  Search,
  Palette,
  LayoutGrid,
  Terminal,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "MDX Content",
    description: "Write documentation in MDX with full React component support.",
    color: "text-green-400",
    border: "border-green-500/20",
  },
  {
    icon: Code,
    title: "Syntax Highlighting",
    description: "Beautiful code blocks powered by Shiki with dual theme support.",
    color: "text-purple-400",
    border: "border-purple-500/20",
  },
  {
    icon: Search,
    title: "Search",
    description: "Fast client-side search across all documentation pages.",
    color: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    icon: LayoutGrid,
    title: "Components",
    description: "Rich MDX components like Callout, Tabs, Steps, and more.",
    color: "text-orange-400",
    border: "border-orange-500/20",
  },
  {
    icon: Palette,
    title: "Dark Mode",
    description: "Automatic theme switching with system preference detection.",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    icon: Terminal,
    title: "Developer First",
    description: "Built with Next.js 16, TypeScript, and Tailwind CSS v4.",
    color: "text-yellow-400",
    border: "border-yellow-500/20",
  },
];

/* Syntax-highlighted code snippet for the hero — theme-aware colors */
/* Light: github-light palette | Dark: github-dark palette */
function CodePreview() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-sm shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-zinc-400 dark:text-zinc-500">
          site-config.ts
        </span>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          <span className="text-purple-700 dark:text-purple-400">export const</span>{" "}
          <span className="text-blue-700 dark:text-blue-400">siteConfig</span>{" "}
          <span className="text-zinc-500">=</span>{" "}
          <span className="text-amber-700 dark:text-yellow-400">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="text-blue-600 dark:text-blue-300">name</span>
          <span className="text-zinc-500">:</span>{" "}
          <span className="text-green-700 dark:text-green-400">{'"Doculite"'}</span>
          <span className="text-zinc-500">,</span>
          {"\n"}
          {"  "}
          <span className="text-blue-600 dark:text-blue-300">description</span>
          <span className="text-zinc-500">:</span>{" "}
          <span className="text-green-700 dark:text-green-400">{'"A modern docs template"'}</span>
          <span className="text-zinc-500">,</span>
          {"\n"}
          {"  "}
          <span className="text-blue-600 dark:text-blue-300">navLinks</span>
          <span className="text-zinc-500">:</span>{" "}
          <span className="text-amber-700 dark:text-yellow-400">{"["}</span>
          {"\n"}
          {"    "}
          <span className="text-amber-700 dark:text-yellow-400">{"{"}</span>{" "}
          <span className="text-blue-600 dark:text-blue-300">title</span>
          <span className="text-zinc-500">:</span>{" "}
          <span className="text-green-700 dark:text-green-400">{'"Docs"'}</span>
          <span className="text-zinc-500">,</span>{" "}
          <span className="text-blue-600 dark:text-blue-300">href</span>
          <span className="text-zinc-500">:</span>{" "}
          <span className="text-green-700 dark:text-green-400">{'"\/docs"'}</span>{" "}
          <span className="text-amber-700 dark:text-yellow-400">{"}"}</span>
          {"\n"}
          {"  "}
          <span className="text-amber-700 dark:text-yellow-400">{"]"}</span>
          <span className="text-zinc-500">,</span>
          {"\n"}
          <span className="text-amber-700 dark:text-yellow-400">{"}"}</span>
          <span className="text-zinc-500">;</span>
        </code>
      </pre>
    </div>
  );
}

// Home page stays English-only (i18n scope is docs only)
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(128,128,128,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-blue-500/10 via-purple-500/10 to-green-500/10 blur-3xl dark:from-blue-500/15 dark:via-purple-500/15 dark:to-green-500/15" />

        <div className="container relative mx-auto px-4 py-24 md:px-8 md:py-32 lg:py-40">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            {/* Left: copy */}
            <div className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                Open Source
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="text-foreground">Docs that </span>
                <span className="bg-linear-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
                  developers love
                </span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                A lightweight, forkable documentation starter built with Next.js,
                MDX, and shadcn/ui. Beautiful syntax highlighting, fast search,
                and dark mode out of the box.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/docs">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://github.com/phuongtran1187/doculite-docs-template"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4 fill-current"
                    >
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                    </svg>
                    GitHub
                  </a>
                </Button>
              </div>
              {/* Install snippet */}
              <div className="mt-6 w-full max-w-md rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 font-mono text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                <span className="select-none text-zinc-400 dark:text-zinc-600">$ </span>
                <span className="text-green-700 dark:text-green-400">npx</span>{" "}
                create-next-app --example doculite my-docs
              </div>
            </div>

            {/* Right: code preview */}
            <div className="hidden lg:block">
              <CodePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Everything you need for great docs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Batteries included. Fork, customize, and ship.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group cursor-default rounded-xl border ${feature.border} bg-background p-6 transition-colors hover:border-border hover:bg-muted/50`}
              >
                <feature.icon
                  className={`mb-3 h-5 w-5 ${feature.color} transition-colors`}
                />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-20 text-center md:px-8 md:py-28">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ready to build?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Get started in under a minute. Clone the template, add your content,
            and deploy.
          </p>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link href="/docs/getting-started/installation">
                Read the Docs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
