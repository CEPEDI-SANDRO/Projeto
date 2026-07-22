"use client";

import {
  Bell,
  CalendarDays,
  Menu,
  Search,
  UserRound,
} from "lucide-react";

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({
  onOpenMenu,
}: HeaderProps) {
  const dataAtual = new Intl.DateTimeFormat(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span className="capitalize">
            {dataAtual}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
        <div className="hidden h-10 w-[260px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 shadow-sm md:flex xl:w-[360px]">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />

          <input
            placeholder="Buscar funcionários e registros..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#F5D000] hover:text-slate-950"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#F5D000] hover:text-slate-950"
        >
          <UserRound className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}