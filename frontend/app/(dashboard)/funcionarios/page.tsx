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
import { FuncionarioForm } from "@/components/modules/funcionarios/FuncionarioForm";

import { useFuncionarios } from "@/hooks/useFuncionarios";
import type { Funcionario } from "@/types/funcionario";

export default function FuncionariosPage() {
  const { funcionarios, loading, error, carregarFuncionarios, adicionarFuncionario } = useFuncionarios();

  const [search, setSearch] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  // Carrega os funcionários do backend na montagem do componente
  useEffect(() => {
    carregarFuncionarios();
  }, []);

  // Exibe erro do servidor caso aconteça
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const funcionariosFiltrados = useMemo(() => {
    const termo = search.toLowerCase();

    return funcionarios.filter((funcionario) =>
      [funcionario.nome, funcionario.cargo, funcionario.matricula, funcionario.documento]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    );
  }, [funcionarios, search]);

  const columns: DataTableColumn<Funcionario>[] = [
    {
      header: "Funcionário",
      render: (funcionario) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
            {funcionario.nome
              .split(" ")
              .slice(0, 2)
              .map((nome) => nome[0])
              .join("")}
          </div>

          <div>
            <p className="font-semibold text-slate-900">{funcionario.nome}</p>
            <p className="text-xs text-slate-500">Documento: {funcionario.documento}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Cargo",
      accessor: "cargo",
    },
    {
      header: "Matrícula",
      accessor: "matricula",
    },
    {
      header: "Carga diária",
      render: (funcionario) => `${funcionario.cargaDiariaHoras}h/dia`,
    },
    {
      header: "Status",
      render: (funcionario) => <StatusBadge status={funcionario.status} />,
    },
    {
      header: "Ações",
      className: "text-right",
      render: () => (
        <button className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
          Ver detalhes
        </button>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Funcionários"
        description="Gerencie os colaboradores cadastrados no sistema."
        action={
          <div className="flex gap-2">
            <button
              onClick={() => carregarFuncionarios()}
              title="Recarregar dados"
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <ActionButton onClick={() => setModalAberto(true)}>
              <Plus className="h-4 w-4" />
              Novo funcionário
            </ActionButton>
          </div>
        }
      />

      <SectionCard
        title="Lista de funcionários"
        description="Consulte, pesquise e acompanhe os vínculos cadastrados."
        action={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar funcionário..."
          />
        }
      >
        {loading && funcionarios.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white">
            <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
            <p className="text-sm font-medium text-slate-500">Buscando colaboradores no banco de dados...</p>
          </div>
        ) : (
          <DataTable
            data={funcionariosFiltrados}
            columns={columns}
            emptyTitle="Nenhum funcionário encontrado"
            emptyDescription="Tente pesquisar por outro nome, cargo, matrícula ou documento."
          />
        )}
      </SectionCard>

      <Modal
        open={modalAberto}
        title="Novo funcionário"
        description="Cadastre um novo colaborador no sistema."
        onClose={() => setModalAberto(false)}
      >
        <FuncionarioForm
          onCancel={() => setModalAberto(false)}
          onSubmit={async (data) => {
            try {
              await adicionarFuncionario(data);
              toast.success("Funcionário cadastrado com sucesso!");
              setModalAberto(false);
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Erro ao cadastrar funcionário.";
              toast.error(msg);
            }
          }}
        />
      </Modal>
    </PageContainer>
  );
}