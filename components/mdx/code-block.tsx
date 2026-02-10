"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  filename?: string;
  children: React.ReactNode;
}

export function CodeBlock({ filename, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    const code = ref.current?.querySelector("code");
    if (code) {
      navigator.clipboard.writeText(code.textContent || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative my-4">
      {filename && (
        <div className="rounded-t-lg border border-b-0 bg-muted px-4 py-2 font-mono text-sm text-muted-foreground">
          {filename}
        </div>
      )}
      <div className="relative" ref={ref}>
        {children}
        <button
          onClick={copyToClipboard}
          className={cn(
            "absolute right-2 top-2 rounded-md border bg-background p-2 opacity-0 transition-opacity group-hover:opacity-100",
            copied && "opacity-100"
          )}
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
