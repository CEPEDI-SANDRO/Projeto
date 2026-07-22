"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  Laptop,
  Moon,
  Paintbrush,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { ActionButton } from "@/components/common/ActionButton";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardMotion } from "@/components/modules/dashboard/DashboardMotion";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

const themeOptions: {
  value: ThemeOption;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    value: "light",
    label: "Claro",
    description: "Interface clara para ambientes iluminados.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Reduz o brilho em ambientes com pouca luz.",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistema",
    description: "Segue automaticamente o tema do dispositivo.",
    icon: Laptop,
  },
];

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const temaAtual = theme ?? "system";

  const [nomeEmpresa, setNomeEmpresa] =
    useState("Supermercado Sandro");

  const [nomeUsuario, setNomeUsuario] =
    useState("Admin");


  function salvarConfiguracoes() {
    toast.success("Configurações salvas", {
      description:
        "As preferências visuais foram atualizadas.",
    });
  }

  return (
    <PageContainer>
      <DashboardMotion>
        <PageHeader
          title="Configurações"
          description="Personalize a empresa, o usuário e a aparência do sistema."
        />
      </DashboardMotion>

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
                  value={nomeEmpresa}
                  onChange={(event) =>
                    setNomeEmpresa(event.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field
                label="Nome do usuário"
                icon={UserRound}
              >
                <input
                  value={nomeUsuario}
                  onChange={(event) =>
                    setNomeUsuario(event.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <div className="flex justify-end border-t border-border pt-5">
                <ActionButton
                  type="button"
                  onClick={salvarConfiguracoes}
                >
                  <Settings className="h-4 w-4" />
                  Salvar configurações
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
                value="Supermercado Sandro"
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-yellow-700">
              <Paintbrush className="h-5 w-5" />
            </div>
          }
        >

            <div className="grid gap-4 md:grid-cols-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const active = temaAtual === option.value;

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
        </SectionCard>
      </DashboardMotion>
    </PageContainer>
  );
}

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

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

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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