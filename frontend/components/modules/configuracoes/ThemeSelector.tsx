"use client";

import {
  Check,
  Laptop,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

const themeOptions = [
  {
    value: "light" as const,
    label: "Claro",
    description: "Interface clara para ambientes iluminados.",
    icon: Sun,
  },
  {
    value: "dark" as const,
    label: "Escuro",
    description: "Reduz o brilho em ambientes com pouca luz.",
    icon: Moon,
  },
  {
    value: "system" as const,
    label: "Sistema",
    description: "Segue automaticamente o tema do dispositivo.",
    icon: Laptop,
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setTheme(option.value);

              toast.success(
                `Tema ${option.label.toLowerCase()} selecionado`,
              );
            }}
            className={cn(
              "relative flex min-h-36 flex-col items-start rounded-2xl border p-5 text-left transition",
              active
                ? "border-primary bg-primary/10 ring-2 ring-primary/15"
                : "border-border bg-card hover:bg-accent",
            )}
          >
            {active && (
              <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-black">
                <Check className="h-4 w-4" />
              </span>
            )}

            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl",
                active
                  ? "bg-primary text-black"
                  : "bg-accent text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-foreground">
              {option.label}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}