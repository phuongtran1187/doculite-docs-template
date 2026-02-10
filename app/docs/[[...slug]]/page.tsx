import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocBySlug, getAllDocs } from "@/lib/docs";
import { MdxContent } from "@/components/docs/mdx-content";
import { Toc } from "@/components/docs/toc";
import { DocBreadcrumbs } from "@/components/docs/breadcrumbs";
import { DocPagination } from "@/components/docs/pagination";
import { siteConfig } from "@/lib/site-config";

interface DocPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return [
    { slug: [] }, // /docs index
    ...docs
      .filter((doc) => doc.slugAsParams !== "")
      .map((doc) => ({ slug: doc.slugAsParams.split("/") })),
  ];
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug?.join("/") || "";
  const result = getDocBySlug(slugPath);
  if (!result) return {};
  return {
    title: result.doc.title,
    description: result.doc.description,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const slugPath = slug?.join("/") || "";
  const result = getDocBySlug(slugPath);

  if (!result) notFound();

  const { doc } = result;

  return (
    <>
      <div className="mx-auto w-full min-w-0">
        <DocBreadcrumbs slug={slugPath} />
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
        <DocPagination slug={slugPath} />
      </div>
      <div className="hidden text-sm xl:block">
        <Toc toc={doc.toc} />
      </div>
    </>
  );
}
