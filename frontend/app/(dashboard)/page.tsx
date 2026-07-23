"use client";

import {
  AlertTriangle,
  Clock,
  Timer,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WeeklyHoursChart } from "@/components/modules/dashboard/WeeklyHoursChart";

import { useDashboard } from "@/hooks/useDashboard";
import { formatarMinutosParaHoras } from "@/lib/formatters";
import { DashboardMotion } from "@/components/modules/dashboard/DashboardMotion";

export default function DashboardPage() {
  const { dashboard } = useDashboard();

  return (
    <div className="space-y-6">
      <DashboardMotion>
        <PageHeader
          title="Dashboard"
          description="Visão geral do controle de ponto do Supermercado Sandro."
        />
      </DashboardMotion>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMotion delay={0.05}>
          <StatCard
            title="Funcionários"
            value={dashboard.resumo.totalFuncionarios}
            subtitle="Funcionários cadastrados"
            icon={Users}
            color="blue"
          />
        </DashboardMotion>

        <DashboardMotion delay={0.1}>
          <StatCard
            title="Presentes hoje"
            value={dashboard.resumo.presentesHoje}
            subtitle="Registros no dia"
            icon={UserCheck}
            color="green"
          />
        </DashboardMotion>

        <DashboardMotion delay={0.15}>
          <StatCard
            title="Ausentes hoje"
            value={dashboard.resumo.ausentesHoje}
            subtitle="Faltas registradas"
            icon={UserX}
            color="red"
          />
        </DashboardMotion>

        <DashboardMotion delay={0.2}>
          <StatCard
            title="Horas trabalhadas"
            value={formatarMinutosParaHoras(
              dashboard.resumo.horasTrabalhadasHojeMin,
            )}
            subtitle="Total computado hoje"
            icon={Clock}
            color="yellow"
          />
        </DashboardMotion>
      </div>

      <DashboardMotion delay={0.25}>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            title="Status de hoje"
            description="Situação dos funcionários no dia atual."
            action={
              <span className="rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-700">
                Hoje
              </span>
            }
          >
            <div className="space-y-3">
              {dashboard.statusHoje.slice(0, 5).map((item) => (
                <div
                  key={item.funcionario.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
                      {item.funcionario.nome
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((nome) => nome[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.funcionario.nome}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {item.funcionario.cargo}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={item.registro?.status ?? "sem_registro"}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Pendências recentes"
            description="Registros incompletos ou parciais."
            action={
              <button
                type="button"
                className="text-xs font-semibold text-yellow-700 transition hover:text-yellow-800"
              >
                Ver todas
              </button>
            }
          >
            <div className="space-y-3">
              {dashboard.pendenciasRecentes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center">
                  <Timer className="mb-2 h-8 w-8 text-slate-300" />

                  <p className="text-sm font-medium text-slate-600">
                    Nenhuma pendência encontrada
                  </p>
                </div>
              ) : (
                dashboard.pendenciasRecentes.slice(0, 4).map((ponto) => (
                  <div
                    key={ponto.id}
                    className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3"
                  >
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        Registro #{ponto.id}
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        {ponto.observacao ?? "Registro pendente de ajuste"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </DashboardMotion>

      <DashboardMotion delay={0.3}>
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <SectionCard
            title="Horas trabalhadas na semana"
            description="Total de horas computadas por dia."
          >
            <WeeklyHoursChart data={dashboard.graficoHoras} />
          </SectionCard>

          <SectionCard
            title="Resumo operacional"
            description="Indicadores complementares de hoje."
          >
            <div className="space-y-3">
              <ResumoItem
                label="Horas extras"
                value={formatarMinutosParaHoras(
                  dashboard.resumo.horasExtrasHojeMin,
                )}
                indicador="bg-emerald-500"
              />

              <ResumoItem
                label="Atrasos registrados"
                value={dashboard.resumo.atrasosHoje}
                indicador="bg-amber-500"
              />

              <ResumoItem
                label="Registros pendentes"
                value={dashboard.resumo.pendenciasHoje}
                indicador="bg-red-500"
              />
            </div>
          </SectionCard>
        </div>
      </DashboardMotion>
    </div>
  );
}

interface ResumoItemProps {
  label: string;
  value: string | number;
  indicador: string;
}

function ResumoItem({ label, value, indicador }: ResumoItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
      </div>

      <span className={`h-10 w-1 rounded-full ${indicador}`} />
    </div>
  );
}
