import { ActionButton } from "@/components/common/ActionButton";
import type { Funcionario } from "@/types/funcionario";
import type { RegistroPontoFormData } from "@/types/ponto";

interface RegistroFormProps {
  funcionarios: Funcionario[];
  onCancel: () => void;
  onSubmit: (data: RegistroPontoFormData) => void;
}

export function RegistroForm({ funcionarios, onCancel, onSubmit }: RegistroFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const funcionarioIdRaw = formData.get("funcionarioId");
    if (!funcionarioIdRaw) return;

    const data: RegistroPontoFormData = {
      funcionarioId: Number(funcionarioIdRaw),
      data: formData.get("data") as string,
      entrada1: (formData.get("entrada1") as string) || null,
      saida1: (formData.get("saida1") as string) || null,
      entrada2: (formData.get("entrada2") as string) || null,
      saida2: (formData.get("saida2") as string) || null,
      observacao: (formData.get("observacao") as string) || undefined,
    };

    onSubmit(data);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Funcionário">
          <select
            name="funcionarioId"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Selecione um funcionário
            </option>
            {funcionarios.map((func) => (
              <option key={func.id} value={func.id}>
                {func.nome} (ID #{func.id})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Data">
          <input
            type="date"
            name="data"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Entrada 1 (Início Manhã)">
          <input
            type="time"
            name="entrada1"
            className={inputClass}
          />
        </Field>

        <Field label="Saída 1 (Almoço)">
          <input
            type="time"
            name="saida1"
            className={inputClass}
          />
        </Field>

        <Field label="Entrada 2 (Retorno Almoço)">
          <input
            type="time"
            name="entrada2"
            className={inputClass}
          />
        </Field>

        <Field label="Saída 2 (Fim Expediente)">
          <input
            type="time"
            name="saida2"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Observação">
        <textarea
          name="observacao"
          rows={3}
          className={`${inputClass} h-auto resize-none py-3`}
          placeholder="Ex: registro lançado manualmente pelo RH"
        />
      </Field>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <ActionButton type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </ActionButton>

        <ActionButton type="submit">Salvar registro</ActionButton>
      </div>
    </form>
  );
}

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}