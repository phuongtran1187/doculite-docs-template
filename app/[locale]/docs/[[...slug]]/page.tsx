import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getDocBySlug, getAllDocs } from "@/lib/docs";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n-config";
import { MdxContent } from "@/components/docs/mdx-content";
import { Toc } from "@/components/docs/toc";
import { DocBreadcrumbs } from "@/components/docs/breadcrumbs";
import { DocPagination } from "@/components/docs/pagination";
import { FallbackBanner } from "@/components/docs/fallback-banner";
import { siteConfig } from "@/lib/site-config";

interface DocPageProps {
  params: Promise<{ locale: string; slug?: string[] }>;
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) => {
    const docs = getAllDocs(locale);
    return [
      { locale, slug: [] },
      ...docs
        .filter((doc) => doc.slugAsParams !== "")
        .map((doc) => ({ locale, slug: doc.slugAsParams.split("/") })),
    ];
  });
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const slugPath = slug?.join("/") || "";
  const result = getDocBySlug(slugPath, locale as Locale);
  if (!result) return {};
  return {
    title: result.doc.title,
    description: result.doc.description,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const slugPath = slug?.join("/") || "";
  const result = getDocBySlug(slugPath, locale as Locale);

  if (!result) notFound();

  const { doc, isFallback } = result;

  return (
    <>
      <div className="mx-auto w-full min-w-0">
        <DocBreadcrumbs slug={slugPath} />
        {isFallback && <FallbackBanner locale={locale as Locale} />}
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight md:text-4xl">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">{doc.description}</p>
          )}
        </div>
        <div className="mdx mt-8">
          <MdxContent code={doc.body} />
        </div>
        {siteConfig.github?.editUrl && (
          <div className="mt-8">
            <a
              href={`${siteConfig.github.editUrl}/docs/${slugPath || "index"}.mdx`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Edit this page on GitHub
            </a>
          </div>
        )}
        <DocPagination slug={slugPath} locale={locale} />
      </div>
      <div className="hidden text-sm xl:block">
        <Toc toc={doc.toc} />
      </div>
    </>
  );
}
