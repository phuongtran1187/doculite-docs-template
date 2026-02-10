# Doculite

A modern, lightweight documentation template built with Next.js 16 and shadcn/ui.

## Features

- **MDX Content** — Write docs with full React component support
- **Syntax Highlighting** — Shiki-powered with automatic light/dark themes
- **Command Palette Search** — Cmd+K / Ctrl+K instant search
- **Dark Mode** — Theme switching with next-themes
- **Rich Components** — Callout, Tabs, Steps, Cards, CodeBlock, FileTree
- **Responsive** — Mobile-first with sidebar, TOC, and mobile navigation
- **Type-Safe** — Full TypeScript with strict mode

## Quick Start

```bash
pnpm create next-app --example doculite-docs-template my-docs
cd my-docs
pnpm dev
```

Open [http://localhost:3000/docs](http://localhost:3000/docs)

## Customization

### Site Configuration

Edit `lib/site-config.ts` to change the site name, navigation links, social links, and footer.

### Content

Add MDX files to `content/docs/`. Use `_meta.json` files in each directory to control sidebar ordering.

### Components

Custom MDX components live in `components/mdx/`. They're registered in `mdx-components.tsx`.

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, SSG
- [Velite](https://velite.js.org) — Content layer for MDX
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [Tailwind CSS v4](https://tailwindcss.com) — Styling
- [Shiki](https://shiki.style) — Syntax highlighting
- [cmdk](https://cmdk.paco.me) — Command palette

## Project Structure

```
content/docs/    → MDX documentation files
app/docs/        → Next.js route handlers
components/docs/ → Documentation layout components
components/mdx/  → Custom MDX components
components/ui/   → shadcn/ui primitives
lib/             → Utilities and configuration
```

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

## License

MIT
