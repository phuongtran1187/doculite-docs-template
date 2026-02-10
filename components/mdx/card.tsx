import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardGroupProps {
  cols?: number;
  children: React.ReactNode;
}

export function CardGroup({ children, cols = 2 }: CardGroupProps) {
  return (
    <div className={cn("grid gap-4 my-6", cols === 2 && "sm:grid-cols-2", cols === 3 && "sm:grid-cols-3")}>
      {children}
    </div>
  );
}

interface CardProps {
  title: string;
  href?: string;
  children: React.ReactNode;
}

export function Card({ title, href, children }: CardProps) {
  const Comp = href ? Link : "div";
  return (
    <Comp href={href || "#"} className="group rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-1 text-sm text-muted-foreground">{children}</div>
    </Comp>
  );
}
