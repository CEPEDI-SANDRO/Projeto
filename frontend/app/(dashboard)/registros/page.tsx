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
import { RegistroDetalhes } from "@/components/modules/registro/RegistroDetalhes";
import { RegistroForm } from "@/components/modules/registro/RegistroForm";

import { usePontos } from "@/hooks/usePontos";
import { toast } from "sonner";
import { funcionariosMock } from "@/mocks/funcionarios.mock";

import {
  formatarData,
  formatarHora,
  formatarMinutosParaHoras,
} from "@/lib/formatters";

import type { RegistroPonto, RegistroPontoFormData } from "@/types/ponto";

export default function RegistrosPage() {
  const { pontos, adicionarPonto, editarPonto, excluirPonto } = usePontos();

  const [search, setSearch] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const [registroSelecionado, setRegistroSelecionado] =
    useState<RegistroPonto | null>(null);

  const [registroEmEdicao, setRegistroEmEdicao] =
    useState<RegistroPonto | null>(null);

  const [registroParaExcluir, setRegistroParaExcluir] =
    useState<RegistroPonto | null>(null);

  const [excluindo, setExcluindo] = useState(false);

  const registrosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();

    if (!termo) {
      return pontos;
    }

    return pontos.filter((ponto) => {
      const funcionario = funcionariosMock.find(
        (item) => item.id === ponto.funcionarioId,
      );

      return [funcionario?.nome, ponto.data, ponto.status, ponto.observacao]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [pontos, search]);

  function abrirCadastro() {
    setRegistroSelecionado(null);
    setRegistroEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(registro: RegistroPonto) {
    setRegistroSelecionado(null);
    setRegistroEmEdicao(registro);
    setModalAberto(true);
  }

  function fecharFormulario() {
    setModalAberto(false);
    setRegistroEmEdicao(null);
  }

  function abrirDetalhes(registro: RegistroPonto) {
    setRegistroEmEdicao(null);
    setRegistroSelecionado(registro);
  }

  function abrirConfirmacaoExclusao(registro: RegistroPonto) {
    setRegistroSelecionado(null);
    setRegistroParaExcluir(registro);
  }

  function cancelarExclusao() {
    if (excluindo) {
      return;
    }

    setRegistroParaExcluir(null);
  }

  async function salvarRegistro(data: RegistroPontoFormData) {
    try {
      if (registroEmEdicao) {
        await editarPonto(registroEmEdicao.id, data);

        toast.success("Registro atualizado", {
          description: "As marcações foram atualizadas com sucesso.",
        });
      } else {
        await adicionarPonto(data);

        toast.success("Registro criado", {
          description: "As marcações foram adicionadas com sucesso.",
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
    if (!registroParaExcluir) {
      return;
    }

    try {
      setExcluindo(true);

      await excluirPonto(registroParaExcluir.id);

      setRegistroParaExcluir(null);

      toast.success("Registro excluído", {
        description: "O registro de ponto foi removido com sucesso.",
      });
    } catch {
      toast.error("Não foi possível excluir", {
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setExcluindo(false);
    }
  }

  const columns: DataTableColumn<RegistroPonto>[] = [
    {
      header: "Funcionário",
      render: (ponto) => {
        const funcionario = funcionariosMock.find(
          (item) => item.id === ponto.funcionarioId,
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
      render: (registro) => (
        <ActionMenu
          onView={() => abrirDetalhes(registro)}
          onEdit={() => abrirEdicao(registro)}
          onDelete={() => abrirConfirmacaoExclusao(registro)}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Registros de ponto"
        description="Acompanhe as marcações diárias dos funcionários."
        action={
          <ActionButton onClick={abrirCadastro}>
            <Plus className="h-4 w-4" />
            Novo registro
          </ActionButton>
        }
      />

      <SectionCard
        title="Marcações registradas"
        description="Consulte entradas, saídas, horas trabalhadas e status."
        action={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por funcionário, data ou status..."
          />
        }
      >
        <DataTable
          data={registrosFiltrados}
          columns={columns}
          emptyTitle="Nenhum registro encontrado"
          emptyDescription="Tente pesquisar por outro funcionário, data ou status."
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
          key={registroEmEdicao?.id ?? "novo"}
          initialData={registroEmEdicao}
          onCancel={fecharFormulario}
          onSubmit={salvarRegistro}
        />
      </Modal>

      <Drawer
        open={Boolean(registroSelecionado)}
        title="Detalhes do registro"
        description="Marcações e informações do ponto."
        onClose={() => setRegistroSelecionado(null)}
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() => setRegistroSelecionado(null)}
            >
              Fechar
            </ActionButton>

            <ActionButton
              type="button"
              onClick={() => {
                if (registroSelecionado) {
                  abrirEdicao(registroSelecionado);
                }
              }}
            >
              Editar registro
            </ActionButton>
          </div>
        }
      >
        {registroSelecionado && (
          <RegistroDetalhes registro={registroSelecionado} />
        )}
      </Drawer>

      <ConfirmDialog
        open={Boolean(registroParaExcluir)}
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
