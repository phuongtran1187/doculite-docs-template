# Codebase Summary

## Project Overview

Doculite is a modern, lightweight documentation template built with Next.js 16 and shadcn/ui. It provides a complete documentation site with MDX support, syntax highlighting, search, dark mode, and multiple responsive components.

## Current Phase

**Phase 1: i18n Foundation (Complete)** - Multilingual content infrastructure with locale-aware data layer.

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
app/                  → Next.js App Router routes
  docs/               → Documentation pages and handlers
  layout.tsx          → Root layout
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
  i18n-config.ts      → Locale constants, types, validators (NEW - Phase 1)
  docs.ts             → Locale-aware doc query functions (Phase 1 update)
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
- **Multilingual Foundation** — Locale support with EN fallback (Phase 1)

## i18n Phase 1 Foundation

### Overview

Data layer foundation for multilingual content. Velite parses locale from filename suffix (`.vi.mdx`), query functions provide locale-aware filtering with English fallback.

### How It Works

**Filename Convention:**
```
docs/getting-started/installation.mdx    → locale: "en", slugAsParams: "getting-started/installation"
docs/getting-started/installation.vi.mdx → locale: "vi", slugAsParams: "getting-started/installation"
```

**Locale Constants** (`lib/i18n-config.ts`):
```typescript
export const SUPPORTED_LOCALES = ["en", "vi"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};
export function isValidLocale(s: string): s is Locale { ... }
```

**Data Layer** (`lib/docs.ts`):
```typescript
// Locale-aware queries with EN fallback
getDocBySlug(slug, locale?)          // Returns { doc, isFallback } | null
getAllDocs(locale?)                   // Filtered by locale
getDocsByDirectory(dir, locale?)      // Directory-filtered by locale
isDocTranslated(slug, locale)        // Check if translation exists
```

**Velite Transform** (`velite.config.ts`):
- Extracts locale from filename suffix
- Strips locale suffix from `slugAsParams`
- Adds `locale` field to Doc type
- Falls back to `DEFAULT_LOCALE` if no suffix found

### Implementation Details

**File Changes:**
1. **lib/i18n-config.ts** (NEW)
   - Type-safe locale constants
   - Locale label mapping (English names)
   - `isValidLocale()` type guard

2. **velite.config.ts** (MODIFIED)
   - Import `SUPPORTED_LOCALES, DEFAULT_LOCALE`
   - Transform extracts locale from filename suffix
   - Returns `{ locale, slugAsParams }` tuple

3. **lib/docs.ts** (MODIFIED)
   - All query functions accept optional `locale` param
   - `getDocBySlug()` returns `{ doc, isFallback }` to signal fallback usage
   - Fallback strategy: requested locale → EN → null

4. **app/docs/[[...slug]]/page.tsx** (MODIFIED)
   - Handle `getDocBySlug()` return type: `{ doc, isFallback } | null`
   - Destructure `{ doc }` from result

### Usage Examples

```typescript
// Get doc in Vietnamese, fall back to English if not translated
const result = getDocBySlug("getting-started/installation", "vi");
if (result?.isFallback) {
  // Show "not translated" banner
}

// Get all published docs in Vietnamese
const viDocs = getAllDocs("vi");

// Get docs under "guides/" directory in Vietnamese
const guides = getDocsByDirectory("guides", "vi");

// Check if a specific translation exists
const isTranslated = isDocTranslated("api/overview", "vi");
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

- **Phase 2** — Routing: Add next-intl, `[locale]` route pattern, middleware
- **Phase 3** — UI Updates: Locale picker, navigation sync, search filtering
- **Phase 4** — Polish: SEO metadata, sample multilingual content

## Build Output

Velite generates:
- `.velite/index.d.ts` — Type definitions for all collections
- `.velite/index.js` — Runtime doc data export
- Content indexed by slug, with `locale` and `slugAsParams` fields

## Known Limitations (Phase 1)

These are intentional for data-layer-only foundation, addressed in later phases:

- Routing still EN-only (Phase 2)
- No locale picker UI (Phase 3)
- Search doesn't filter by locale (Phase 3)
- Navigation not locale-aware (Phase 3)
