"use client";

import {
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
} from "lucide-react";
import { toast } from "sonner";

import { ActionButton } from "@/components/common/ActionButton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionCard } from "@/components/common/SectionCard";
import { PageHeader } from "@/components/layout/PageHeader";

import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useJornadas } from "@/hooks/useJornadas";

import type { JornadaFormData } from "@/types/jornada";

export default function JornadaFuncionarioPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const funcionarioId = Number(params.id);

  const { funcionarios } = useFuncionarios();

  const {
    jornadas,
    adicionarJornada,
    editarJornada,
  } = useJornadas();

  const funcionario = funcionarios.find(
    (item) => item.id === funcionarioId,
  );

  const jornadaExistente = jornadas.find(
    (item) => item.funcionarioId === funcionarioId,
  );

  const [formData, setFormData] =
    useState<JornadaFormData>(() => ({
      funcionarioId,
      entrada1: jornadaExistente?.entrada1 ?? "08:00",
      saida1: jornadaExistente?.saida1 ?? "12:00",
      entrada2: jornadaExistente?.entrada2 ?? "13:00",
      saida2: jornadaExistente?.saida2 ?? "17:00",
      toleranciaMinutos:
        jornadaExistente?.toleranciaMinutos ?? 10,
      percentualHoraExtra:
        jornadaExistente?.percentualHoraExtra ?? 50,
    }));

  const [salvando, setSalvando] = useState(false);

  function atualizarCampo<
    K extends keyof JornadaFormData,
  >(
    campo: K,
    valor: JornadaFormData[K],
  ) {
    setFormData((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  async function salvarJornada(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSalvando(true);

      if (jornadaExistente) {
        await editarJornada(
          jornadaExistente.id,
          formData,
        );

        toast.success("Jornada atualizada", {
          description:
            "Os horários foram atualizados com sucesso.",
        });
      } else {
        await adicionarJornada(formData);

        toast.success("Jornada cadastrada", {
          description:
            "A jornada foi vinculada ao funcionário.",
        });
      }

      router.push(`/funcionarios/${funcionarioId}`);
    } catch {
      toast.error("Não foi possível salvar", {
        description:
          "Verifique os horários e tente novamente.",
      });
    } finally {
      setSalvando(false);
    }
  }

  if (!Number.isFinite(funcionarioId) || !funcionario) {
    return (
      <PageContainer>
        <PageHeader
          title="Funcionário não encontrado"
          description="Não foi possível configurar a jornada."
        />

        <SectionCard>
          <EmptyState
            icon={CalendarClock}
            title="Funcionário não encontrado"
            description="Volte para a listagem e selecione um funcionário válido."
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
        title={`Jornada de ${funcionario.nome}`}
        description="Configure os horários, tolerância e percentual de hora extra."
        action={
          <Link
            href={`/funcionarios/${funcionario.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        }
      />

      <SectionCard
        title="Horários da jornada"
        description="Informe os horários previstos para o expediente."
      >
        <form
          className="space-y-6"
          onSubmit={salvarJornada}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <CampoHora
              label="Entrada 1"
              value={formData.entrada1}
              onChange={(valor) =>
                atualizarCampo("entrada1", valor)
              }
            />

            <CampoHora
              label="Saída 1"
              value={formData.saida1}
              onChange={(valor) =>
                atualizarCampo("saida1", valor)
              }
            />

            <CampoHora
              label="Entrada 2"
              value={formData.entrada2}
              onChange={(valor) =>
                atualizarCampo("entrada2", valor)
              }
            />

            <CampoHora
              label="Saída 2"
              value={formData.saida2}
              onChange={(valor) =>
                atualizarCampo("saida2", valor)
              }
            />
          </div>

          <div className="grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Tolerância em minutos
              </span>

              <input
                type="number"
                min={0}
                value={formData.toleranciaMinutos}
                onChange={(event) =>
                  atualizarCampo(
                    "toleranciaMinutos",
                    Number(event.target.value),
                  )
                }
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Percentual de hora extra
              </span>

              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={formData.percentualHoraExtra}
                  onChange={(event) =>
                    atualizarCampo(
                      "percentualHoraExtra",
                      Number(event.target.value),
                    )
                  }
                  className={`${inputClass} pr-10`}
                />

                <span className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-sm text-slate-400">
                  %
                </span>
              </div>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() =>
                router.push(
                  `/funcionarios/${funcionario.id}`,
                )
              }
              disabled={salvando}
            >
              Cancelar
            </ActionButton>

            <ActionButton
              type="submit"
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : jornadaExistente
                  ? "Salvar alterações"
                  : "Cadastrar jornada"}
            </ActionButton>
          </div>
        </form>
      </SectionCard>
    </PageContainer>
  );
}

interface CampoHoraProps {
  label: string;
  value: string;
  onChange: (valor: string) => void;
}

function CampoHora({
  label,
  value,
  onChange,
}: CampoHoraProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type="time"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={inputClass}
        required
      />
    </label>
  );
}

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20";