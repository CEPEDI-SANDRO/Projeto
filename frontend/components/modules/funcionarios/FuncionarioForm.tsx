import { ActionButton } from "@/components/common/ActionButton";
import type { FuncionarioFormData } from "@/types/funcionario";

interface FuncionarioFormProps {
  onCancel: () => void;
  onSubmit: (data: FuncionarioFormData) => void;
}

export function FuncionarioForm({ onCancel, onSubmit }: FuncionarioFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const data: FuncionarioFormData = {
      nome: formData.get("nome") as string,
      documento: formData.get("documento") as string,
      cargo: formData.get("cargo") as string,
      matricula: formData.get("matricula") as string,
      status: formData.get("status") as "ativo" | "inativo",
      cargaDiariaHoras: Number(formData.get("cargaDiariaHoras") || 8),
      cargaMensalHoras: Number(formData.get("cargaMensalHoras") || 220),
    };

    onSubmit(data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Nome completo</label>
          <input
            name="nome"
            required
            placeholder="Ex: Ana Paula Souza"
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Documento (CPF / CTPS)</label>
          <input
            name="documento"
            required
            placeholder="Ex: 123.456.789-00"
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Cargo</label>
          <input
            name="cargo"
            required
            placeholder="Ex: Operadora de Caixa"
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Matrícula</label>
          <input
            name="matricula"
            required
            placeholder="Ex: MAT-001"
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select
            name="status"
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400 bg-white"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Carga diária (horas)</label>
          <input
            type="number"
            name="cargaDiariaHoras"
            required
            defaultValue={8}
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Carga mensal (horas)</label>
          <input
            type="number"
            name="cargaMensalHoras"
            required
            defaultValue={220}
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-yellow-400"
          />
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