"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { ActionButton } from "@/components/common/ActionButton";

import type {
  Funcionario,
  FuncionarioFormData,
  StatusVinculo,
} from "@/types/funcionario";

interface FuncionarioFormProps {
  initialData?: Funcionario | null;
  onCancel: () => void;
  onSubmit: (
    data: FuncionarioFormData
  ) => void | Promise<void>;
}

const valoresIniciais: FuncionarioFormData = {
  nome: "",
  documento: "",
  cargo: "",
  matricula: "",
  cargaDiariaHoras: 8,
  cargaMensalHoras: 220,
  status: "ativo",
  jornadaId: undefined,
};

export function FuncionarioForm({
  initialData,
  onCancel,
  onSubmit,
}: FuncionarioFormProps) {
  const [formData, setFormData] =
    useState<FuncionarioFormData>(() => ({
      nome: initialData?.nome ?? valoresIniciais.nome,
      documento: initialData?.documento ?? valoresIniciais.documento,
      cargo: initialData?.cargo ?? valoresIniciais.cargo,
      matricula:
        initialData?.matricula ?? valoresIniciais.matricula,
      cargaDiariaHoras:
        initialData?.cargaDiariaHoras ??
        valoresIniciais.cargaDiariaHoras,
      cargaMensalHoras:
        initialData?.cargaMensalHoras ??
        valoresIniciais.cargaMensalHoras,
      status:
        initialData?.status ?? valoresIniciais.status,
      jornadaId: initialData?.jornadaId,
    }));

  const [salvando, setSalvando] = useState(false);

  function atualizarCampo<K extends keyof FuncionarioFormData>(
    campo: K,
    valor: FuncionarioFormData[K]
  ) {
    setFormData((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !formData.nome.trim() ||
      !formData.documento.trim() ||
      !formData.cargo.trim() ||
      !formData.matricula.trim()
    ) {
      return;
    }

    try {
      setSalvando(true);

      await onSubmit({
        ...formData,
        nome: formData.nome.trim(),
        documento: formData.documento.trim(),
        cargo: formData.cargo.trim(),
        matricula: formData.matricula.trim(),
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Dados do funcionário
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Informe os dados cadastrais e profissionais.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo" required>
            <input
              type="text"
              value={formData.nome}
              onChange={(event) =>
                atualizarCampo("nome", event.target.value)
              }
              placeholder="Ex.: Ana Paula Souza"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Documento (CPF / CTPS)" required>
            <input
              type="text"
              value={formData.documento}
              onChange={(event) =>
                atualizarCampo("documento", event.target.value)
              }
              placeholder="Ex.: 123.456.789-00"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Cargo" required>
            <input
              type="text"
              value={formData.cargo}
              onChange={(event) =>
                atualizarCampo("cargo", event.target.value)
              }
              placeholder="Ex.: Operadora de caixa"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Matrícula" required>
            <input
              type="text"
              value={formData.matricula}
              onChange={(event) =>
                atualizarCampo(
                  "matricula",
                  event.target.value
                )
              }
              placeholder="Ex.: MAT-001"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Status">
            <select
              value={formData.status}
              onChange={(event) =>
                atualizarCampo(
                  "status",
                  event.target.value as StatusVinculo
                )
              }
              className={inputClass}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Carga horária
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Defina as cargas diária e mensal do colaborador.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Carga diária (horas)">
            <input
              type="number"
              min={1}
              max={24}
              value={formData.cargaDiariaHoras}
              onChange={(event) =>
                atualizarCampo(
                  "cargaDiariaHoras",
                  Number(event.target.value)
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Carga mensal (horas)">
            <input
              type="number"
              min={1}
              value={formData.cargaMensalHoras}
              onChange={(event) =>
                atualizarCampo(
                  "cargaMensalHoras",
                  Number(event.target.value)
                )
              }
              className={inputClass}
            />
          </Field>
        </div>
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
              : "Salvar funcionário"}
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
