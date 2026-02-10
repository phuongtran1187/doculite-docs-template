import type { DoculiteConfig } from "@/lib/config-types";

export const siteConfig: DoculiteConfig = {
  name: "Doculite",
  description: "A modern documentation template built with Next.js and shadcn/ui.",
  url: "https://doculite.dev",
  navLinks: [
    { title: "Docs", href: "/docs" },
    { title: "GitHub", href: "https://github.com/your-org/doculite", external: true },
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com/your-org/doculite" },
  ],
  footer: {
    text: "Built with Doculite.",
  },
  github: {
    repo: "your-org/doculite",
    editUrl: "https://github.com/your-org/doculite/edit/main/content",
  },
};
