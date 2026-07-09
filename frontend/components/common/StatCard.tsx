import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorVariant = "yellow" | "green" | "red" | "blue";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: ColorVariant;
  trend?: {
    value: string;
    positive?: boolean;
  };
}

const colors: Record<ColorVariant, string> = {
  yellow: "bg-yellow-400/15 text-yellow-600",
  green: "bg-emerald-500/15 text-emerald-600",
  red: "bg-red-500/15 text-red-600",
  blue: "bg-sky-500/15 text-sky-600",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "yellow",
  trend,
}: StatCardProps) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-xs text-slate-400">
              {subtitle}
            </p>
          )}

          {trend && (
            <div
              className={cn(
                "mt-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold",
                trend.positive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {trend.positive ? "▲" : "▼"} {trend.value}
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110",
            colors[color]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}