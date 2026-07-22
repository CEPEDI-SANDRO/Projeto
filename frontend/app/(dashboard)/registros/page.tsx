"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { ActionButton } from "@/components/common/ActionButton";
import { Modal } from "@/components/common/Modal";

import { usePontos } from "@/hooks/usePontos";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import type { RegistroPonto } from "@/types/ponto";
import {
  formatarData,
  formatarHora,
  formatarMinutosParaHoras,
} from "@/lib/formatters";
import { RegistroForm } from "@/components/modules/registro/RegistroForm";

export default function RegistrosPage() {
  const { pontos, loading: loadingPontos, error: errorPontos, carregarPontos, adicionarPonto } = usePontos();
  const { funcionarios, carregarFuncionarios } = useFuncionarios();

  const [search, setSearch] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  // Carrega pontos e funcionários ao montar a tela
  useEffect(() => {
    carregarPontos();
    carregarFuncionarios();
  }, []);

  // Exibe erro do servidor caso aconteça
  useEffect(() => {
    if (errorPontos) {
      toast.error(errorPontos);
    }
  }, [errorPontos]);

  const registros = useMemo(() => {
    const termo = search.toLowerCase();

    return pontos.filter((ponto) => {
      const funcionario = funcionarios.find(
        (f) => f.id === ponto.funcionarioId
      );

      return [funcionario?.nome, ponto.data, ponto.status]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [pontos, funcionarios, search]);

  const columns: DataTableColumn<RegistroPonto>[] = [
    {
      header: "Funcionário",
      render: (ponto) => {
        const funcionario = funcionarios.find(
          (item) => item.id === ponto.funcionarioId
        );

        return (
          <div>
            <p className="font-semibold text-slate-900">
              {funcionario?.nome ?? "Funcionário não encontrado"}
            </p>
            <p className="text-xs text-slate-500">ID #{ponto.funcionarioId}</p>
          </div>
        );
      },
    },
    {
      header: "Data",
      render: (ponto) => formatarData(ponto.data),
    },
    {
      header: "Entrada 1",
      render: (ponto) => formatarHora(ponto.entrada1),
    },
    {
      header: "Saída 1",
      render: (ponto) => formatarHora(ponto.saida1),
    },
    {
      header: "Entrada 2",
      render: (ponto) => formatarHora(ponto.entrada2),
    },
    {
      header: "Saída 2",
      render: (ponto) => formatarHora(ponto.saida2),
    },
    {
      header: "Horas",
      render: (ponto) => formatarMinutosParaHoras(ponto.horasTrabalhadasMin),
    },
    {
      header: "Status",
      render: (ponto) => <StatusBadge status={ponto.status} />,
    },
    {
      header: "Ações",
      className: "text-right",
      render: () => (
        <button className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
          Editar
        </button>
      ),
    },
  ];

  const handleRecarregar = () => {
    carregarPontos();
    carregarFuncionarios();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Registros de ponto"
        description="Acompanhe as marcações diárias dos funcionários."
        action={
          <div className="flex gap-2">
            <button
              onClick={handleRecarregar}
              title="Recarregar dados"
              disabled={loadingPontos}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loadingPontos ? 'animate-spin' : ''}`} />
            </button>
            
            <ActionButton onClick={() => setModalAberto(true)}>
              <Plus className="h-4 w-4" />
              Novo registro
            </ActionButton>
          </div>
        }
      />

      <SectionCard
        title="Marcações registradas"
        description="Consulte entradas, saídas, horas trabalhadas e status."
        action={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar registro..."
          />
        }
      >
        {loadingPontos && pontos.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white">
            <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
            <p className="text-sm font-medium text-slate-500">Buscando marcações no banco de dados...</p>
          </div>
        ) : (
          <DataTable
            data={registros}
            columns={columns}
            emptyTitle="Nenhum registro encontrado"
            emptyDescription="Tente pesquisar por outro funcionário, data ou status."
          />
        )}
      </SectionCard>

      <Modal
        open={modalAberto}
        title="Novo registro de ponto"
        description="Lance manualmente as marcações de entrada e saída."
        onClose={() => setModalAberto(false)}
      >
        <RegistroForm
          funcionarios={funcionarios}
          onCancel={() => setModalAberto(false)}
          onSubmit={async (data) => {
            try {
              await adicionarPonto(data);
              toast.success("Registro de ponto lançado com sucesso!");
              setModalAberto(false);
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Erro ao lançar ponto.";
              toast.error(msg);
            }
          }}
        />
      </Modal>
    </PageContainer>
  );
}