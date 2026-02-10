import { defineConfig, defineCollection, s } from "velite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

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
    .transform((data) => ({
      ...data,
      // Strip leading "docs/" prefix so slugAsParams matches route params
      slugAsParams: data.slug.split("/").slice(1).join("/"),
    })),
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
