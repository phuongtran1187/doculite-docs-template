import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, Lightbulb } from "lucide-react";

const variants = {
  info: { icon: Info, className: "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  warning: { icon: AlertTriangle, className: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
  danger: { icon: AlertCircle, className: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400" },
  tip: { icon: Lightbulb, className: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400" },
};

interface CalloutProps {
  type?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon: Icon, className } = variants[type];
  return (
    <div className={cn("my-6 flex gap-3 rounded-lg border p-4", className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-sm [&>p]:mt-0">{children}</div>
      </div>
    </div>
  );
}
