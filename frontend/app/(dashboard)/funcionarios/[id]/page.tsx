"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { ActionButton } from "@/components/common/ActionButton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer } from "@/components/common/PageContainer";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { SectionCard } from "@/components/common/SectionCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { FuncionarioDetalhes } from "@/components/modules/funcionarios/FuncionarioDetalhes";
import { FuncionarioForm } from "@/components/modules/funcionarios/FuncionarioForm";

import { useFuncionarios } from "@/hooks/useFuncionarios";

import type { Funcionario, FuncionarioFormData } from "@/types/funcionario";

export default function FuncionarioDetalhesPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const funcionarioId = Number(params.id);

  const { loading, buscarFuncionarioPorId, editarFuncionario } =
    useFuncionarios();

  const [funcionario, setFuncionario] = useState<Funcionario | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);

  const editarInicialmente =
    searchParams.get("editar") === "true";

  const [editando, setEditando] =
    useState(editarInicialmente);

  // Carrega o funcionário diretamente pelo ID ao montar a página
  useEffect(() => {
    if (!Number.isFinite(funcionarioId)) {
      setCarregando(false);
      return;
    }

    buscarFuncionarioPorId(funcionarioId).then((data) => {
      setFuncionario(data);
      setCarregando(false);
    });
  }, [funcionarioId]);

  async function salvarAlteracoes(
    data: FuncionarioFormData,
  ) {
    if (!funcionario) {
      return;
    }

    try {
      const atualizado = await editarFuncionario(funcionario.id, data);

      if (atualizado) {
        setFuncionario(atualizado);
      }

      setEditando(false);

      toast.success("Funcionário atualizado", {
        description:
          "As informações foram salvas com sucesso.",
      });

      router.replace(`/funcionarios/${funcionario.id}`);
    } catch {
      toast.error("Não foi possível atualizar", {
        description:
          "Verifique os dados e tente novamente.",
      });
    }
  }

  if (carregando || loading) {
    return <PageSkeleton />;
  }

  if (!Number.isFinite(funcionarioId) || !funcionario) {
    return (
      <PageContainer>
        <PageHeader
          title="Funcionário não encontrado"
          description="O cadastro solicitado não está disponível."
        />

        <SectionCard>
          <EmptyState
            icon={ArrowLeft}
            title="Funcionário não encontrado"
            description="O funcionário pode ter sido removido ou o endereço acessado é inválido."
            action={
              <Link
                href="/funcionarios"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-black transition hover:bg-primary-hover"
              >
                Voltar para funcionários
              </Link>
            }
          />
        </SectionCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={
          editando
            ? "Editar funcionário"
            : funcionario.nome
        }
        description={
          editando
            ? "Atualize os dados do colaborador."
            : "Consulte os dados profissionais e a jornada vinculada."
        }
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/funcionarios"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>

            {!editando && (
              <>
                <Link
                  href={`/funcionarios/${funcionario.id}/jornada`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <CalendarClock className="h-4 w-4" />
                  Configurar jornada
                </Link>

                <ActionButton
                  type="button"
                  onClick={() => setEditando(true)}
                >
                  <Pencil className="h-4 w-4" />
                  Editar funcionário
                </ActionButton>
              </>
            )}
          </div>
        }
      />

      {editando ? (
        <SectionCard
          title="Editar dados"
          description="Altere somente as informações necessárias."
        >
          <FuncionarioForm
            key={funcionario.id}
            initialData={funcionario}
            onCancel={() => {
              setEditando(false);
              router.replace(
                `/funcionarios/${funcionario.id}`,
              );
            }}
            onSubmit={salvarAlteracoes}
          />
        </SectionCard>
      ) : (
        <SectionCard
          title="Informações do funcionário"
          description="Dados cadastrais e profissionais do colaborador."
        >
          <FuncionarioDetalhes funcionario={funcionario} />
        </SectionCard>
      )}
    </PageContainer>
  );
}