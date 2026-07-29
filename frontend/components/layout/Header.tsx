"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthContext } from "@/components/providers/AuthProvider";
import { useNotificacoes } from "@/hooks/useNotificacoes";
import { GLOBAL_SEARCH_ITEMS } from "@/lib/globalSearch";

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  const router = useRouter();

  const { usuario, encerrarSessao } = useAuthContext();

  const {
    notificacoes,
    loading: loadingNotificacoes,
    error: errorNotificacoes,
    carregarNotificacoes,
  } = useNotificacoes();

  const nomeUsuario = usuario?.nome ?? "Administrador";

  const cargoUsuario = usuario?.cargo ?? "Administrador";

  const iniciaisUsuario = nomeUsuario
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  const searchRef = useRef<HTMLInputElement>(null);

  const [busca, setBusca] = useState("");

  const [buscaAberta, setBuscaAberta] = useState(false);

  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  const [perfilAberto, setPerfilAberto] = useState(false);

  useEffect(() => {
    void carregarNotificacoes();

    const intervalo = window.setInterval(() => {
      void carregarNotificacoes();
    }, 10000);

    return () => {
      window.clearInterval(intervalo);
    };
  }, [carregarNotificacoes]);

  const dataAtual = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const resultadosBusca = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return GLOBAL_SEARCH_ITEMS;
    }

    return GLOBAL_SEARCH_ITEMS.filter((item) =>
      [item.title, item.description, ...item.keywords]
        .join(" ")
        .toLowerCase()
        .includes(termo),
    );
  }, [busca]);

  function navegarParaResultado(href: string) {
    router.push(href);
    setBusca("");
    setBuscaAberta(false);
    setNotificacoesAbertas(false);
    setPerfilAberto(false);
  }

  function sair() {
    encerrarSessao();
    setPerfilAberto(false);

    toast.success("Sessão encerrada", {
      description: "Você saiu do Chronos Ponto.",
    });

    // Pequeno delay para garantir que o toast apareça antes da navegação
    setTimeout(() => {
      router.replace("/login");
    }, 100);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-border bg-accent px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
          <CalendarDays className="h-4 w-4" />

          <span className="capitalize">{dataAtual}</span>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <div className="flex h-10 w-[260px] items-center gap-2 rounded-full border border-border bg-card px-4 shadow-sm xl:w-[360px]">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

            <input
              ref={searchRef}
              value={busca}
              onFocus={() => {
                setBuscaAberta(true);
                setNotificacoesAbertas(false);
                setPerfilAberto(false);
              }}
              onChange={(event) => {
                setBusca(event.target.value);
                setBuscaAberta(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && resultadosBusca.length > 0) {
                  navegarParaResultado(resultadosBusca[0].href);
                }

                if (event.key === "Escape") {
                  setBuscaAberta(false);
                }
              }}
              placeholder="Buscar no sistema..."
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            {busca && (
              <button
                type="button"
                onClick={() => {
                  setBusca("");
                  searchRef.current?.focus();
                }}
                className="text-muted-foreground transition hover:text-foreground"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {buscaAberta && (
            <>
              <button
                type="button"
                aria-label="Fechar busca global"
                onClick={() => setBuscaAberta(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    Busca global
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Pesquise páginas e funcionalidades do sistema.
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {resultadosBusca.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Search className="mx-auto h-6 w-6 text-muted-foreground" />

                      <p className="mt-3 text-sm font-medium text-foreground">
                        Nenhum resultado encontrado
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Tente pesquisar por outro termo.
                      </p>
                    </div>
                  ) : (
                    resultadosBusca.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => navegarParaResultado(item.href)}
                          className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-accent"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-yellow-700 dark:text-yellow-400">
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {item.title}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {resultadosBusca.length > 0 && (
                  <div className="border-t border-border px-4 py-2.5">
                    <p className="text-[11px] text-muted-foreground">
                      Pressione Enter para abrir o primeiro resultado.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificacoesAbertas((estadoAtual) => {
                const vaiAbrir = !estadoAtual;

                if (vaiAbrir) {
                  void carregarNotificacoes();
                }

                return vaiAbrir;
              });

              setPerfilAberto(false);
              setBuscaAberta(false);
            }}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary hover:text-foreground"
            aria-label="Abrir notificações"
          >
            <Bell className="h-5 w-5" />

            {notificacoes.length > 0 && (
              <span className="absolute right-1 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-card">
                {notificacoes.length}
              </span>
            )}
          </button>

          {notificacoesAbertas && (
            <>
              <button
                type="button"
                aria-label="Fechar notificações"
                onClick={() => setNotificacoesAbertas(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Notificações
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {notificacoes.length === 1
                        ? "1 pendência"
                        : `${notificacoes.length} pendências`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNotificacoesAbertas(false)}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                    aria-label="Fechar notificações"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {loadingNotificacoes ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Carregando notificações...
                      </p>
                    </div>
                  ) : errorNotificacoes ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm font-medium text-red-600">
                        Não foi possível carregar
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          void carregarNotificacoes();
                        }}
                        className="mt-3 text-xs font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  ) : notificacoes.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="mx-auto h-6 w-6 text-muted-foreground" />

                      <p className="mt-3 text-sm font-medium text-foreground">
                        Nenhuma notificação
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Não existem pendências no momento.
                      </p>
                    </div>
                  ) : (
                    notificacoes.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navegarParaResultado(item.href)}
                        className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-accent"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={
                              item.tipo === "warning"
                                ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500"
                                : "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500"
                            }
                          />

                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {item.titulo}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {item.descricao}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="border-t border-border p-3">
                  <button
                    type="button"
                    onClick={() =>
                      navegarParaResultado("/registros?status=pendente")
                    }
                    className="w-full rounded-xl py-2 text-sm font-semibold text-yellow-700 transition hover:bg-primary/10 dark:text-yellow-400"
                  >
                    Ver todas
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setPerfilAberto((estadoAtual) => !estadoAtual);
              setNotificacoesAbertas(false);
              setBuscaAberta(false);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary hover:text-foreground"
            aria-label="Abrir menu do perfil"
          >
            <UserRound className="h-5 w-5" />
          </button>

          {perfilAberto && (
            <>
              <button
                type="button"
                aria-label="Fechar menu do perfil"
                onClick={() => setPerfilAberto(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <div className="border-b border-border px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">
                      {iniciaisUsuario || "A"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {nomeUsuario}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {cargoUsuario}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => navegarParaResultado("/configuracoes")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-accent"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Configurações
                  </button>

                  <button
                    type="button"
                    onClick={sair}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
