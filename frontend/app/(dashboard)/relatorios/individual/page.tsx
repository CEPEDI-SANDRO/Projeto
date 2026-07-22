"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  FileText,
  TriangleAlert,
  UserRoundSearch,
} from "lucide-react";

import { ActionButton } from "@/components/common/ActionButton";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardMotion } from "@/components/modules/dashboard/DashboardMotion";

import { useRelatorios } from "@/hooks/useRelatorios";
import { funcionariosMock } from "@/mocks/funcionarios.mock";
import { MESES } from "@/lib/constants";
import {
  formatarData,
  formatarHora,
  formatarMesAno,
  formatarMinutosParaHoras,
} from "@/lib/formatters";

import type { RegistroPonto } from "@/types/ponto";

const DATA_ATUAL = new Date();
const MES_ATUAL = DATA_ATUAL.getMonth() + 1;
const ANO_ATUAL = DATA_ATUAL.getFullYear();

export default function RelatorioIndividualPage() {
  const {
    relatorioIndividual,
    loading,
    buscarRelatorioIndividual,
  } = useRelatorios();

  const [funcionarioId, setFuncionarioId] = useState(0);
  const [mes, setMes] = useState(MES_ATUAL);
  const [ano, setAno] = useState(ANO_ATUAL);

  const columns = useMemo<DataTableColumn<RegistroPonto>[]>(
    () => [
      {
        header: "Data",
        render: (registro) => formatarData(registro.data),
      },
      {
        header: "Entrada 1",
        render: (registro) => formatarHora(registro.entrada1),
      },
      {
        header: "Saída 1",
        render: (registro) => formatarHora(registro.saida1),
      },
      {
        header: "Entrada 2",
        render: (registro) => formatarHora(registro.entrada2),
      },
      {
        header: "Saída 2",
        render: (registro) => formatarHora(registro.saida2),
      },
      {
        header: "Horas trabalhadas",
        render: (registro) =>
          formatarMinutosParaHoras(registro.horasTrabalhadasMin),
      },
      {
        header: "Horas extras",
        render: (registro) =>
          formatarMinutosParaHoras(registro.horasExtrasMin),
      },
      {
        header: "Status",
        render: (registro) => (
          <StatusBadge status={registro.status} />
        ),
      },
    ],
    [],
  );

  async function gerarRelatorio() {
    if (!funcionarioId) {
      return;
    }

    await buscarRelatorioIndividual(
      funcionarioId,
      mes,
      ano,
    );
  }

  return (
    <PageContainer>
      <DashboardMotion>
        <PageHeader
          title="Relatório individual"
          description="Consulte o histórico mensal de um funcionário."
        />
      </DashboardMotion>

      <DashboardMotion delay={0.05}>
        <SectionCard
          title="Filtros do relatório"
          description="Selecione o funcionário e o período desejado."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="block xl:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Funcionário
              </span>

              <select
                value={funcionarioId}
                onChange={(event) =>
                  setFuncionarioId(Number(event.target.value))
                }
                className={inputClass}
              >
                <option value={0}>
                  Selecione um funcionário
                </option>

                {funcionariosMock.map((funcionario) => (
                  <option
                    key={funcionario.id}
                    value={funcionario.id}
                  >
                    {funcionario.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Mês
              </span>

              <select
                value={mes}
                onChange={(event) =>
                  setMes(Number(event.target.value))
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

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Ano
              </span>

              <select
                value={ano}
                onChange={(event) =>
                  setAno(Number(event.target.value))
                }
                className={inputClass}
              >
                {Array.from({ length: 5 }, (_, index) => {
                  const valor = ANO_ATUAL - index;

                  return (
                    <option key={valor} value={valor}>
                      {valor}
                    </option>
                  );
                })}
              </select>
            </label>

            <div className="sm:col-span-2 xl:col-span-4">
              <ActionButton
                type="button"
                disabled={!funcionarioId || loading}
                onClick={() => {
                  void gerarRelatorio();
                }}
              >
                {loading
                  ? "Gerando..."
                  : "Gerar relatório individual"}
              </ActionButton>
            </div>
          </div>
        </SectionCard>
      </DashboardMotion>

      {!relatorioIndividual && !loading && (
        <DashboardMotion delay={0.1}>
          <SectionCard>
            <EmptyState
              icon={UserRoundSearch}
              title="Selecione um funcionário"
              description="Escolha um funcionário e o período para visualizar o relatório individual."
            />
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

      {relatorioIndividual && !loading && (
        <>
          <DashboardMotion delay={0.1}>
            <SectionCard
              title={relatorioIndividual.funcionario.nome}
              description={
                relatorioIndividual.funcionario.cargo
              }
              action={
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
                  <FileText className="h-4 w-4" />

                  {formatarMesAno(
                    relatorioIndividual.mes,
                    relatorioIndividual.ano,
                  )}
                </div>
              }
            >
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-black">
                  {relatorioIndividual.funcionario.nome
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((nome) => nome[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold text-slate-950">
                    Matrícula{" "}
                    {relatorioIndividual.funcionario.matricula}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Carga diária de{" "}
                    {
                      relatorioIndividual.funcionario
                        .cargaDiariaHoras
                    }
                    h
                  </p>
                </div>
              </div>
            </SectionCard>
          </DashboardMotion>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardMotion delay={0.15} className="h-full">
              <StatCard
                title="Horas trabalhadas"
                value={formatarMinutosParaHoras(
                  relatorioIndividual.totalHorasTrabalhadasMin,
                )}
                subtitle="Total no período"
                icon={Clock}
                color="green"
              />
            </DashboardMotion>

            <DashboardMotion delay={0.2} className="h-full">
              <StatCard
                title="Horas extras"
                value={formatarMinutosParaHoras(
                  relatorioIndividual.totalHorasExtrasMin,
                )}
                subtitle="Acumulado no período"
                icon={CalendarDays}
                color="yellow"
              />
            </DashboardMotion>

            <DashboardMotion delay={0.25} className="h-full">
              <StatCard
                title="Faltas"
                value={relatorioIndividual.totalFaltas}
                subtitle="Ausências registradas"
                icon={TriangleAlert}
                color="red"
              />
            </DashboardMotion>

            <DashboardMotion delay={0.3} className="h-full">
              <StatCard
                title="Pendências"
                value={relatorioIndividual.totalPendentes}
                subtitle="Registros incompletos"
                icon={FileText}
                color="blue"
              />
            </DashboardMotion>
          </div>

          <DashboardMotion delay={0.35}>
            <SectionCard
              title="Histórico de registros"
              description="Marcações do funcionário no período selecionado."
            >
              <DataTable
                data={relatorioIndividual.registros}
                columns={columns}
                emptyTitle="Nenhum registro encontrado"
                emptyDescription="Não existem marcações para o funcionário no período selecionado."
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