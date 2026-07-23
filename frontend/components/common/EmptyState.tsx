import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateVariant = "default" | "search" | "warning";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  variant?: EmptyStateVariant;
  className?: string;
}

const variants: Record<
  EmptyStateVariant,
  {
    container: string;
    iconContainer: string;
    icon: string;
  }
> = {
  default: {
    container: "border-slate-200 bg-slate-50/70",
    iconContainer: "bg-white ring-slate-200",
    icon: "text-slate-400",
  },

  search: {
    container: "border-sky-200 bg-sky-50/50",
    iconContainer: "bg-white ring-sky-200",
    icon: "text-sky-500",
  },

  warning: {
    container: "border-amber-200 bg-amber-50/60",
    iconContainer: "bg-white ring-amber-200",
    icon: "text-amber-500",
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  className,
}: EmptyStateProps) {
  const config = variants[variant];

  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center",
        config.container,
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ring-1",
          config.iconContainer,
        )}
      >
        <Icon className={cn("h-7 w-7", config.icon)} />
      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-950">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}