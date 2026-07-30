"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { ActionButton } from "@/components/common/ActionButton";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardMotion } from "@/components/modules/dashboard/DashboardMotion";

import { useFuncionarios } from "@/hooks/useFuncionarios";
import { exportarRelatorioExcel } from "@/services/exportar.service";
import { MESES } from "@/lib/constants";

type TipoRelatorio = "geral" | "individual";

const DATA_ATUAL = new Date();
const MES_ATUAL = DATA_ATUAL.getMonth() + 1;
const ANO_ATUAL = DATA_ATUAL.getFullYear();

export default function ExportarPage() {
  const {
    funcionarios,
    carregarFuncionarios,
    loading: carregandoFuncionarios,
  } = useFuncionarios();

  const [tipoRelatorio, setTipoRelatorio] =
    useState<TipoRelatorio>("geral");

  const [funcionarioId, setFuncionarioId] = useState(0);
  const [mes, setMes] = useState(MES_ATUAL);
  const [ano, setAno] = useState(ANO_ATUAL);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    void carregarFuncionarios();
  }, [carregarFuncionarios]);

  const funcionarioSelecionado = useMemo(
    () =>
      funcionarios.find(
        (funcionario) => funcionario.id === funcionarioId,
      ),
    [funcionarios, funcionarioId],
  );

  const podeExportar =
    tipoRelatorio === "geral" || Boolean(funcionarioId);

  async function exportarRelatorio() {
    if (!podeExportar) {
      toast.warning("Selecione um funcionário", {
        description:
          "Escolha o funcionário para gerar o relatório individual.",
      });

      return;
    }

    try {
      setExportando(true);

      await exportarRelatorioExcel({
        tipo: tipoRelatorio,
        funcionarioId: funcionarioId || undefined,
        mes,
        ano,
      });

      const nomeArquivo =
        tipoRelatorio === "geral"
          ? `relatorio-geral-${ano}-${String(mes).padStart(
              2,
              "0",
            )}.xlsx`
          : `relatorio-${funcionarioSelecionado?.nome
              ?.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]/g, "-")
              .replace(/-+/g, "-")}-${ano}-${String(
              mes,
            ).padStart(2, "0")}.xlsx`;

      toast.success("Exportação concluída", {
        description: `${nomeArquivo} foi gerado com sucesso.`,
      });
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Tente novamente em alguns instantes.";

      toast.error("Não foi possível exportar", {
        description: mensagem,
      });
    } finally {
      setExportando(false);
    }
  }

  return (
    <PageContainer>
      <DashboardMotion>
        <PageHeader
          title="Exportar relatórios"
          description="Gere arquivos com os registros e indicadores de ponto."
        />
      </DashboardMotion>

      <DashboardMotion delay={0.05}>
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard
            title="Configurações da exportação"
            description="Escolha o relatório e o período desejado."
          >
            <div className="space-y-6">
              <section>
                <p className="text-sm font-medium text-slate-700">
                  Tipo de relatório
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTipoRelatorio("geral");
                      setFuncionarioId(0);
                    }}
                    className={cardOptionClass(
                      tipoRelatorio === "geral",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-yellow-700">
                      <Users className="h-5 w-5" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        Relatório geral
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Consolidação de todos os funcionários.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTipoRelatorio("individual")
                    }
                    className={cardOptionClass(
                      tipoRelatorio === "individual",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        Relatório individual
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Histórico detalhado de um funcionário.
                      </p>
                    </div>
                  </button>
                </div>
              </section>

              {tipoRelatorio === "individual" && (
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Funcionário
                  </span>

                  <select
                    value={funcionarioId}
                    onChange={(event) =>
                      setFuncionarioId(
                        Number(event.target.value),
                      )
                    }
                    className={inputClass}
                    disabled={carregandoFuncionarios}
                  >
                    <option value={0}>
                      {carregandoFuncionarios
                        ? "Carregando funcionários..."
                        : "Selecione um funcionário"}
                    </option>

                    {funcionarios.map((funcionario) => (
                      <option
                        key={funcionario.id}
                        value={funcionario.id}
                      >
                        {funcionario.nome}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
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
                    {Array.from(
                      { length: 5 },
                      (_, index) => {
                        const valor = ANO_ATUAL - index;

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
              </div>

              <section>
                <p className="text-sm font-medium text-slate-700">
                  Formato do arquivo
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-1">
                  <button
                    type="button"
                    className={cardOptionClass(true)}
                  >
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600" />

                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        Excel (XLSX)
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Arquivo no formato XLSX.
                      </p>
                    </div>
                  </button>
                </div>
              </section>

              <div className="border-t border-slate-200 pt-5">
                <ActionButton
                  type="button"
                  onClick={() => {
                    void exportarRelatorio();
                  }}
                  disabled={!podeExportar || exportando}
                  className="w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />

                  {exportando
                    ? "Exportando..."
                    : "Exportar relatório"}
                </ActionButton>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Resumo da exportação"
            description="Confira os dados antes de gerar o arquivo."
          >
            <div className="space-y-4">
              <ResumoExportacao
                label="Tipo"
                value={
                  tipoRelatorio === "geral"
                    ? "Relatório geral"
                    : "Relatório individual"
                }
              />

              <ResumoExportacao
                label="Funcionário"
                value={
                  tipoRelatorio === "geral"
                    ? "Todos os funcionários"
                    : funcionarioSelecionado?.nome ??
                      "Não selecionado"
                }
              />

              <ResumoExportacao
                label="Período"
                value={`${
                  MESES.find((item) => item.value === mes)
                    ?.label
                } de ${ano}`}
              />

              <ResumoExportacao
                label="Formato"
                value="XLSX"
              />

              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-yellow-700">
                    <Download className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Conteúdo do arquivo
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      O arquivo incluirá as datas, marcações de
                      entrada e saída, horas trabalhadas, horas
                      extras e status de presença.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </DashboardMotion>
    </PageContainer>
  );
}

interface ResumoExportacaoProps {
  label: string;
  value: string;
}

function ResumoExportacao({
  label,
  value,
}: ResumoExportacaoProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
      <span className="text-sm font-medium text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

function cardOptionClass(active: boolean) {
  return [
    "flex min-h-24 items-start gap-3 rounded-2xl border p-4 transition",
    active
      ? "border-yellow-400 bg-yellow-50/60 ring-2 ring-yellow-400/15"
      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
  ].join(" ");
}

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20";