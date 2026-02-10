import { docs } from "#site/content";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n-config";

/**
 * Find doc by slug + locale. Falls back to EN if not found.
 * Returns { doc, isFallback } so callers can show "not translated" banner.
 */
export function getDocBySlug(slug: string, locale: Locale = DEFAULT_LOCALE) {
  const exact = docs.find(
    (doc) => doc.slugAsParams === slug && doc.locale === locale,
  );
  if (exact) return { doc: exact, isFallback: false };

  if (locale !== DEFAULT_LOCALE) {
    const fallback = docs.find(
      (doc) => doc.slugAsParams === slug && doc.locale === DEFAULT_LOCALE,
    );
    if (fallback) return { doc: fallback, isFallback: true };
  }

  return null;
}

export function getAllDocs(locale: Locale = DEFAULT_LOCALE) {
  return docs.filter((doc) => doc.published && doc.locale === locale);
}

export function getDocsByDirectory(dir: string, locale: Locale = DEFAULT_LOCALE) {
  return docs
    .filter(
      (doc) => doc.slugAsParams.startsWith(dir) && doc.locale === locale,
    )
    .sort((a, b) => a.order - b.order);
}

export function isDocTranslated(slug: string, locale: Locale): boolean {
  return docs.some(
    (doc) => doc.slugAsParams === slug && doc.locale === locale,
  );
}

/**
 * Get all locales that have actual translations for a given slug.
 * Always includes DEFAULT_LOCALE (EN is always available as fallback).
 * Used to build hreflang alternate links for SEO.
 */
export function getAvailableLocales(slug: string): Locale[] {
  const locales = new Set<Locale>();
  locales.add(DEFAULT_LOCALE);
  for (const doc of docs) {
    if (doc.slugAsParams === slug && doc.published) {
      locales.add(doc.locale as Locale);
    }
  }
  return Array.from(locales);
}
