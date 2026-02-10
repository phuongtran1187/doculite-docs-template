import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Doculite
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        A lightweight documentation template built with Next.js, shadcn/ui, and
        MDX.
      </p>
      <Button asChild size="lg">
        <Link href="/docs">Get Started</Link>
      </Button>
    </div>
  );
}
