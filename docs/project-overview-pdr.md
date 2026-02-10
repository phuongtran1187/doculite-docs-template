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

### Phase 3: UI & UX (Planned)

**Goal:** Add locale picker, search localization, and locale-aware navigation

**Features:**

1. **Locale Picker**
   - Dropdown/selector in header showing current locale
   - Switch between available locales via `i18n/navigation.useRouter()`
   - Update URL to new locale
   - Persist selection in localStorage (optional)

2. **Navigation Sync**
   - Sidebar filtered to show only docs in current locale
   - Fallback docs marked with "Not translated" banner
   - Breadcrumbs and pagination locale-aware

3. **Search Localization**
   - Filter search index by current locale
   - Show search results in current language only
   - Fallback to EN results if locale has no matches

4. **Accessibility & SEO**
   - Add hreflang tags for locale alternates (Phase 4)
   - Verify `lang` attribute set correctly per page (done in Phase 2)
   - Screen reader support for locale switcher

**Acceptance Criteria:**
- [ ] Locale picker visible and functional in header
- [ ] Switching locales updates URL and re-renders content
- [ ] Search index filtered by current locale
- [ ] Sidebar shows only translated docs
- [ ] "Not translated" banner shown for fallback docs

**Estimated Effort:** 6-8 hours

---

### Phase 4: Polish & Sample Content (Planned)

**Goal:** Complete multilingual setup with SEO, sample content, and deployment guide

**Features:**

1. **Sample Content**
   - Create Vietnamese translations of 3-5 core docs
   - Demonstrate locale-specific customizations
   - Show fallback behavior in action

2. **SEO Optimization**
   - Per-locale sitemap.xml
   - hreflang tags for alternate language versions
   - Canonical URLs with locale awareness
   - JSON-LD structured data with language tags

3. **Deployment & Performance**
   - Document deployment process (Vercel, Netlify, etc.)
   - Build time optimization for multiple locales
   - Analytics tracking by locale

4. **Documentation Updates**
   - How to add new locale
   - How to manage translations
   - Troubleshooting guide
   - SEO best practices

**Acceptance Criteria:**
- [ ] Vietnamese docs visible at `/vi/docs/guides/*`
- [ ] `/vi/docs/getting-started/installation` shows VI translation
- [ ] `/vi/docs/api/overview` shows EN fallback with banner
- [ ] sitemap.xml includes all locale variants
- [ ] hreflang tags valid in all pages
- [ ] Deployment guide complete for major platforms

**Estimated Effort:** 4-6 hours

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
   - Search filters by current locale (Phase 3)

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

**Phase 2: Routing** (COMPLETE)
- Locale-aware routing via next-intl middleware
- `[locale]` route tree structure
- Static param generation for all docs × locales
- All routes locale-aware (docs, home, etc.)

### Next Steps

1. **Phase 3** → UI locale picker + search (3-4 days)
2. **Phase 4** → Polish + sample content + SEO (2-3 days)
3. **v1.0 Release** → Full multilingual support

### Post-MVP Ideas

- Sidebar variant: collapsible, floating, overlay
- Search: Algolia integration, offline support
- Analytics: Page views, search usage by locale
- Customization: Theme builder, component gallery
- Deployment: One-click deploy templates

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Velite schema changes break types | High | Low | Pin Velite version, test on upgrade |
| Build time scales badly with locales | Medium | Medium | Pre-generate paths efficiently, monitor with 10+ docs |
| Search index grows too large | Medium | Medium | Lazy-load per-locale index (Phase 3) |
| Mobile UX suffers on tablet | Low | Medium | Test on iPad, adjust sidebar breakpoint |
| Content merge conflicts in git | Low | Medium | Document collaboration workflow |
| Locale selector hard to discover | Low | Medium | Prominent header placement, keyboard shortcut (Phase 3) |
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
- [ ] Phases 3-4 complete
- [ ] Multilingual site fully functional
- [ ] Example VI translations included
- [ ] Comprehensive documentation
- [ ] 100+ GitHub stars
- [ ] Zero open critical issues

## Stakeholder Sign-Off

- **Product Owner:** Phase 2 complete, ready for Phase 3
- **Tech Lead:** Routing architecture approved
- **QA:** Phase 2 testing complete, all routes validated
- **Documentation:** Phase 2 docs updated

---

**Last Updated:** 2026-02-10
**Version:** 1.0-phase2
**Status:** Phase 2 Complete → Phase 3 Ready
