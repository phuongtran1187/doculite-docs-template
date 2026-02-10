import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/callout";
import { Tabs, Tab } from "@/components/mdx/tabs";
import { Steps } from "@/components/mdx/steps";
import { Card, CardGroup } from "@/components/mdx/card";
import { CodeBlock } from "@/components/mdx/code-block";
import { Pre } from "@/components/mdx/pre";
import { FileTree, Folder, File } from "@/components/mdx/file-tree";

// Map HTML elements to styled versions.
// Custom MDX components (Callout, Tabs, etc.) added in Phase 07.
export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1
      className="scroll-m-20 text-2xl font-bold tracking-tight md:text-4xl"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight mt-10 first:mt-0 md:text-3xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="scroll-m-20 text-lg font-semibold tracking-tight mt-8 md:text-2xl"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="scroll-m-20 text-base font-semibold tracking-tight mt-6 md:text-xl"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="leading-7 not-first:mt-6" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="font-medium underline underline-offset-4"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="my-6 ml-6 list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-6 ml-6 list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="mt-2" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-6 border-l-2 pl-6 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm in-[pre]:bg-transparent in-[pre]:p-0"
      {...props}
    >
      {children}
    </code>
  ),
  pre: Pre,
  table: ({ children, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  ),
  Callout,
  Tabs,
  Tab,
  Steps,
  Card,
  CardGroup,
  CodeBlock,
  FileTree,
  Folder,
  File,
};
