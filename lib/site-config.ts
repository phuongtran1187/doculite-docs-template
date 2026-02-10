import type { DoculiteConfig } from "@/lib/config-types";

export const siteConfig: DoculiteConfig = {
  name: "Doculite",
  description: "A modern documentation template built with Next.js and shadcn/ui.",
  url: "https://doculite.dev",
  navLinks: [
    { title: "Docs", href: "/docs" },
    { title: "GitHub", href: "https://github.com/phuongtran1187/doculite-docs-template", external: true },
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com/phuongtran1187/doculite-docs-template" },
  ],
  footer: {
    text: "Built with Doculite.",
  },
  github: {
    repo: "phuongtran1187/doculite-docs-template",
    editUrl: "https://github.com/phuongtran1187/doculite-docs-template/edit/main/content",
  },
};
