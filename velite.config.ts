import { defineConfig, defineCollection, s } from "velite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./lib/i18n-config";

const docs = defineCollection({
  name: "Doc",
  pattern: "docs/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(300).optional(),
      order: s.number().optional().default(999),
      published: s.boolean().optional().default(true),
      slug: s.path(),
      body: s.mdx(),
      toc: s.toc(),
    })
    .transform((data) => {
      // Strip leading "docs/" prefix
      const rawSlug = data.slug.split("/").slice(1).join("/");
      const segments = rawSlug.split("/");
      const lastSegment = segments[segments.length - 1] || "";
      const dotIndex = lastSegment.lastIndexOf(".");
      let locale = DEFAULT_LOCALE;
      let cleanSlug = rawSlug;

      if (dotIndex > 0) {
        const suffix = lastSegment.slice(dotIndex + 1);
        if ((SUPPORTED_LOCALES as readonly string[]).includes(suffix)) {
          locale = suffix as (typeof SUPPORTED_LOCALES)[number];
          segments[segments.length - 1] = lastSegment.slice(0, dotIndex);
          cleanSlug = segments.join("/");
        }
      }

      return { ...data, locale, slugAsParams: cleanSlug };
    }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { docs },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark", light: "github-light" },
          defaultLang: "plaintext",
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
