# Codebase Summary

## Project Overview

Doculite is a modern, lightweight documentation template built with Next.js 16 and shadcn/ui. It provides a complete documentation site with MDX support, syntax highlighting, search, dark mode, and multiple responsive components.

## Current Phase

**Phase 2: i18n Routing (Complete)** - Locale-aware routing with next-intl middleware and [locale] route tree.

## Core Architecture

### Tech Stack
- **Next.js 16** — App Router with SSG
- **Velite** — Content layer for MDX transformation
- **shadcn/ui** — UI component library
- **Tailwind CSS v4** — Styling
- **Shiki** — Syntax highlighting
- **cmdk** — Command palette search
- **TypeScript** — Full type safety

### Directory Structure

```
app/
  layout.tsx                           → Root layout (sets HTML lang)
  [locale]/
    layout.tsx                         → Locale validation + app chrome
    page.tsx                           → Landing page (locale-aware)
    docs/
      layout.tsx                       → Docs layout
      [[...slug]]/
        page.tsx                       → Docs page renderer (static + SSG)
i18n/
  routing.ts          (NEW - Phase 2)  → next-intl routing config
  request.ts          (NEW - Phase 2)  → Locale extraction + message loading
  navigation.ts       (NEW - Phase 2)  → Link/redirect helpers
middleware.ts         (NEW - Phase 2)  → Locale detection middleware
messages/
  en.json             (NEW - Phase 2)  → English UI translations
  vi.json             (NEW - Phase 2)  → Vietnamese UI translations
components/
  docs/               → Layout components (breadcrumbs, pagination, TOC, sidebar)
  mdx/                → Custom MDX components (Callout, Tabs, Steps, Cards, CodeBlock)
  ui/                 → shadcn/ui primitives
content/
  docs/               → MDX documentation files
    *.mdx             → Default locale (EN)
    *.vi.mdx          → Vietnamese locale
    _meta.json        → Sidebar ordering config
lib/
  i18n-config.ts      → Locale constants, types, validators
  docs.ts             → Locale-aware doc query functions
  site-config.ts      → Site metadata, navigation, social links
  navigation.ts       → Sidebar structure generator
  search.ts           → Content indexing and search
public/               → Static assets
.velite/              → Generated type definitions and content index
```

## Key Features

- **MDX Content** — Write docs with full React component support
- **Syntax Highlighting** — Shiki-powered with automatic light/dark themes
- **Command Palette Search** — Cmd+K / Ctrl+K instant search
- **Dark Mode** — Theme switching via next-themes
- **Type-Safe** — Full TypeScript with strict mode
- **Responsive** — Mobile-first layout with sidebar, TOC, mobile nav
- **Locale-Aware Routing** — URL-based routing with next-intl middleware (Phase 2)

## i18n Phase 2 Routing

### Overview

Locale-aware routing with next-intl middleware. URLs now include locale prefix: `/en/docs/...` (omitted), `/vi/docs/...`. Single `app/[locale]/` route tree handles all locales. Middleware validates locale and redirects invalid URLs.

### How It Works

**Request Flow:**
```
User visits: GET /vi/docs/guides/routing
    ↓
middleware.ts (next-intl/middleware)
    ├─ Parse locale from URL: "vi"
    ├─ Validate against SUPPORTED_LOCALES
    └─ Set request locale context
    ↓
app/[locale]/docs/[[...slug]]/page.tsx
    ├─ getLocale() → "vi" (from middleware)
    ├─ Extract slug: "guides/routing"
    ├─ Call getDocBySlug("guides/routing", "vi")
    ├─ If fallback needed, show banner
    └─ Render doc with locale layout
```

**Routing Config** (`i18n/routing.ts`):
```typescript
defineRouting({
  locales: SUPPORTED_LOCALES,          // ["en", "vi"]
  defaultLocale: DEFAULT_LOCALE,       // "en"
  localePrefix: "as-needed",           // EN: /docs, VI: /vi/docs
});
```

**Middleware** (`middleware.ts`):
```typescript
createMiddleware(routing)
// Matcher: /((?!api|_next|_vercel|.*\..*).*)
// Validates locale and redirects invalid URLs
```

**Request Config** (`i18n/request.ts`):
```typescript
getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Static Generation** (`app/[locale]/docs/[[...slug]]/page.tsx`):
```typescript
export async function generateStaticParams() {
  // For each locale:
  //   For each doc in that locale:
  //     Generate static path /[locale]/docs/[...slug]
  // Pre-renders ALL docs × locales at build time
}
```

### Implementation Details

**New Files (Phase 2):**
1. **i18n/routing.ts** (NEW)
   - Exports `routing` config from next-intl
   - Specifies `locales`, `defaultLocale`, `localePrefix: "as-needed"`

2. **i18n/request.ts** (NEW)
   - Loads locale from request context
   - Imports and returns messages for current locale
   - Falls back to `DEFAULT_LOCALE` if invalid locale requested

3. **i18n/navigation.ts** (NEW)
   - Exports `Link`, `redirect`, `useRouter`, `usePathname`, `getPathname`
   - Locale-aware navigation helpers from next-intl

4. **middleware.ts** (NEW)
   - Creates middleware from `createMiddleware(routing)`
   - Matcher: excludes API, _next, static files

5. **messages/en.json** (NEW)
   - English UI translation strings

6. **messages/vi.json** (NEW)
   - Vietnamese UI translation strings

**Modified Files (Phase 2):**
1. **next.config.ts** (MODIFIED)
   - Wrapped with `createNextIntlPlugin("./i18n/request.ts")`
   - Enables next-intl plugin integration

2. **app/layout.tsx** (MODIFIED)
   - Gets locale via `getLocale()` from next-intl
   - Sets `<html lang={locale}>`

3. **app/[locale]/layout.tsx** (NEW)
   - Validates locale parameter
   - Wraps app chrome (Providers, ThemeProvider, etc.)

4. **app/[locale]/page.tsx** (NEW)
   - Home page with locale-aware routing

5. **app/[locale]/docs/layout.tsx** (NEW)
   - Docs layout structure

6. **app/[locale]/docs/[[...slug]]/page.tsx** (NEW)
   - Replaces old `app/docs/[[...slug]]/page.tsx`
   - Gets `locale` from route params
   - Passes `locale` to `getDocBySlug(slug, locale)`
   - Generates static params for all docs × locales

### Usage Examples

**In Route Handler (app/[locale]/docs/[[...slug]]/page.tsx):**
```typescript
import { getLocale } from "next-intl/server";

export async function generateStaticParams() {
  // Build time: pre-generate all docs × locales
  const allLocales = SUPPORTED_LOCALES;
  const allDocs = getAllDocs();  // Across all locales

  const params: { locale: string; slug?: string[] }[] = [];
  for (const locale of allLocales) {
    params.push({ locale });  // Homepage: /[locale]
    for (const doc of allDocs.filter(d => d.locale === locale)) {
      params.push({
        locale,
        slug: doc.slugAsParams.split("/"),
      });
    }
  }
  return params;
}

export async function Page({ params }: { params: { locale: string; slug?: string[] } }) {
  const locale = params.locale as Locale;
  const slug = (params.slug ?? []).join("/");

  const result = getDocBySlug(slug, locale);
  if (!result) notFound();

  const { doc, isFallback } = result;
  // Render doc...
}
```

**In Client Component:**
```typescript
"use client";
import { useRouter, getPathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export function LocaleSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = getPathname();

  function switchLocale(newLocale: Locale) {
    router.push(pathname, { locale: newLocale });
  }

  return (
    <select value={locale} onChange={e => switchLocale(e.target.value as Locale)}>
      <option value="en">English</option>
      <option value="vi">Tiếng Việt</option>
    </select>
  );
}
```

### Supported Locales

| Locale | Label | Status |
|--------|-------|--------|
| en | English | Default, always available |
| vi | Tiếng Việt | Optional, falls back to EN |

## Development Workflow

### Content Creation

**Creating English docs:**
```bash
content/docs/getting-started/installation.mdx
```

**Creating Vietnamese translation:**
```bash
content/docs/getting-started/installation.vi.mdx
```

**Frontmatter fields:**
```yaml
---
title: "Page Title"
description: "Short description"
order: 1           # Sidebar ordering
published: true    # Visibility control
---
```

### Building

```bash
pnpm dev          # Development server (auto-reload on content changes)
pnpm build        # Production build (runs Velite transform)
pnpm lint         # ESLint validation
pnpm type-check   # TypeScript validation
```

### Content Organization

Use `_meta.json` files to control sidebar ordering:

```json
{
  "getting-started": {
    "icon": "FileText",
    "items": {
      "installation": "Installation",
      "configuration": "Configuration"
    }
  },
  "guides": {
    "items": {
      "routing": "Routing",
      "components": "Components"
    }
  }
}
```

## Customization Points

- **Site Config** → `lib/site-config.ts` (branding, links, social)
- **UI Components** → `components/mdx/` (custom MDX components)
- **Navigation** → `content/docs/_meta.json` (sidebar structure)
- **Styling** → Tailwind CSS v4 theme (globals.css)
- **Search** → `lib/search.ts` (indexing strategy)

## Next Phases (Planned)

- **Phase 3** — UI Updates: Locale picker dropdown, navigation sync, search filtering
- **Phase 4** — Polish: SEO metadata (hreflang, sitemap), sample multilingual content

## Build Output

Velite generates:
- `.velite/index.d.ts` — Type definitions for all collections
- `.velite/index.js` — Runtime doc data export
- Content indexed by slug, with `locale` and `slugAsParams` fields

## Known Limitations (Phase 2)

Addressed in Phase 3 and later:

- No locale picker UI (Phase 3)
- Search doesn't filter by locale (Phase 3)
- Navigation not locale-aware (Phase 3)
- No SEO metadata: hreflang, sitemap per locale (Phase 4)
