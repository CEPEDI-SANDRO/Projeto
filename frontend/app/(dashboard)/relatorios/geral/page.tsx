"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  CalendarDays,
  Clock,
  FileBarChart2,
  FileText,
  TriangleAlert,
  Users,
} from "lucide-react";

import { ActionButton } from "@/components/common/ActionButton";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/DataTable";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardMotion } from "@/components/modules/dashboard/DashboardMotion";
import { HorasPorFuncionarioChart } from "@/components/modules/relatorios/HorasPorFuncionarioChart";
import { StatusPieChart } from "@/components/modules/relatorios/StatusPieChart";

import { useRelatorios } from "@/hooks/useRelatorios";

import { MESES } from "@/lib/constants";
import {
  formatarMesAno,
  formatarMinutosParaHoras,
} from "@/lib/formatters";

import type { ResumoFuncionarioGeral } from "@/types/relatorio";

const DATA_ATUAL = new Date();
const MES_ATUAL = DATA_ATUAL.getMonth() + 1;
const ANO_ATUAL = DATA_ATUAL.getFullYear();

export default function RelatorioGeralPage() {
  const {
    relatorioGeral,
    loading,
    error,
    buscarRelatorioGeral,
  } = useRelatorios();

  const [mes, setMes] = useState(MES_ATUAL);
  const [ano, setAno] = useState(ANO_ATUAL);

  const totaisStatus = useMemo(() => {
    if (!relatorioGeral) {
      return {
        completos: 0,
        parciais: 0,
        faltas: 0,
        pendentes: 0,
      };
    }

    const parciais =
      relatorioGeral.resumos.reduce(
        (total, resumo) =>
          total + resumo.totalParciais,
        0,
      );

    const pendentes =
      relatorioGeral.resumos.reduce(
        (total, resumo) =>
          total + resumo.totalPendentes,
        0,
      );

    const faltas =
      relatorioGeral.resumos.reduce(
        (total, resumo) =>
          total + resumo.totalFaltas,
        0,
      );

    const completos =
      relatorioGeral.resumos.filter(
        (resumo) =>
          resumo.totalFaltas === 0 &&
          resumo.totalParciais === 0 &&
          resumo.totalPendentes === 0,
      ).length;

    return {
      completos,
      parciais,
      faltas,
      pendentes,
    };
  }, [relatorioGeral]);

  const columns =
    useMemo<
      DataTableColumn<ResumoFuncionarioGeral>[]
    >(
      () => [
        {
          header: "Funcionário",
          render: (resumo) => {
            const iniciais =
              resumo.funcionario.nome
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((nome) => nome[0])
                .join("")
                .toUpperCase();

            return (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-black shadow-sm ring-2 ring-white">
                  {iniciais}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {
                      resumo.funcionario
                        .nome
                    }
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {resumo.funcionario
                      .cargo ||
                      "Cargo não informado"}
                  </p>
                </div>
              </div>
            );
          },
        },
        {
          header: "Horas trabalhadas",
          render: (resumo) =>
            formatarMinutosParaHoras(
              resumo.totalHorasTrabalhadasMin,
            ),
        },
        {
          header: "Horas extras",
          render: (resumo) =>
            formatarMinutosParaHoras(
              resumo.totalHorasExtrasMin,
            ),
        },
        {
          header: "Faltas",
          accessor: "totalFaltas",
        },
        {
          header: "Parciais",
          accessor: "totalParciais",
        },
        {
          header: "Pendentes",
          accessor: "totalPendentes",
        },
      ],
      [],
    );

  async function gerarRelatorio() {
    try {
      await buscarRelatorioGeral(
        mes,
        ano,
      );
    } catch {
      // O hook já salva o erro.
    }
  }

  return (
    <PageContainer>
      <DashboardMotion>
        <PageHeader
          title="Relatório geral"
          description="Acompanhe os indicadores consolidados de todos os funcionários."
        />
      </DashboardMotion>

      <DashboardMotion delay={0.05}>
        <SectionCard
          title="Período de referência"
          description="Selecione o mês e o ano para gerar o relatório."
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="block w-full lg:max-w-xs">
              <span className="text-sm font-medium text-slate-700">
                Mês
              </span>

              <select
                value={mes}
                onChange={(event) =>
                  setMes(
                    Number(event.target.value),
                  )
                }
                className={inputClass}
              >
                {MESES.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block w-full lg:max-w-xs">
              <span className="text-sm font-medium text-slate-700">
                Ano
              </span>

              <select
                value={ano}
                onChange={(event) =>
                  setAno(
                    Number(event.target.value),
                  )
                }
                className={inputClass}
              >
                {Array.from(
                  { length: 5 },
                  (_, index) => {
                    const valor =
                      ANO_ATUAL - index;

                    return (
                      <option
                        key={valor}
                        value={valor}
                      >
                        {valor}
                      </option>
                    );
                  },
                )}
              </select>
            </label>

            <ActionButton
              type="button"
              onClick={() => {
                void gerarRelatorio();
              }}
              disabled={loading}
              className="w-full lg:w-auto"
            >
              <FileBarChart2 className="h-4 w-4" />

              {loading
                ? "Gerando..."
                : "Gerar relatório"}
            </ActionButton>
          </div>
        </SectionCard>
      </DashboardMotion>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">
            Não foi possível gerar o relatório
          </p>

          <p>{error}</p>
        </div>
      )}

      {!relatorioGeral &&
        !loading && (
          <DashboardMotion delay={0.1}>
            <SectionCard>
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-yellow-700">
                  <FileText className="h-6 w-6" />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-slate-900">
                  Gere um relatório
                </h2>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                  Escolha o período desejado
                  e clique em “Gerar
                  relatório” para visualizar
                  os indicadores.
                </p>
              </div>
            </SectionCard>
          </DashboardMotion>
        )}

      {loading && (
        <SectionCard>
          <div className="flex min-h-48 items-center justify-center">
            <p className="text-sm font-medium text-slate-500">
              Gerando relatório...
            </p>
          </div>
        </SectionCard>
      )}

      {relatorioGeral &&
        !loading && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardMotion
                delay={0.1}
                className="h-full"
              >
                <StatCard
                  title="Funcionários"
                  value={
                    relatorioGeral
                      .totalFuncionarios
                  }
                  subtitle="Incluídos no relatório"
                  icon={Users}
                  color="blue"
                />
              </DashboardMotion>

              <DashboardMotion
                delay={0.15}
                className="h-full"
              >
                <StatCard
                  title="Horas trabalhadas"
                  value={formatarMinutosParaHoras(
                    relatorioGeral
                      .totalHorasTrabalhadasMin,
                  )}
                  subtitle="Total no período"
                  icon={Clock}
                  color="green"
                />
              </DashboardMotion>

              <DashboardMotion
                delay={0.2}
                className="h-full"
              >
                <StatCard
                  title="Horas extras"
                  value={formatarMinutosParaHoras(
                    relatorioGeral
                      .totalHorasExtrasMin,
                  )}
                  subtitle="Acumulado no período"
                  icon={CalendarDays}
                  color="yellow"
                />
              </DashboardMotion>

              <DashboardMotion
                delay={0.25}
                className="h-full"
              >
                <StatCard
                  title="Faltas"
                  value={
                    relatorioGeral
                      .totalFaltas
                  }
                  subtitle="Ausências registradas"
                  icon={TriangleAlert}
                  color="red"
                />
              </DashboardMotion>
            </div>

            <DashboardMotion delay={0.28}>
              <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                <SectionCard
                  title="Horas por funcionário"
                  description="Comparação da carga horária acumulada no período."
                >
                  <HorasPorFuncionarioChart
                    data={
                      relatorioGeral.resumos
                    }
                  />
                </SectionCard>

                <SectionCard
                  title="Distribuição de ocorrências"
                  description="Resumo dos registros no período."
                >
                  <StatusPieChart
                    completos={
                      totaisStatus.completos
                    }
                    parciais={
                      totaisStatus.parciais
                    }
                    faltas={
                      totaisStatus.faltas
                    }
                    pendentes={
                      totaisStatus.pendentes
                    }
                  />
                </SectionCard>
              </div>
            </DashboardMotion>

            <DashboardMotion delay={0.32}>
              <SectionCard
                title="Resumo geral por funcionário"
                description="Consolidação de horas, faltas e pendências no período selecionado."
                action={
                  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
                    <FileText className="h-4 w-4" />

                    {formatarMesAno(
                      relatorioGeral.mes,
                      relatorioGeral.ano,
                    )}
                  </div>
                }
              >
                <DataTable
                  data={
                    relatorioGeral.resumos
                  }
                  columns={columns}
                  emptyIcon={
                    FileBarChart2
                  }
                  emptyTitle="Nenhum dado no período"
                  emptyDescription="Não foram encontrados registros para o mês e ano selecionados."
                  emptyVariant="warning"
                />
              </SectionCard>
            </DashboardMotion>
          </>
        )}
    </PageContainer>
  );
}

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20";