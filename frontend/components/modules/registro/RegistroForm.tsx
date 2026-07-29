"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { ActionButton } from "@/components/common/ActionButton";
import { funcionariosMock } from "@/mocks/funcionarios.mock";

import type { Funcionario } from "@/types/funcionario";
import type {
  RegistroPonto,
  RegistroPontoFormData,
} from "@/types/ponto";

interface RegistroFormProps {
  initialData?: RegistroPonto | null;
  funcionarios?: Funcionario[];
  onCancel: () => void;
  onSubmit: (
    data: RegistroPontoFormData,
  ) => void | Promise<void>;
}

function getHojeISO(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

const valoresIniciais: RegistroPontoFormData = {
  funcionarioId: 0,
  data: "",
  entrada1: null,
  saida1: null,
  entrada2: null,
  saida2: null,
  observacao: "",
};

export function RegistroForm({
  initialData,
  funcionarios = funcionariosMock,
  onCancel,
  onSubmit,
}: RegistroFormProps) {
  const [formData, setFormData] =
    useState<RegistroPontoFormData>(() => ({
      funcionarioId:
        initialData?.funcionarioId ??
        valoresIniciais.funcionarioId,
      data: initialData?.data ?? getHojeISO(),
      entrada1:
        initialData?.entrada1 ?? valoresIniciais.entrada1,
      saida1:
        initialData?.saida1 ?? valoresIniciais.saida1,
      entrada2:
        initialData?.entrada2 ?? valoresIniciais.entrada2,
      saida2:
        initialData?.saida2 ?? valoresIniciais.saida2,
      observacao:
        initialData?.observacao ??
        valoresIniciais.observacao,
    }));

  const [salvando, setSalvando] = useState(false);

  function atualizarCampo<
    K extends keyof RegistroPontoFormData,
  >(
    campo: K,
    valor: RegistroPontoFormData[K],
  ) {
    setFormData((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!formData.funcionarioId || !formData.data) {
      return;
    }

    const partesData = formData.data.split("-");
    if (partesData.length === 3) {
      const ano = Number(partesData[0]);

      if (isNaN(ano) || ano < 2000 || ano > 2100) {
        toast.warning("Data inválida", {
          description:
            "Informe uma data com ano válido (entre 2000 e 2100).",
        });

        return;
      }
    }

    try {
      setSalvando(true);
      await onSubmit(formData);
    } finally {
      setSalvando(false);
    }
  }


  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Identificação
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Selecione o funcionário e a data de referência.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Funcionário" required>
            <select
              value={formData.funcionarioId}
              onChange={(event) =>
                atualizarCampo(
                  "funcionarioId",
                  Number(event.target.value),
                )
              }
              className={inputClass}
              required
            >
              <option value={0}>
                Selecione um funcionário
              </option>

              {funcionarios
                .filter(
                  (funcionario) =>
                    funcionario.status === "ativo",
                )
                .map((funcionario) => (
                  <option
                    key={funcionario.id}
                    value={funcionario.id}
                  >
                    {funcionario.nome}
                  </option>
                ))}
            </select>
          </Field>

          <Field label="Data" required>
            <input
              type="date"
              value={formData.data}
              onChange={(event) =>
                atualizarCampo("data", event.target.value)
              }
              className={inputClass}
              required
            />
          </Field>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Marcações do dia
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Informe as entradas e saídas registradas.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Entrada 1">
            <input
              type="time"
              value={formData.entrada1 ?? ""}
              onChange={(event) =>
                atualizarCampo(
                  "entrada1",
                  event.target.value || null,
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Saída 1">
            <input
              type="time"
              value={formData.saida1 ?? ""}
              onChange={(event) =>
                atualizarCampo(
                  "saida1",
                  event.target.value || null,
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Entrada 2">
            <input
              type="time"
              value={formData.entrada2 ?? ""}
              onChange={(event) =>
                atualizarCampo(
                  "entrada2",
                  event.target.value || null,
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Saída 2">
            <input
              type="time"
              value={formData.saida2 ?? ""}
              onChange={(event) =>
                atualizarCampo(
                  "saida2",
                  event.target.value || null,
                )
              }
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-5">
        <Field label="Observação">
          <textarea
            rows={3}
            value={formData.observacao ?? ""}
            onChange={(event) =>
              atualizarCampo(
                "observacao",
                event.target.value,
              )
            }
            className={`${inputClass} h-auto resize-none py-3`}
            placeholder="Ex.: registro lançado manualmente pelo RH"
          />
        </Field>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <ActionButton
          type="button"
          variant="secondary"
          onClick={onCancel}
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
            : initialData
              ? "Salvar alterações"
              : "Salvar registro"}
        </ActionButton>
      </div>
    </form>
  );
}

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20";

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

function Field({
  label,
  required,
  children,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      {children}
    </label>
  );
}
