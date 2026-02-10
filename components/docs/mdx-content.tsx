"use client";

import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "@/mdx-components";

// Velite compiles MDX to a code string at build time.
// We call the compiled function directly to get JSX output,
// avoiding dynamic component creation during render.
export function MdxContent({ code }: { code: string }) {
  const fn = new Function(code);
  const mdxModule = fn({ ...runtime });
  return mdxModule.default({ components: mdxComponents });
}
