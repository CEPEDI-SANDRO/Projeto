"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { ActionMenu } from "@/components/common/ActionMenu";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/DataTable";
import { PageContainer } from "@/components/common/PageContainer";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";

import { useFuncionarios } from "@/hooks/useFuncionarios";
import type { Funcionario } from "@/types/funcionario";

export default function FuncionariosPage() {
  const router = useRouter();

  const { funcionarios, excluirFuncionario } = useFuncionarios();

  const [search, setSearch] = useState("");

  const [funcionarioParaExcluir, setFuncionarioParaExcluir] =
    useState<Funcionario | null>(null);

  const [excluindo, setExcluindo] = useState(false);

  const funcionariosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();

    if (!termo) {
      return funcionarios;
    }

    return funcionarios.filter((funcionario) =>
      [
        funcionario.nome,
        funcionario.cargo,
        funcionario.matricula,
        funcionario.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(termo),
    );
  }, [funcionarios, search]);

  async function confirmarExclusao() {
    if (!funcionarioParaExcluir) {
      return;
    }

    try {
      setExcluindo(true);

      const nome = funcionarioParaExcluir.nome;

      await excluirFuncionario(funcionarioParaExcluir.id);

      setFuncionarioParaExcluir(null);

      toast.success("Funcionário excluído", {
        description: `${nome} foi removido do sistema.`,
      });
    } catch {
      toast.error("Não foi possível excluir", {
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setExcluindo(false);
    }
  }

  const columns: DataTableColumn<Funcionario>[] = [
    {
      header: "Funcionário",
      render: (funcionario) => {
        const iniciais = funcionario.nome
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
                {funcionario.nome}
              </p>

              <p className="text-xs text-slate-500">
                ID #{funcionario.id}
              </p>
            </div>
          </div>
        );
      },
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
      render: (funcionario) =>
        `${funcionario.cargaDiariaHoras}h/dia`,
    },
    {
      header: "Carga mensal",
      render: (funcionario) =>
        `${funcionario.cargaMensalHoras}h/mês`,
    },
    {
      header: "Status",
      render: (funcionario) => (
        <StatusBadge status={funcionario.status} />
      ),
    },
    {
      header: "Ações",
      className: "text-right",
      render: (funcionario) => (
        <ActionMenu
          onView={() =>
            router.push(`/funcionarios/${funcionario.id}`)
          }
          onEdit={() =>
            router.push(`/funcionarios/${funcionario.id}?editar=true`)
          }
          onDelete={() =>
            setFuncionarioParaExcluir(funcionario)
          }
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Funcionários"
        description="Gerencie os colaboradores cadastrados no sistema."
        action={
          <Link
            href="/funcionarios/novo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-black shadow-sm transition hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Novo funcionário
          </Link>
        }
      />

      <SectionCard
        title="Lista de funcionários"
        description="Consulte, pesquise e acompanhe os vínculos cadastrados."
        action={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome, cargo ou matrícula..."
          />
        }
      >
        <DataTable
          data={funcionariosFiltrados}
          columns={columns}
          emptyTitle="Nenhum funcionário encontrado"
          emptyDescription="Tente pesquisar por outro nome, cargo ou matrícula."
        />
      </SectionCard>

      <ConfirmDialog
        open={Boolean(funcionarioParaExcluir)}
        title="Excluir funcionário"
        description={
          funcionarioParaExcluir
            ? `Tem certeza de que deseja excluir ${funcionarioParaExcluir.nome}? Esta ação não poderá ser desfeita.`
            : ""
        }
        confirmLabel="Excluir funcionário"
        cancelLabel="Cancelar"
        loading={excluindo}
        onCancel={() => {
          if (!excluindo) {
            setFuncionarioParaExcluir(null);
          }
        }}
        onConfirm={confirmarExclusao}
      />
    </PageContainer>
  );
}