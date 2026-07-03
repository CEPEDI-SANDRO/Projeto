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
import { KpiCard } from "@/components/modules/dashboard/KpiCard";
import { useDashboard } from "@/hooks/useDashboard";
import { formatarMinutosParaHoras } from "@/lib/formatters";

export default function DashboardPage() {
  const { dashboard } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do controle de ponto do Supermercado Sandro."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Funcionários"
          value={dashboard.resumo.totalFuncionarios}
          description="Funcionários cadastrados"
          icon={Users}
        />

        <KpiCard
          title="Presentes hoje"
          value={dashboard.resumo.presentesHoje}
          description="Registros completos ou parciais"
          icon={UserCheck}
        />

        <KpiCard
          title="Ausentes hoje"
          value={dashboard.resumo.ausentesHoje}
          description="Faltas registradas"
          icon={UserX}
        />

        <KpiCard
          title="Horas trabalhadas"
          value={formatarMinutosParaHoras(
            dashboard.resumo.horasTrabalhadasHojeMin
          )}
          description="Total computado no dia"
          icon={Clock}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Status de hoje
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Situação dos funcionários no dia atual.
              </p>
            </div>

            <div className="rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-700">
              Hoje
            </div>
          </div>

          <div className="space-y-3">
            {dashboard.statusHoje.slice(0, 5).map((item) => (
              <div
                key={item.funcionario.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.funcionario.nome}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.funcionario.cargo}
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {item.registro?.status ?? "sem registro"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-950">
              Pendências recentes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Registros incompletos ou parciais.
            </p>
          </div>

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
                  className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3"
                >
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Registro #{ponto.id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {ponto.observacao ?? "Registro pendente de ajuste"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}