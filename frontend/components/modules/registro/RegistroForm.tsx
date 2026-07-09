import { ActionButton } from "@/components/common/ActionButton";

interface RegistroFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export function RegistroForm({ onCancel, onSubmit }: RegistroFormProps) {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Funcionário">
          <select className={inputClass}>
            <option>Selecione um funcionário</option>
            <option>Ana Paula Souza</option>
            <option>Carlos Henrique Lima</option>
            <option>Mariana Alves</option>
          </select>
        </Field>

        <Field label="Data">
          <input type="date" className={inputClass} />
        </Field>

        <Field label="Entrada 1">
          <input type="time" className={inputClass} />
        </Field>

        <Field label="Saída 1">
          <input type="time" className={inputClass} />
        </Field>

        <Field label="Entrada 2">
          <input type="time" className={inputClass} />
        </Field>

        <Field label="Saída 2">
          <input type="time" className={inputClass} />
        </Field>
      </div>

      <Field label="Observação">
        <textarea
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