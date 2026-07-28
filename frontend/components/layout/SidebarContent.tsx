"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Clock,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { APP_NAME, ROTAS } from "@/lib/constants";
import { useConfiguracoesContext } from "@/components/providers/ConfiguracoesProvider";

interface SidebarContentProps {
  onNavigate?: () => void;
}

const navItems = [
  {
    href: ROTAS.dashboard,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: ROTAS.funcionarios,
    label: "Funcionários",
    icon: Users,
    children: [
      {
        href: "/funcionarios",
        label: "Lista de funcionários",
      },
      {
        href: "/funcionarios/novo",
        label: "Novo funcionário",
      },
    ],
  },
  {
    href: ROTAS.registros,
    label: "Registros",
    icon: Clock,
  },
  {
    href: ROTAS.relatorios,
    label: "Relatórios",
    icon: FileText,
    children: [
      {
        href: "/relatorios/geral",
        label: "Relatório geral",
      },
      {
        href: "/relatorios/individual",
        label: "Relatório individual",
      },
    ],
  },
  {
    href: ROTAS.exportar,
    label: "Exportar",
    icon: Download,
  },
];

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  const router = useRouter();

  const { configuracao } = useConfiguracoesContext();

const nomeEmpresa =
  configuracao?.nomeEmpresa ?? "Supermercado Sandro";

const nomeUsuario =
  configuracao?.nomeUsuario ?? "Administrador";

const iniciaisUsuario = nomeUsuario
  .split(" ")
  .filter(Boolean)
  .slice(0, 2)
  .map((parte) => parte[0])
  .join("")
  .toUpperCase();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5 pr-14">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm">
          <Image
            src="/logo.jpeg"
            alt="Logo Supermercado Sandro"
            width={44}
            height={44}
            className="h-full w-full rounded-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{APP_NAME}</p>

          <p className="truncate text-xs text-neutral-500">
  {nomeEmpresa}
</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Menu principal
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const hasChildren = Boolean(item.children?.length);

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-[#2A2508] text-[#F5D000]"
                      : "text-neutral-400 hover:bg-white/[0.05] hover:text-white",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#F5D000]" />
                  )}

                  <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />

                  <span className="flex-1 truncate">{item.label}</span>

                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        active && "rotate-180",
                      )}
                    />
                  )}
                </Link>

                {hasChildren && (
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      active
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-7 mt-1 space-y-1 border-l border-white/10 pl-3">
                        {item.children?.map((child) => {
                          const childActive = pathname === child.href;

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onNavigate}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                                childActive
                                  ? "bg-white/[0.06] text-white"
                                  : "text-neutral-500 hover:bg-white/[0.04] hover:text-neutral-200",
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5D000] text-sm font-bold text-black">
  {iniciaisUsuario}
</div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
  {nomeUsuario}
</p>

            <p className="truncate text-xs text-neutral-500">Administrador</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              router.push("/configuracoes");
              onNavigate?.();
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-xs text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <Settings className="h-4 w-4" />
            Config.
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-xs text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
