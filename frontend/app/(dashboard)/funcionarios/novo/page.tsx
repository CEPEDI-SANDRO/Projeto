"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { FuncionarioForm } from "@/components/modules/funcionarios/FuncionarioForm";

import { useFuncionarios } from "@/hooks/useFuncionarios";
import type { FuncionarioFormData } from "@/types/funcionario";

export default function NovoFuncionarioPage() {
  const router = useRouter();

  const { adicionarFuncionario } = useFuncionarios();

  async function salvarFuncionario(
    data: FuncionarioFormData,
  ) {
    try {
      const novoFuncionario =
        await adicionarFuncionario(data);

      toast.success("Funcionário cadastrado", {
        description:
          "O novo colaborador foi adicionado com sucesso.",
      });

      /*
       * Como o hook atualmente não declara explicitamente
       * o retorno no TypeScript, voltamos à listagem.
       *
       * Futuramente, com a API, poderá ser:
       * router.push(`/funcionarios/${novoFuncionario.id}`);
       */
      void novoFuncionario;

      router.push("/funcionarios");
    } catch {
      toast.error("Não foi possível cadastrar", {
        description:
          "Verifique os dados informados e tente novamente.",
      });
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Novo funcionário"
        description="Cadastre os dados profissionais do novo colaborador."
      />

      <SectionCard
        title="Dados do funcionário"
        description="Preencha os campos obrigatórios para realizar o cadastro."
      >
        <FuncionarioForm
          onCancel={() => router.push("/funcionarios")}
          onSubmit={salvarFuncionario}
        />
      </SectionCard>
    </PageContainer>
  );
}