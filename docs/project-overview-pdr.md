# Project Overview & PDR

## Project Definition

**Doculite** is a modern, content-first documentation template for creating beautiful, maintainable docs sites. Built on Next.js 16 + Velite + shadcn/ui, it provides a complete solution with minimal configuration.

### Vision

Enable technical teams to build professional documentation sites in hours, not weeks, with:
- Minimal JavaScript (static-first architecture)
- Maximum developer experience (TypeScript, MDX, hot reload)
- Enterprise-ready features (search, dark mode, multilingual foundation)
- Mobile-first responsive design

### Target Users

- Small teams / solo developers
- Open-source projects
- Internal documentation portals
- API documentation sites
- Knowledge bases

## Product Development Requirements (PDR)

### Phase 1: Foundation (v1.0) - COMPLETE

**Goal:** Build multilingual data layer without breaking existing routing

**Features:**

1. **Locale Constants** (`lib/i18n-config.ts`)
   - Type-safe locale definitions: `["en", "vi"]`
   - Locale type: `type Locale = (typeof SUPPORTED_LOCALES)[number]`
   - Labels for UI: `{ en: "English", vi: "Tiếng Việt" }`
   - Type guard: `isValidLocale(s: string): s is Locale`
   - ✓ COMPLETE

2. **Filename Convention for Locales**
   - Pattern: `installation.mdx` (EN), `installation.vi.mdx` (VI)
   - Velite extracts locale from `.{locale}.mdx` suffix
   - Strips suffix from final slug
   - Falls back to EN if suffix not in `SUPPORTED_LOCALES`
   - ✓ COMPLETE

3. **Locale-Aware Data Layer** (`lib/docs.ts`)
   - `getDocBySlug(slug, locale?)` → `{ doc, isFallback } | null`
   - `getAllDocs(locale?)` → `Doc[]` (published only)
   - `getDocsByDirectory(dir, locale?)` → `Doc[]` (sorted)
   - `isDocTranslated(slug, locale)` → `boolean`
   - Fallback: requested locale → EN → null
   - Callers can check `isFallback` to show banner
   - ✓ COMPLETE

4. **Type-Safe Implementation**
   - All locales validated at compile time
   - Return types signal fallback usage
   - TypeScript strict mode enforced
   - ✓ COMPLETE

**Acceptance Criteria:**
- ✓ `pnpm build` succeeds without errors
- ✓ `.velite` output includes `locale` field on all docs
- ✓ `getDocBySlug()` returns proper type: `{ doc, isFallback } | null`
- ✓ No breaking changes to existing routes
- ✓ No UI changes visible to users

**Status:** ✓ COMPLETE (2026-02-10)

---

### Phase 2: Routing (COMPLETE)

**Goal:** Add URL-based locale routing with middleware

**Features:**

1. **Locale Prefix Routing** ✓
   - URL pattern: `/docs/...` (EN, no prefix), `/vi/docs/...` (VI with prefix)
   - Installed next-intl 4.8.2 for routing infrastructure
   - Created middleware to parse locale from URL
   - Restructured app routes for `[locale]` segment

2. **Static Param Generation** ✓
   - Pre-generates all docs in all locales at build time
   - `generateStaticParams()` returns docs × locales static paths
   - Build time scales linearly with: docs × locales
   - All pages pre-rendered as SSG (no server runtime)

3. **Route Validation** ✓
   - Middleware validates locale before route handler
   - Invalid locale redirects to default locale
   - Consistent locale handling across all routes

4. **next-intl Integration** ✓
   - `i18n/routing.ts` — Locale configuration (localePrefix: "as-needed")
   - `i18n/request.ts` — Loads messages for each locale
   - `i18n/navigation.ts` — Locale-aware Link, redirect, useRouter helpers
   - `middleware.ts` — Middleware validates and sets locale context

5. **Message Files** ✓
   - `messages/en.json` — English UI strings
   - `messages/vi.json` — Vietnamese UI strings

6. **App Route Restructuring** ✓
   - Old: `app/docs/[[...slug]]/page.tsx`
   - New: `app/[locale]/docs/[[...slug]]/page.tsx`
   - Old: `app/page.tsx`
   - New: `app/[locale]/page.tsx`
   - Root layout: `app/layout.tsx` sets `<html lang={locale}>`
   - Locale layout: `app/[locale]/layout.tsx` validates locale

**Acceptance Criteria:**
- ✓ `/docs/guides/routing` serves EN doc (no prefix)
- ✓ `/vi/docs/guides/routing` serves VI doc (with /vi/ prefix)
- ✓ `/unknown/docs/guides/routing` redirects to `/docs/...`
- ✓ Middleware validates locale before route handler
- ✓ All static paths pre-generated at build time
- ✓ `pnpm build` succeeds (build time ~N × M seconds for N docs, M locales)
- ✓ No breaking changes to public API

**Status:** ✓ COMPLETE (2026-02-10)

---

### Phase 3: UI & UX (COMPLETE)

**Goal:** Add locale picker, search localization, and locale-aware navigation

**Features:**

1. **Locale Picker** ✓
   - LanguageSwitcher component with Globe icon dropdown
   - Shows current locale with LOCALE_LABELS
   - Uses `router.replace(pathname, { locale })` to switch
   - Client component using `@/i18n/navigation`

2. **Navigation Sync** ✓
   - `buildNavTree(locale)` filters by locale + merges EN fallbacks
   - FallbackBanner shown when `isFallback === true`
   - All client components use Link/usePathname/useRouter from `@/i18n/navigation`
   - Sidebar hrefs WITHOUT locale prefix (next-intl Link auto-adds)

3. **Search Localization** ✓
   - `getSearchIndex(locale)` filters docs by current locale
   - Search results match current language only
   - Uses `@/i18n/navigation` Link for results

4. **UI String Localization** ✓
   - All UI strings use `useTranslations()` hook
   - messages/en.json and messages/vi.json for translations
   - No hardcoded text in components

**Acceptance Criteria:**
- ✓ Locale picker visible and functional in header
- ✓ Switching locales updates URL and re-renders content
- ✓ Search index filtered by current locale
- ✓ Sidebar shows translated docs with EN fallback merge
- ✓ "Not translated" banner shown for fallback docs

**Status:** ✓ COMPLETE (2026-02-10)

---

### Phase 4: Polish & Sample Content (COMPLETE)

**Goal:** Complete multilingual setup with SEO, sample content, and deployment guide

**Features:**

1. **Sample Content** ✓
   - Vietnamese translations of core docs created
   - Demonstrates fallback behavior with FallbackBanner
   - Shows locale-aware navigation in action

2. **SEO Optimization** ✓
   - `generateMetadata()` includes `alternates.languages`
   - hreflang tags for alternate language versions
   - `getAvailableLocales(slug)` helper to find translated versions
   - x-default points to EN canonical version

3. **Locale-Aware Edit Links** ✓
   - Edit links append `.{locale}.mdx` suffix (e.g., `.vi.mdx`)
   - Falls back to `.mdx` if locale=en
   - Points to correct file in GitHub repo

4. **Documentation Updates** ✓
   - Internal docs updated to reflect Phase 3-4 completion
   - system-architecture.md, codebase-summary.md, code-standards.md updated
   - Known limitations resolved

**Acceptance Criteria:**
- ✓ Vietnamese docs visible at `/vi/docs/*`
- ✓ Translated docs show VI content
- ✓ Untranslated docs show EN fallback with banner
- ✓ hreflang tags valid in all pages via generateMetadata
- ✓ Edit links work for both EN and localized docs
- ✓ Documentation complete

**Status:** ✓ COMPLETE (2026-02-10)

---

## Functional Requirements

### Content Management

1. **MDX Authoring**
   - Write documentation in MDX format
   - Full React component support
   - Frontmatter: title, description, order, published

2. **Locale Management**
   - Filename convention: `page.mdx` (EN), `page.vi.mdx` (VI)
   - Automatic locale detection at build time
   - Fallback to EN for untranslated pages

3. **Search**
   - Full-text search via cmdk command palette
   - Cmd+K / Ctrl+K keyboard shortcut
   - Search filters by current locale via getSearchIndex(locale)

4. **Navigation**
   - Sidebar tree from `_meta.json` config
   - Breadcrumb trails
   - Previous/next doc links
   - Mobile hamburger menu

### Display & Styling

1. **Components**
   - Callout boxes (info, warning, error)
   - Tabs for content alternatives
   - Steps for tutorials
   - Cards for flexible layouts
   - Code blocks with copy button
   - File tree visualization

2. **Typography**
   - Automatic heading ID generation
   - Table of contents sidebar
   - Syntax highlighting (Shiki)
   - Dark/light mode toggle

3. **Responsiveness**
   - Mobile-first design
   - Sidebar collapse on mobile
   - TOC overlay on mobile
   - Touch-friendly navigation

### Developer Experience

1. **Type Safety**
   - Full TypeScript strict mode
   - Type-safe locale handling
   - Branded component types

2. **Hot Reload**
   - Instant content updates in dev
   - No page refresh needed
   - Preserves browser state

3. **Build Optimization**
   - Static site generation (SSG)
   - No server runtime needed for docs
   - Minimal bundle size
   - CSS purging via Tailwind v4

## Non-Functional Requirements

### Performance

- **Build time:** < 1 minute for 100 docs
- **Page load:** < 2 seconds (static HTML + JS)
- **Search latency:** < 100ms query time
- **Bundle size:** < 500KB JavaScript per page

### Reliability

- **Build stability:** 100% (deterministic output)
- **Type safety:** Compile-time checks only
- **Content validation:** Schema validation via Velite
- **Error handling:** Graceful 404 for missing docs

### Scalability

- **Docs:** Support 1000+ pages without degradation
- **Locales:** Efficient for 2-10 languages
- **Search index:** < 5MB for typical site

### Accessibility

- **WCAG 2.1 AA:** All pages meet accessibility standard
- **Keyboard navigation:** Full support
- **Screen readers:** Semantic HTML throughout
- **Dark mode:** Properly contrasted colors

### Security

- **Content source:** Repository only (no uploads)
- **Code execution:** MDX components whitelisted
- **Dependencies:** Minimal, security-focused
- **Hosting:** Compatible with static hosting only

### Maintainability

- **Code quality:** ESLint + TypeScript validation
- **Test coverage:** 70%+ for components
- **Documentation:** Comprehensive dev guide
- **Update path:** Semantic versioning

## Technical Constraints

### Architecture

- Must be static-site generated (no server)
- MDX-based content only (no database)
- TypeScript for all source code
- Tailwind CSS for styling

### Dependencies

- **Framework:** Next.js 16 (App Router only)
- **Content:** Velite 0.3.1+
- **UI:** shadcn/ui components
- **Styling:** Tailwind CSS v4
- **Highlight:** Shiki (no Prism)

### Compatibility

- **Node.js:** 18.17+
- **Browsers:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Package manager:** pnpm (or npm/yarn with lockfile)

## Success Metrics

### Adoption

- GitHub stars: Track community interest
- NPM downloads: Measure template usage
- Issues/PRs: Monitor active development

### Quality

- Build success rate: 100%
- Type check pass rate: 100%
- Test coverage: 70%+
- Performance Lighthouse: 90+

### Documentation

- Setup time for new projects: < 15 minutes
- Time to add new doc: < 5 minutes
- Time to add locale: < 10 minutes
- Help requests: < 2 per month

## Roadmap

### Current Phase

**All Phases Complete** (v1.0)
- Phase 1: Velite locale extraction + data layer
- Phase 2: next-intl routing with [locale] tree
- Phase 3: UI components (LanguageSwitcher, FallbackBanner, locale-filtered search)
- Phase 4: SEO (hreflang alternates, locale-aware edit links, sample content)

### Next Steps

1. **v1.0 Release** → Documentation review and final polish
2. **Post-MVP** → Additional features (see below)

### Post-MVP Ideas

- Sidebar variant: collapsible, floating, overlay
- Search: Algolia integration, offline support
- Analytics: Page views, search usage by locale
- Customization: Theme builder, component gallery
- Deployment: One-click deploy templates

## Risks & Mitigation

| Risk | Impact | Probability | Resolution |
|------|--------|-------------|-----------|
| Velite schema changes break types | High | Low | Pin Velite version, test on upgrade |
| Build time scales badly with locales | Medium | Medium | Pre-generate paths efficiently, monitor with 10+ docs |
| Search index grows too large | Medium | Medium | ✓ RESOLVED - getSearchIndex(locale) filters by locale |
| Mobile UX suffers on tablet | Low | Medium | Test on iPad, adjust sidebar breakpoint |
| Content merge conflicts in git | Low | Medium | Document collaboration workflow |
| Locale selector hard to discover | Low | Medium | ✓ RESOLVED - LanguageSwitcher in header with Globe icon |
| next-intl version incompatibility | Medium | Low | Pin next-intl version, test on minor upgrades |

## Success Definition

**Phase 1 Success:**
- ✓ Type-safe locale system in place
- ✓ Velite transforms locales correctly
- ✓ Data layer handles fallbacks
- ✓ Existing routes unaffected
- ✓ All tests passing
- ✓ Zero regressions reported

**Phase 2 Success:**
- ✓ Locale-aware routing via middleware
- ✓ `[locale]` route tree structure
- ✓ Static param generation for all docs × locales
- ✓ Build completes without errors
- ✓ All routing paths resolve correctly
- ✓ Invalid locales redirect appropriately

**v1.0 Success:**
- ✓ Phases 3-4 complete
- ✓ Multilingual site fully functional
- ✓ Example VI translations included
- ✓ Comprehensive documentation
- [ ] 100+ GitHub stars (post-release goal)
- [ ] Zero open critical issues (post-release goal)

## Stakeholder Sign-Off

- **Product Owner:** All phases complete, v1.0 ready
- **Tech Lead:** Full i18n architecture approved
- **QA:** All phases tested, features validated
- **Documentation:** All docs updated for Phase 3-4 completion

---

**Last Updated:** 2026-02-10
**Version:** 1.0-complete
**Status:** All i18n Phases Complete → v1.0 Ready
