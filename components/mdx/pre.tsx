"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pre({
  children,
  className,
  ...props
}: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = ref.current?.querySelector("code");
    const text = code?.textContent || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative mb-4 mt-6">
      <pre
        ref={ref}
        className={cn("overflow-x-auto rounded-lg border py-4", className)}
        {...props}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className={cn(
          "absolute right-2 top-2 rounded-md border bg-background/80 p-1.5 backdrop-blur transition-opacity",
          copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
