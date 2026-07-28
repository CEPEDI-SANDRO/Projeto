"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Building2,
  Paintbrush,
  Settings,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { ActionButton } from "@/components/common/ActionButton";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardMotion } from "@/components/modules/dashboard/DashboardMotion";

import { useConfiguracoesContext } from "@/components/providers/ConfiguracoesProvider";

const ThemeSelector = dynamic(
  () =>
    import(
      "@/components/modules/configuracoes/ThemeSelector"
    ).then((module) => module.ThemeSelector),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="min-h-36 animate-pulse rounded-2xl border border-border bg-accent"
          />
        ))}
      </div>
    ),
  },
);

export default function ConfiguracoesPage() {
  const {
    configuracao,
    loading,
    salvando,
    error,
    salvarConfiguracoes: salvarConfiguracoesApi,
  } = useConfiguracoesContext();

  const [nomeEmpresaEditado, setNomeEmpresaEditado] =
    useState<string | null>(null);

  const [nomeUsuarioEditado, setNomeUsuarioEditado] =
    useState<string | null>(null);

  const nomeEmpresa =
    nomeEmpresaEditado ??
    configuracao?.nomeEmpresa ??
    "";

  const nomeUsuario =
    nomeUsuarioEditado ??
    configuracao?.nomeUsuario ??
    "";

  async function salvarConfiguracoes() {
    const empresa = nomeEmpresa.trim();
    const usuario = nomeUsuario.trim();

    if (!empresa || !usuario) {
      toast.error("Preencha os campos", {
        description:
          "Nome da empresa e nome do usuário são obrigatórios.",
      });

      return;
    }

    try {
      await salvarConfiguracoesApi({
        nomeEmpresa: empresa,
        nomeUsuario: usuario,
      });

      setNomeEmpresaEditado(null);
      setNomeUsuarioEditado(null);

      toast.success("Configurações salvas", {
        description:
          "As informações foram atualizadas com sucesso.",
      });
    } catch {
      toast.error("Não foi possível salvar", {
        description:
          "Verifique os dados e tente novamente.",
      });
    }
  }

  return (
    <PageContainer>
      <DashboardMotion>
        <PageHeader
          title="Configurações"
          description="Personalize a empresa, o usuário e a aparência do sistema."
        />
      </DashboardMotion>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <p className="font-semibold">
            Não foi possível carregar as configurações
          </p>

          <p>{error}</p>
        </div>
      )}

      <DashboardMotion delay={0.05}>
        <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
          <SectionCard
            title="Identificação"
            description="Informações exibidas na interface do sistema."
          >
            <div className="space-y-5">
              <Field
                label="Nome da empresa"
                icon={Building2}
              >
                <input
                  type="text"
                  value={nomeEmpresa}
                  onChange={(event) =>
                    setNomeEmpresaEditado(
                      event.target.value,
                    )
                  }
                  className={inputClass}
                  placeholder={
                    loading
                      ? "Carregando..."
                      : "Nome da empresa"
                  }
                  disabled={loading || salvando}
                />
              </Field>

              <Field
                label="Nome do usuário"
                icon={UserRound}
              >
                <input
                  type="text"
                  value={nomeUsuario}
                  onChange={(event) =>
                    setNomeUsuarioEditado(
                      event.target.value,
                    )
                  }
                  className={inputClass}
                  placeholder={
                    loading
                      ? "Carregando..."
                      : "Nome do usuário"
                  }
                  disabled={loading || salvando}
                />
              </Field>

              <div className="flex justify-end border-t border-border pt-5">
                <ActionButton
                  type="button"
                  onClick={() => {
                    void salvarConfiguracoes();
                  }}
                  disabled={
                    loading ||
                    salvando ||
                    !nomeEmpresa.trim() ||
                    !nomeUsuario.trim()
                  }
                >
                  <Settings className="h-4 w-4" />

                  {salvando
                    ? "Salvando..."
                    : "Salvar configurações"}
                </ActionButton>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Sobre o sistema"
            description="Informações da versão atual."
          >
            <div className="space-y-3">
              <InfoRow
                label="Sistema"
                value="Chronos Ponto"
              />

              <InfoRow
                label="Empresa"
                value={
                  nomeEmpresa ||
                  "Não informado"
                }
              />

              <InfoRow
                label="Usuário"
                value={
                  nomeUsuario ||
                  "Não informado"
                }
              />

              <InfoRow
                label="Versão"
                value="Frontend V1.0"
              />

              <InfoRow
                label="Tecnologias"
                value="Next.js, TypeScript e Tailwind"
              />
            </div>
          </SectionCard>
        </div>
      </DashboardMotion>

      <DashboardMotion delay={0.1}>
        <SectionCard
          title="Aparência"
          description="Escolha como o Chronos Ponto será exibido."
          action={
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-yellow-700 dark:text-yellow-400">
              <Paintbrush className="h-5 w-5" />
            </div>
          }
        >
          <ThemeSelector />
        </SectionCard>
      </DashboardMotion>
    </PageContainer>
  );
}

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

interface FieldProps {
  label: string;
  icon: typeof Building2;
  children: React.ReactNode;
}

function Field({
  label,
  icon: Icon,
  children,
}: FieldProps) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </span>

      {children}
    </label>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-accent px-4 py-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}