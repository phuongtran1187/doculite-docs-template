# Code Standards & Architecture

## TypeScript Configuration

- **Strict Mode** — Enabled for all files
- **Lib Target** — ES 2020
- **Module** — ESNext
- **Path Aliases** — `@/*` for `src/` imports
- **Trailing Commas** — Always in multi-line structures

## i18n Implementation Standards (Phase 2)

### Locale Constants

**Location:** `lib/i18n-config.ts`

All locale-related constants centralized:

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

**Adding new locale:**
1. Add to `SUPPORTED_LOCALES` array
2. Add label to `LOCALE_LABELS`
3. Create `messages/{locale}.json` file
4. Create/translate content files: `*.{locale}.mdx`
5. Run `pnpm build` to regenerate types and static params

### Next-intl Routing

**Location:** `i18n/routing.ts`

Centralized routing config:

```typescript
export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",  // EN: /docs, VI: /vi/docs
});
```

**Never hardcode locale lists** — always import from `SUPPORTED_LOCALES`.

### Middleware

**Location:** `middleware.ts`

Validates locale in URL before route handler:

```typescript
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],  // Excludes static files
};
```

**Behavior:**
- Valid locale → passes to route handler via request context
- Invalid locale → redirects to `defaultLocale`
- Static files, API routes → pass through unchanged

### Locale-Aware Queries

**Location:** `lib/docs.ts`

All document queries accept locale parameter:

```typescript
// Always pass locale from route context
function queryDocs(slug: string, locale: Locale = DEFAULT_LOCALE) { ... }
```

**Fallback strategy:**
1. Try exact match: `slug` + requested `locale`
2. If not found AND requested locale ≠ EN: try EN
3. Return null if no match

**Return type for `getDocBySlug()`:**
```typescript
{ doc: Doc, isFallback: boolean } | null
```

Callers must check `isFallback` to show "not translated" banner.

### Route Params Handling

**Location:** `app/[locale]/docs/[[...slug]]/page.tsx`

Always extract locale from route params, never assume:

```typescript
export default async function DocPage({
  params,
}: {
  params: { locale: string; slug?: string[] };
}) {
  // Validate locale type
  if (!isValidLocale(params.locale)) notFound();

  // Use typed locale
  const locale = params.locale as Locale;
  const slug = (params.slug ?? []).join("/");

  const result = getDocBySlug(slug, locale);
  if (!result) notFound();

  const { doc, isFallback } = result;
  // Render...
}
```

**Static param generation must include all locales:**

```typescript
export async function generateStaticParams() {
  const params: Array<{ locale: string; slug?: string[] }> = [];

  // For each supported locale
  for (const locale of SUPPORTED_LOCALES) {
    params.push({ locale });  // Homepage

    // All docs in this locale
    for (const doc of getAllDocs(locale)) {
      params.push({
        locale,
        slug: doc.slugAsParams.split("/"),
      });
    }
  }

  return params;  // Build pre-generates: ~N × M pages
}
```

### Content Filename Convention

**English (default):**
```
content/docs/getting-started/installation.mdx
```

**Translation (Vietnamese example):**
```
content/docs/getting-started/installation.vi.mdx
```

**Pattern:** `{slug}.{locale}.mdx`

**Velite processing:**
- Extracts locale from filename suffix
- Validates against `SUPPORTED_LOCALES`
- Strips locale suffix from final `slugAsParams`
- Defaults to EN if no valid locale suffix found

### Type Safety

**Doc type includes:**
```typescript
interface Doc {
  title: string;
  description?: string;
  slug: string;              // Full path from Velite
  slugAsParams: string;      // Clean slug without locale suffix
  locale: Locale;            // NEW - Phase 1
  body: string;              // MDX compiled code
  toc: TableOfContents[];
  order: number;
  published: boolean;
}
```

## Component Architecture

### Layout Components

**Location:** `components/docs/`

- **mdx-content.tsx** — Renders compiled MDX
- **breadcrumbs.tsx** — Navigation breadcrumbs
- **pagination.tsx** — Previous/next doc links
- **toc.tsx** — Table of contents from headings
- **sidebar.tsx** — Navigation sidebar from `_meta.json`

### MDX Components

**Location:** `components/mdx/`

Custom components for content:
- **Callout** — Info/warning/error boxes
- **Tabs** — Tabbed content
- **Steps** — Numbered step lists
- **Cards** — Flexible card layouts
- **CodeBlock** — Enhanced code blocks with copy button
- **FileTree** — Visual file structure

**Registration:** `mdx-components.tsx` defines available components

### UI Primitives

**Location:** `components/ui/`

shadcn/ui components:
- Button, Input, Select, Tabs
- Accordion, AlertDialog, Popover
- Etc. (standard shadcn suite)

## Query Pattern Standards

### Synchronous Document Queries

All queries in `lib/docs.ts` are **synchronous** (work with static Velite output):

```typescript
// Always sync - no async/await needed
const doc = getDocBySlug("guides/installation");
```

### Locale Parameter

Locale parameter always:
- Optional (defaults to `DEFAULT_LOCALE`)
- Last parameter
- Type-safe via `Locale` type

```typescript
// Good
getDocsByDirectory("guides", "vi");
getAllDocs("vi");

// Bad - locale not last
getAllDocs("vi", "guides");

// Bad - not using type
getAllDocs("vi" as any);
```

## Velite Schema Standards

**Location:** `velite.config.ts`

### Transform Function

Always use `.transform()` for computed fields:

```typescript
.transform((data) => {
  // Computed fields here
  return { ...data, locale, slugAsParams };
})
```

**Must preserve original fields** via spread operator.

### Adding Fields

1. Define in schema
2. Add to transform return type
3. Update `.velite/index.d.ts` generated types (auto)
4. Add tests for new field

## Naming Conventions

### Variables & Functions

- **camelCase** for variables, functions, parameters
- **UPPER_SNAKE_CASE** for constants (const exported at module level)
- **PascalCase** for types, interfaces, React components

### Files

- **kebab-case** for component files (`button.tsx`, `mdx-content.tsx`)
- **kebab-case** for utilities (`site-config.ts`, `i18n-config.ts`)
- **[brackets]** for dynamic routes (`[[...slug]]`)
- **dot notation** for translations (`.vi.mdx`)

### Types

- Prefix interface/type with concept name
- Use `Record<K, V>` for object maps
- Use `as const` for literal types

```typescript
// Good
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const LOCALE_LABELS: Record<Locale, string> = { ... };

// Less clear
export type L = string;
export const labels = { en: "...", vi: "..." };
```

## Error Handling

### Not Found

```typescript
import { notFound } from "next/navigation";

export async function DocPage({ params }) {
  const result = getDocBySlug(slug);
  if (!result) notFound();  // Renders 404
  return <Content />;
}
```

### Type Guards

Use custom type guards for validation:

```typescript
export function isValidLocale(s: string): s is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(s);
}

// Usage
if (isValidLocale(userInput)) {
  const docs = getDocs(userInput);  // userInput is Locale type
}
```

## Testing Standards

### Unit Tests

- Location: `__tests__/` parallel to source
- Pattern: `*.test.ts` or `*.test.tsx`
- Use Jest + React Testing Library

### Test Coverage

Minimum coverage by module:
- Utilities: 80%
- Components: 70%
- Integrations: 60%

### Locale Testing

Always test with multiple locales:

```typescript
describe("getDocs", () => {
  it("returns EN docs by default", () => { ... });
  it("returns VI docs when locale=vi", () => { ... });
  it("falls back to EN for untranslated VI doc", () => { ... });
});
```

## Performance Guidelines

### Static Generation

- Use `generateStaticParams()` for all doc routes
- Re-validate on content changes (ISR disabled)
- Pre-generate all locales in Phase 2

### Search Index

- Index at build time via Velite
- Keep index small (lazy load if >100KB)
- Filter by locale at query time (Phase 3)

### Bundle Size

- Lazy load `cmdk` command palette
- Split UI components dynamically
- Monitor with `next/bundle-analyzer`

## Accessibility

### Semantic HTML

- Use proper heading hierarchy (`h1` → `h2` → `h3`)
- Wrap form controls with `<label>`
- Use `aria-label` for icon buttons

### WCAG 2.1 AA

- Minimum 4.5:1 contrast ratio
- Keyboard navigation throughout
- Focus indicators visible
- Alt text for images (in MDX)

## Deployment

### Environment Variables

- No secrets in repo (use `.env.local` for dev)
- Deploy env vars via platform (Vercel, etc.)
- Types in `env.ts` with validation

### Build Process

```bash
pnpm build   # Runs: lint → type-check → next build
```

Velite runs automatically during build to generate `.velite/` output.

### Staging/Production

- Main branch → production
- Feature branches → staging (if configured)
- No manual content deploys (commit → auto-deploy)
