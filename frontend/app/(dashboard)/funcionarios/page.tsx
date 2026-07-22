"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { ActionButton } from "@/components/common/ActionButton";
import { ActionMenu } from "@/components/common/ActionMenu";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { Drawer } from "@/components/common/Drawer";
import { Modal } from "@/components/common/Modal";
import { PageContainer } from "@/components/common/PageContainer";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";

import { PageHeader } from "@/components/layout/PageHeader";
import { FuncionarioDetalhes } from "@/components/modules/funcionarios/FuncionarioDetalhes";
import { FuncionarioForm } from "@/components/modules/funcionarios/FuncionarioForm";

import { useFuncionarios } from "@/hooks/useFuncionarios";
import { toast } from "sonner";

import type { Funcionario, FuncionarioFormData } from "@/types/funcionario";

export default function FuncionariosPage() {
  const {
    funcionarios,
    adicionarFuncionario,
    editarFuncionario,
    excluirFuncionario,
  } = useFuncionarios();

  const [search, setSearch] = useState("");

  const [modalAberto, setModalAberto] = useState(false);

  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<Funcionario | null>(null);

  const [funcionarioEmEdicao, setFuncionarioEmEdicao] =
    useState<Funcionario | null>(null);

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

  function abrirCadastro() {
    setFuncionarioSelecionado(null);
    setFuncionarioEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(funcionario: Funcionario) {
    setFuncionarioSelecionado(null);
    setFuncionarioEmEdicao(funcionario);
    setModalAberto(true);
  }

  function fecharFormulario() {
    setModalAberto(false);
    setFuncionarioEmEdicao(null);
  }

  function abrirDetalhes(funcionario: Funcionario) {
    setFuncionarioEmEdicao(null);
    setFuncionarioSelecionado(funcionario);
  }

  function abrirConfirmacaoExclusao(funcionario: Funcionario) {
    setFuncionarioSelecionado(null);
    setFuncionarioParaExcluir(funcionario);
  }

  function cancelarExclusao() {
    if (excluindo) {
      return;
    }

    setFuncionarioParaExcluir(null);
  }

  async function salvarFuncionario(data: FuncionarioFormData) {
    try {
      if (funcionarioEmEdicao) {
        await editarFuncionario(funcionarioEmEdicao.id, data);

        toast.success("Funcionário atualizado", {
          description: "As informações foram atualizadas com sucesso.",
        });
      } else {
        await adicionarFuncionario(data);

        toast.success("Funcionário cadastrado", {
          description: "O novo funcionário foi adicionado com sucesso.",
        });
      }

      fecharFormulario();
    } catch {
      toast.error("Não foi possível salvar", {
        description: "Verifique os dados e tente novamente.",
      });
    }
  }

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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">
              {iniciais}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {funcionario.nome}
              </p>

              <p className="text-xs text-slate-500">ID #{funcionario.id}</p>
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
      render: (funcionario) => `${funcionario.cargaDiariaHoras}h/dia`,
    },
    {
      header: "Carga mensal",
      render: (funcionario) => `${funcionario.cargaMensalHoras}h/mês`,
    },
    {
      header: "Status",
      render: (funcionario) => <StatusBadge status={funcionario.status} />,
    },
    {
      header: "Ações",
      className: "text-right",
      render: (funcionario) => (
        <ActionMenu
          onView={() => abrirDetalhes(funcionario)}
          onEdit={() => abrirEdicao(funcionario)}
          onDelete={() => abrirConfirmacaoExclusao(funcionario)}
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
          <ActionButton onClick={abrirCadastro}>
            <Plus className="h-4 w-4" />
            Novo funcionário
          </ActionButton>
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

      <Modal
        open={modalAberto}
        title={funcionarioEmEdicao ? "Editar funcionário" : "Novo funcionário"}
        description={
          funcionarioEmEdicao
            ? "Atualize os dados do colaborador selecionado."
            : "Cadastre um novo colaborador no sistema."
        }
        onClose={fecharFormulario}
      >
        <FuncionarioForm
          key={funcionarioEmEdicao?.id ?? "novo"}
          initialData={funcionarioEmEdicao}
          onCancel={fecharFormulario}
          onSubmit={salvarFuncionario}
        />
      </Modal>

      <Drawer
        open={Boolean(funcionarioSelecionado)}
        title="Detalhes do funcionário"
        description="Informações cadastrais e profissionais."
        onClose={() => setFuncionarioSelecionado(null)}
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() => setFuncionarioSelecionado(null)}
            >
              Fechar
            </ActionButton>

            <ActionButton
              type="button"
              onClick={() => {
                if (funcionarioSelecionado) {
                  abrirEdicao(funcionarioSelecionado);
                }
              }}
            >
              Editar funcionário
            </ActionButton>
          </div>
        }
      >
        {funcionarioSelecionado && (
          <FuncionarioDetalhes funcionario={funcionarioSelecionado} />
        )}
      </Drawer>

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
        onCancel={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />
    </PageContainer>
  );
}
