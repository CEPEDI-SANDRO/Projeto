"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  FilterX,
  Plus,
  SearchX,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { ActionButton } from "@/components/common/ActionButton";
import { ActionMenu } from "@/components/common/ActionMenu";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/DataTable";
import { Drawer } from "@/components/common/Drawer";
import { Modal } from "@/components/common/Modal";
import { PageContainer } from "@/components/common/PageContainer";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { RegistroDetalhes } from "@/components/modules/registro/RegistroDetalhes";
import { RegistroForm } from "@/components/modules/registro/RegistroForm";

import { useFuncionarios } from "@/hooks/useFuncionarios";
import { usePontos } from "@/hooks/usePontos";

import {
  formatarData,
  formatarHora,
  formatarMinutosParaHoras,
} from "@/lib/formatters";

import type {
  RegistroPonto,
  RegistroPontoFormData,
} from "@/types/ponto";

const selectClass =
  "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20";

export default function RegistrosPage() {
  const searchParams = useSearchParams();
  const statusUrl = searchParams.get("status");

  const {
    pontos,
    loading: loadingPontos,
    error: errorPontos,
    carregarPontos,
    adicionarPonto,
    editarPonto,
    excluirPonto,
  } = usePontos();

  const {
    funcionarios,
    carregarFuncionarios,
  } = useFuncionarios();

  const [search, setSearch] = useState("");
  const [filtroFuncionarioId, setFiltroFuncionarioId] = useState(0);
  const [filtroData, setFiltroData] = useState("");

  const [modalAberto, setModalAberto] =
    useState(false);

  const [
    registroSelecionado,
    setRegistroSelecionado,
  ] = useState<RegistroPonto | null>(null);

  const [
    registroEmEdicao,
    setRegistroEmEdicao,
  ] = useState<RegistroPonto | null>(null);

  const [
    registroParaExcluir,
    setRegistroParaExcluir,
  ] = useState<RegistroPonto | null>(null);

  const [excluindo, setExcluindo] =
    useState(false);

  useEffect(() => {
    void carregarPontos();
    void carregarFuncionarios();
  }, [carregarPontos, carregarFuncionarios]);

  const filtroPendenciasAtivo =
    statusUrl === "pendente";

  const filtrosAtivos =
    Boolean(filtroFuncionarioId) || Boolean(filtroData);

  function limparFiltros() {
    setFiltroFuncionarioId(0);
    setFiltroData("");
    setSearch("");
  }

  const registrosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();

    return pontos.filter((ponto) => {
      const funcionario = funcionarios.find(
        (item) =>
          item.id === ponto.funcionarioId,
      );

      const correspondeBusca =
        !termo ||
        [
          funcionario?.nome,
          ponto.data,
          ponto.status,
          ponto.observacao,
        ]
          .join(" ")
          .toLowerCase()
          .includes(termo);

      const correspondeStatus =
        !statusUrl ||
        (statusUrl === "pendente"
          ? [
            "pendente",
            "parcial_manha",
            "parcial_tarde",
          ].includes(ponto.status)
          : ponto.status === statusUrl);

      const correspondeFuncionario =
        !filtroFuncionarioId ||
        ponto.funcionarioId === filtroFuncionarioId;

      const correspondeData =
        !filtroData || ponto.data === filtroData;

      return (
        correspondeBusca &&
        correspondeStatus &&
        correspondeFuncionario &&
        correspondeData
      );
    });
  }, [
    pontos,
    funcionarios,
    search,
    statusUrl,
    filtroFuncionarioId,
    filtroData,
  ]);

  function abrirCadastro() {
    setRegistroSelecionado(null);
    setRegistroEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(
    registro: RegistroPonto,
  ) {
    setRegistroSelecionado(null);
    setRegistroEmEdicao(registro);
    setModalAberto(true);
  }

  function fecharFormulario() {
    setModalAberto(false);
    setRegistroEmEdicao(null);
  }

  function abrirDetalhes(
    registro: RegistroPonto,
  ) {
    setRegistroEmEdicao(null);
    setRegistroSelecionado(registro);
  }

  function abrirConfirmacaoExclusao(
    registro: RegistroPonto,
  ) {
    setRegistroSelecionado(null);
    setRegistroParaExcluir(registro);
  }

  function cancelarExclusao() {
    if (excluindo) {
      return;
    }

    setRegistroParaExcluir(null);
  }

  async function salvarRegistro(
    data: RegistroPontoFormData,
  ) {
    try {
      if (registroEmEdicao) {
        await editarPonto(
          registroEmEdicao.id,
          data,
        );

        toast.success(
          "Registro atualizado",
          {
            description:
              "As marcações foram atualizadas com sucesso.",
          },
        );
      } else {
        await adicionarPonto(data);

        toast.success("Registro criado", {
          description:
            "As marcações foram adicionadas com sucesso.",
        });
      }

      fecharFormulario();
    } catch {
      toast.error(
        "Não foi possível salvar",
        {
          description:
            "Verifique os dados e tente novamente.",
        },
      );
    }
  }

  async function confirmarExclusao() {
    if (!registroParaExcluir) {
      return;
    }

    try {
      setExcluindo(true);

      await excluirPonto(
        registroParaExcluir.id,
      );

      setRegistroParaExcluir(null);

      toast.success("Registro excluído", {
        description:
          "O registro de ponto foi removido com sucesso.",
      });
    } catch {
      toast.error(
        "Não foi possível excluir",
        {
          description:
            "Tente novamente em alguns instantes.",
        },
      );
    } finally {
      setExcluindo(false);
    }
  }

  const columns: DataTableColumn<RegistroPonto>[] =
    [
      {
        header: "Funcionário",
        render: (ponto) => {
          const funcionario =
            funcionarios.find(
              (item) =>
                item.id ===
                ponto.funcionarioId,
            );

          return (
            <div>
              <p className="font-semibold text-slate-900">
                {funcionario?.nome ??
                  "Funcionário não encontrado"}
              </p>

              <p className="text-xs text-slate-500">
                ID #{ponto.funcionarioId}
              </p>
            </div>
          );
        },
      },
      {
        header: "Data",
        render: (ponto) =>
          formatarData(ponto.data),
      },
      {
        header: "Entrada 1",
        render: (ponto) =>
          formatarHora(ponto.entrada1),
      },
      {
        header: "Saída 1",
        render: (ponto) =>
          formatarHora(ponto.saida1),
      },
      {
        header: "Entrada 2",
        render: (ponto) =>
          formatarHora(ponto.entrada2),
      },
      {
        header: "Saída 2",
        render: (ponto) =>
          formatarHora(ponto.saida2),
      },
      {
        header: "Horas",
        render: (ponto) =>
          formatarMinutosParaHoras(
            ponto.horasTrabalhadasMin,
          ),
      },
      {
        header: "Status",
        render: (ponto) => (
          <StatusBadge
            status={ponto.status}
          />
        ),
      },
      {
        header: "Ações",
        className: "text-right",
        render: (registro) => (
          <ActionMenu
            onView={() =>
              abrirDetalhes(registro)
            }
            onEdit={() =>
              abrirEdicao(registro)
            }
            onDelete={() =>
              abrirConfirmacaoExclusao(
                registro,
              )
            }
          />
        ),
      },
    ];

  if (
    loadingPontos &&
    pontos.length === 0
  ) {
    return <PageSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Registros de ponto"
        description="Acompanhe as marcações diárias dos funcionários."
        action={
          <ActionButton
            onClick={abrirCadastro}
          >
            <Plus className="h-4 w-4" />
            Novo registro
          </ActionButton>
        }
      />

      {errorPontos && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">
            Erro ao carregar registros de
            ponto
          </p>

          <p>{errorPontos}</p>
        </div>
      )}

      {filtroPendenciasAtivo && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Filtro de pendências ativo
            </p>

            <p className="mt-0.5 text-xs text-amber-700">
              Exibindo registros pendentes
              ou parciais.
            </p>
          </div>

          <Link
            href="/registros"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            <FilterX className="h-4 w-4" />
            Limpar filtro
          </Link>
        </div>
      )}

      <SectionCard
        title={
          filtroPendenciasAtivo
            ? "Registros pendentes"
            : "Marcações registradas"
        }
        description={
          filtroPendenciasAtivo
            ? "Registros que precisam de conferência ou conclusão."
            : "Consulte entradas, saídas, horas trabalhadas e status."
        }
        action={
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            {/* Filtro por funcionário */}
            <select
              value={filtroFuncionarioId}
              onChange={(e) =>
                setFiltroFuncionarioId(
                  Number(e.target.value),
                )
              }
              className={selectClass}
              aria-label="Filtrar por funcionário"
            >
              <option value={0}>
                Todos os funcionários
              </option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>

            {/* Filtro por data */}
            <div className="relative flex items-center">
              <CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={filtroData}
                onChange={(e) =>
                  setFiltroData(e.target.value)
                }
                className={`${selectClass} pl-9`}
                aria-label="Filtrar por data"
              />
              {filtroData && (
                <button
                  type="button"
                  onClick={() => setFiltroData("")}
                  className="absolute right-2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Limpar filtro de data"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Busca por texto */}
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar por funcionário, status..."
            />

            {/* Botão limpar filtros */}
            {filtrosAtivos && (
              <button
                type="button"
                onClick={limparFiltros}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <FilterX className="h-4 w-4" />
                Limpar
              </button>
            )}
          </div>
        }
      >
        <DataTable
          data={registrosFiltrados}
          columns={columns}
          emptyIcon={
            search || filtrosAtivos
              ? SearchX
              : filtroPendenciasAtivo
                ? FilterX
                : Clock3
          }
          emptyVariant={
            search || filtroPendenciasAtivo || filtrosAtivos
              ? "search"
              : "default"
          }
          emptyTitle={
            search || filtrosAtivos
              ? "Nenhum registro encontrado"
              : filtroPendenciasAtivo
                ? "Nenhuma pendência encontrada"
                : "Nenhum registro de ponto"
          }
          emptyDescription={
            search || filtrosAtivos
              ? "Tente pesquisar com outros filtros."
              : filtroPendenciasAtivo
                ? "Todos os registros estão completos no momento."
                : "Ainda não existem marcações de ponto cadastradas."
          }
          emptyAction={
            !search &&
              !filtroPendenciasAtivo &&
              !filtrosAtivos ? (
              <ActionButton
                onClick={abrirCadastro}
              >
                <Plus className="h-4 w-4" />
                Novo registro
              </ActionButton>
            ) : undefined
          }
        />
      </SectionCard>

      <Modal
        open={modalAberto}
        title={
          registroEmEdicao
            ? "Editar registro de ponto"
            : "Novo registro de ponto"
        }
        description={
          registroEmEdicao
            ? "Atualize as marcações do registro selecionado."
            : "Lance manualmente as marcações de entrada e saída."
        }
        onClose={fecharFormulario}
      >
        <RegistroForm
          key={
            registroEmEdicao?.id ?? "novo"
          }
          initialData={registroEmEdicao}
          funcionarios={funcionarios}
          onCancel={fecharFormulario}
          onSubmit={salvarRegistro}
        />
      </Modal>

      <Drawer
        open={Boolean(
          registroSelecionado,
        )}
        title="Detalhes do registro"
        description="Marcações e informações do ponto."
        onClose={() =>
          setRegistroSelecionado(null)
        }
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() =>
                setRegistroSelecionado(null)
              }
            >
              Fechar
            </ActionButton>

            <ActionButton
              type="button"
              onClick={() => {
                if (registroSelecionado) {
                  abrirEdicao(
                    registroSelecionado,
                  );
                }
              }}
            >
              Editar registro
            </ActionButton>
          </div>
        }
      >
        {registroSelecionado && (
          <RegistroDetalhes
            registro={
              registroSelecionado
            }
            funcionarios={funcionarios}
          />
        )}
      </Drawer>

      <ConfirmDialog
        open={Boolean(
          registroParaExcluir,
        )}
        title="Excluir registro"
        description={
          registroParaExcluir
            ? `Tem certeza de que deseja excluir o registro do dia ${formatarData(
              registroParaExcluir.data,
            )}? Esta ação não poderá ser desfeita.`
            : ""
        }
        confirmLabel="Excluir registro"
        cancelLabel="Cancelar"
        loading={excluindo}
        onCancel={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />
    </PageContainer>
  );
}