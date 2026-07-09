import { ActionButton } from "@/components/common/ActionButton";

interface FuncionarioFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export function FuncionarioForm({ onCancel, onSubmit }: FuncionarioFormProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Nome</label>
          <input className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Cargo</label>
          <input className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Matrícula</label>
          <input className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400">
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Carga diária</label>
          <input type="number" className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Carga mensal</label>
          <input type="number" className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <ActionButton type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </ActionButton>

        <ActionButton type="submit">
          Salvar funcionário
        </ActionButton>
      </div>
    </form>
  );
}