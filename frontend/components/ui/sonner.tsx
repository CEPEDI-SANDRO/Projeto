"use client";

import {
  Toaster as SonnerToaster,
  type ToasterProps,
} from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-xl",
          title: "font-semibold text-slate-950",
          description: "text-slate-500",
          success: "border-emerald-200",
          error: "border-red-200",
          warning: "border-amber-200",
          info: "border-sky-200",
          closeButton:
            "border-slate-200 bg-white text-slate-500 hover:bg-slate-100",
        },
      }}
      {...props}
    />
  );
}