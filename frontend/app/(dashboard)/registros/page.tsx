"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { ActionButton } from "@/components/common/ActionButton";
import { Modal } from "@/components/common/Modal";

import { usePontos } from "@/hooks/usePontos";
import { funcionariosMock } from "@/mocks/funcionarios.mock";
import type { RegistroPonto } from "@/types/ponto";
import {
  formatarData,
  formatarHora,
  formatarMinutosParaHoras,
} from "@/lib/formatters";
import { RegistroForm } from "@/components/modules/registro/RegistroForm";

export default function RegistrosPage() {
  const { pontos } = usePontos();

  const [search, setSearch] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const registros = useMemo(() => {
    const termo = search.toLowerCase();

    return pontos.filter((ponto) => {
      const funcionario = funcionariosMock.find(
        (funcionario) => funcionario.id === ponto.funcionarioId
      );

      return [funcionario?.nome, ponto.data, ponto.status]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [pontos, search]);

  const columns: DataTableColumn<RegistroPonto>[] = [
    {
      header: "Funcionário",
      render: (ponto) => {
        const funcionario = funcionariosMock.find(
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

  return (
    <PageContainer>
      <PageHeader
        title="Registros de ponto"
        description="Acompanhe as marcações diárias dos funcionários."
        action={
          <ActionButton onClick={() => setModalAberto(true)}>
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
            placeholder="Buscar registro..."
          />
        }
      >
        <DataTable
          data={registros}
          columns={columns}
          emptyTitle="Nenhum registro encontrado"
          emptyDescription="Tente pesquisar por outro funcionário, data ou status."
        />
      </SectionCard>

      <Modal
        open={modalAberto}
        title="Novo registro de ponto"
        description="Lance manualmente as marcações de entrada e saída."
        onClose={() => setModalAberto(false)}
      >
        <RegistroForm
          onCancel={() => setModalAberto(false)}
          onSubmit={() => setModalAberto(false)}
        />
      </Modal>
    </PageContainer>
  );
}