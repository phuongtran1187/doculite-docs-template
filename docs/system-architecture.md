# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Doculite Documentation (Phase 2)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  GET /vi/docs/guides/routing                     │
│  │  Browser │◄─────────────────┐                               │
│  └──────────┘                   │ Response                      │
│      │                          │                              │
│      └─ Request ────────────────┼────────────────────────────┐ │
│                                 │                            │ │
│  ┌─────────────────────────────▼──────────────────┐         │ │
│  │  middleware.ts (next-intl)                     │         │ │
│  │  • Parse locale from URL: "vi"                │         │ │
│  │  • Validate against SUPPORTED_LOCALES         │         │ │
│  │  • Set X-locale-preferred header              │         │ │
│  │  • Redirect if invalid locale                 │         │ │
│  └─────────────────────────────┬──────────────────┘         │ │
│                                 │ Locale: "vi"               │ │
│  ┌─────────────────────────────▼──────────────────────┐     │ │
│  │  Next.js Route Handler                          │     │ │
│  │  app/[locale]/docs/[[...slug]]/page.tsx        │     │ │
│  │                                                  │     │ │
│  │  • Get locale: "vi" from route params          │     │ │
│  │  • Get slug: "guides/routing"                  │     │ │
│  │  • Call getDocBySlug(slug, locale)             │     │ │
│  │  • generateStaticParams() pre-renders all      │     │ │
│  │    docs × locales at build time                │     │ │
│  └─────────────────────────────┬──────────────────────┘     │ │
│                                 │                            │ │
│  ┌──────────────────────────────▼────────────────────────┐  │ │
│  │  Velite Content Layer (.velite/)                      │  │ │
│  │  ┌──────────────────────────────────────────────────┐ │  │ │
│  │  │ MDX Content (content/docs/guides/routing.vi.mdx) │ │  │ │
│  │  │ • Compiled to JS                                │ │  │ │
│  │  │ • Locale: "vi", slugAsParams: "guides/routing" │ │  │ │
│  │  │ • With syntax highlighting via Shiki            │ │  │ │
│  │  └──────────────────────────────────────────────────┘ │  │ │
│  └─────────────────────────────┬────────────────────────────┘  │ │
│                                 │                               │ │
│  ┌──────────────────────────────▼────────────────────────────┐ │ │
│  │  Data Access Layer (lib/docs.ts)                         │ │ │
│  │  • getDocBySlug("guides/routing", "vi")                 │ │ │
│  │  • Returns: { doc, isFallback } | null                 │ │ │
│  │  • Fallback: vi → en → null                            │ │ │
│  └─────────────────────────────┬────────────────────────────┘ │ │
│                                 │ Doc object                   │ │
│  ┌──────────────────────────────▼────────────────────────────┐ │ │
│  │  Component Layer                                          │ │ │
│  │  • Docs Layout (breadcrumbs, sidebar, TOC, pagination)   │ │ │
│  │  • MDX Components (Callout, Tabs, Steps, Cards, Code)    │ │ │
│  │  • shadcn/ui primitives                                  │ │ │
│  │  • Theme toggle, Search (cmdk)                           │ │ │
│  └─────────────────────────────┬────────────────────────────┘ │ │
│                                 │                               │ │
│                                 └──────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Layers

### 0. Request Routing (middleware.ts)

**Input:** Incoming HTTP request

**Processing:**
```
GET http://example.com/vi/docs/guides/routing
   │
   ├─ middleware.ts (via createMiddleware(routing))
   │  ├─ Parse URL path: "/vi/docs/guides/routing"
   │  ├─ Extract locale from first segment: "vi"
   │  ├─ Validate locale in SUPPORTED_LOCALES: ✓
   │  ├─ Set request locale context
   │  └─ Continue to route handler
   │
   └─ app/[locale]/docs/[[...slug]]/page.tsx
      └─ Receives: locale="vi", slug=["guides", "routing"]
```

**Middleware Matcher:**
- Include: `/((?!api|_next|_vercel|.*\..*).*)` (all routes except static/internal)
- Excludes: `/api/*`, `/_next/*`, `/_vercel/*`, static files (`.css`, `.js`, etc.)

**Invalid Locale Handling:**
```
GET /unknown/docs/guides/routing
   │
   ├─ middleware: locale "unknown" NOT in SUPPORTED_LOCALES
   └─ Redirect to /en/docs/guides/routing (defaultLocale)
```

### 1. Content Layer (Velite)

**Input:** MDX files in `content/docs/**/*.mdx`

**Processing:**
```
File: content/docs/guides/routing.vi.mdx
   │
   ├─ Velite reads file
   ├─ Parse frontmatter (title, description, order, published)
   ├─ Compile MDX to JavaScript
   ├─ Apply Shiki syntax highlighting
   └─ Extract table of contents from headings
   │
   ├─ Transform phase:
   │  ├─ Extract slug from path: "docs/guides/routing.vi"
   │  ├─ Detect locale suffix: "vi"
   │  ├─ Clean slug: "guides/routing"
   │  └─ Add fields: locale, slugAsParams
   │
   └─ Output to .velite/index.js (runtime data)
      └─ Output to .velite/index.d.ts (TypeScript types)
```

**Output type:**
```typescript
interface Doc {
  title: string;
  description?: string;
  slug: string;              // "docs/guides/routing.vi"
  slugAsParams: string;      // "guides/routing"
  locale: Locale;            // "vi"
  body: string;              // Compiled MDX code
  toc: HeadingItem[];
  order: number;
  published: boolean;
}
```

### 2. Data Query Layer (lib/docs.ts)

**Purpose:** Provide locale-aware, fallback-aware access to docs

**Functions:**

```typescript
// Get single doc with fallback info
getDocBySlug(slug: string, locale = "en")
  → { doc: Doc, isFallback: boolean } | null

// Get all published docs in locale
getAllDocs(locale = "en")
  → Doc[]

// Get docs in directory, filtered by locale
getDocsByDirectory(dir: string, locale = "en")
  → Doc[] (sorted by order)

// Check if translation exists (without fallback)
isDocTranslated(slug: string, locale: Locale)
  → boolean
```

**Fallback Logic:**

```
getDocBySlug("guides/routing", "vi")
  ├─ Try: Find doc where slugAsParams="guides/routing" && locale="vi"
  ├─ If found → return { doc, isFallback: false }
  │
  ├─ If not found, try fallback (only if locale ≠ "en"):
  │  └─ Find doc where slugAsParams="guides/routing" && locale="en"
  │     ├─ If found → return { doc, isFallback: true }
  │     └─ If not found → return null
  │
  └─ If locale="en" and not found → return null directly (no fallback)
```

**Caller responsibility:** Check `isFallback` flag to render "not translated" banner

### 3. Route Layer (app/[locale]/docs/[[...slug]]/page.tsx)

**Input:** Route params from Next.js router

**Processing:**
```
GET /vi/docs/guides/routing (via middleware)
  │
  ├─ Route params: { locale: "vi", slug: ["guides", "routing"] }
  ├─ Extract slug: "guides/routing"
  ├─ Get locale from route: "vi"
  ├─ Call getDocBySlug("guides/routing", "vi")
  ├─ If result is null → notFound() (404)
  ├─ If result exists → render doc
  │  └─ If isFallback=true → show "not translated" banner
  │
  ├─ In generateStaticParams():
  │  ├─ For each supported locale:
  │  │  ├─ Get all published docs in that locale
  │  │  ├─ Generate params: { locale, slug: ["guides", "routing"] }
  │  │  └─ Pre-render /vi/docs/guides/routing, etc.
  │  └─ Scales: docs × locales static paths
  │
  └─ In generateMetadata():
     ├─ Use doc.title, doc.description for <head> tags
     └─ Include locale metadata (Phase 3)
```

**Static Param Generation (Phase 2):**
```typescript
export async function generateStaticParams() {
  const params: Array<{ locale: string; slug?: string[] }> = [];

  for (const locale of SUPPORTED_LOCALES) {
    // Home page
    params.push({ locale });

    // All docs in this locale
    for (const doc of getAllDocs(locale)) {
      params.push({
        locale,
        slug: doc.slugAsParams.split("/"),
      });
    }
  }

  return params;  // Generates ~N × M static pages (docs × locales)
}
```

### 4. Component Layer

**Layout Components** (`components/docs/`):
- **breadcrumbs** — Shows path: Docs > Guides > Routing
- **sidebar** — Navigation tree from `_meta.json`
- **toc** — Table of contents from doc headings
- **pagination** — Previous/next doc links
- **mdx-content** — Renders compiled MDX

**MDX Components** (`components/mdx/`):
- Users can insert custom components in MDX:
  ```mdx
  <Callout type="warning">Be careful!</Callout>
  <Tabs items={["React", "Vue"]}>
    <Tabs.Tab>React code...</Tabs.Tab>
    <Tabs.Tab>Vue code...</Tabs.Tab>
  </Tabs>
  ```

**Styling:** Tailwind CSS v4, dark mode via `next-themes`

## Locale Configuration

### File: `lib/i18n-config.ts`

```typescript
// Supported locales - add new locale here
export const SUPPORTED_LOCALES = ["en", "vi"] as const;

// Type-safe locale type
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Default fallback locale
export const DEFAULT_LOCALE: Locale = "en";

// UI labels for locale picker (Phase 3)
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

// Type guard for user input validation
export function isValidLocale(s: string): s is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(s);
}
```

### Adding New Locale

1. Add to `SUPPORTED_LOCALES`:
   ```typescript
   export const SUPPORTED_LOCALES = ["en", "vi", "ja"] as const;
   ```

2. Add label:
   ```typescript
   export const LOCALE_LABELS: Record<Locale, string> = {
     en: "English",
     vi: "Tiếng Việt",
     ja: "日本語",
   };
   ```

3. Create translation files:
   ```
   content/docs/guides/routing.ja.mdx
   content/docs/api/overview.ja.mdx
   ```

4. Rebuild:
   ```bash
   pnpm build
   ```

Types auto-update, no code changes needed.

## Build & Deployment Pipeline

### Local Development

```bash
pnpm dev
  └─ Watches content/docs/ for changes
  └─ Re-runs Velite on file save
  └─ Hot-reloads dev server
```

### Production Build

```bash
pnpm build
  ├─ Step 1: ESLint validation
  ├─ Step 2: TypeScript type-check
  ├─ Step 3: Velite content generation
  │  ├─ Read all MDX files
  │  ├─ Apply locale extraction transform
  │  ├─ Generate .velite/index.js + .d.ts
  │  └─ Generate static params for all docs
  ├─ Step 4: Next.js build
  │  ├─ Pre-render all routes (SSG)
  │  ├─ Bundle client-side JS
  │  └─ Output to .next/
  └─ Success → ready to deploy
```

**Build artifact:** `.next/` directory (fully static, no server runtime needed for docs)

### Deployment

- **Static hosting:** Vercel, Netlify, GitHub Pages
- **Environment vars:** None required (content-only build)
- **Cache busting:** Automatic on each commit (content hash)

## Security Model

### Content Security

- **Input:** Only MDX from repo (no user uploads)
- **Processing:** Velite validates YAML frontmatter
- **Output:** Sanitized via Shiki (syntax highlighting only)
- **Attack surface:** Minimal (no database, no user input)

### Code Execution

- **MDX components:** Defined in repo, whitelisted in `mdx-components.tsx`
- **No eval():** Compiled MDX runs as JavaScript functions
- **Props validation:** Component props validated by React

### Type Safety

- **TypeScript strict mode:** Catches type errors at build time
- **Locale validation:** `isValidLocale()` guard for user input
- **Route params:** Validated in `generateStaticParams()`

## Performance Characteristics

### Build Time

- **Time:** 5-30 seconds (depends on doc count)
- **Bottleneck:** Velite MDX compilation + Shiki highlighting
- **Optimization:** No image processing in Phase 1

### Runtime Performance

- **Query latency:** ~0ms (in-memory JavaScript)
- **Search latency:** ~10-100ms (depends on index size)
- **Page render:** <100ms (all static HTML)

### Bundle Size

- **HTML:** ~20KB per page (minified)
- **JS:** ~200-400KB (Next.js framework + components)
  - Can be reduced by lazy-loading search (Phase 3)
- **CSS:** ~50-100KB (Tailwind pruned)

## Scalability Limits

### Current (Phase 1)

- **Docs:** Up to 1000 supported (no issues observed)
- **Locales:** 2-10 optimal (no hard limit)
- **Build time:** Linear with doc count
- **Search:** Indexes all locales (performance OK for <5K docs)

### Future Optimizations (Phase 2+)

- Lazy-load search index per locale
- Implement ISR (incremental static regeneration)
- Add image optimization (sharp)
- Split large doc collections by category

## Known Limitations & Constraints

### Phase 2 (Routing)

1. **UI:** No locale picker or switching (Phase 3)
   - Users can't change language via UI
   - Must manually edit URL to switch locales

2. **Search:** Indexes all locales together (Phase 3)
   - Can't filter search results by language
   - Results may include all locale variants

3. **Navigation:** Not locale-aware (Phase 3)
   - Sidebar shows all docs regardless of current locale
   - No "missing translation" indicator

4. **SEO:** No multilingual metadata (Phase 4)
   - No hreflang tags for alternate language versions
   - No per-locale sitemap.xml

### By Design

1. **No database:** Content only via filesystem + git
2. **No SSR:** All pages pre-generated at build time
3. **No user uploads:** Content defined in repo only
4. **No multitenancy:** Single site, single content source

## Tech Debt & Future Work

### Planned (Phases 3-4)

- [ ] Language picker UI (Phase 3)
- [ ] Locale-filtered search (Phase 3)
- [ ] Sidebar locale-aware filtering (Phase 3)
- [ ] Multi-language sitemap.xml (Phase 4)
- [ ] hreflang for SEO (Phase 4)
- [ ] Sample multilingual content (Phase 4)

### Optional

- Image optimization (sharp)
- CDN caching headers
- Analytics per locale
- Visitor language detection (redirect)
