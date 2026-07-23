import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Hash,
} from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { formatarData } from "@/lib/formatters";
import type { Funcionario } from "@/types/funcionario";

interface FuncionarioDetalhesProps {
  funcionario: Funcionario;
}

export function FuncionarioDetalhes({
  funcionario,
}: FuncionarioDetalhesProps) {
  const iniciais = funcionario.nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((nome) => nome[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-black">
          {iniciais}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-950">
            {funcionario.nome}
          </h3>

          <p className="truncate text-sm text-slate-500">
            {funcionario.cargo}
          </p>

          <div className="mt-2">
            <StatusBadge status={funcionario.status} />
          </div>
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-950">
          Dados profissionais
        </h3>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
          <DetailRow
            icon={BriefcaseBusiness}
            label="Cargo"
            value={funcionario.cargo}
          />

          <DetailRow
            icon={Hash}
            label="Matrícula"
            value={funcionario.matricula}
          />

          <DetailRow
            icon={Clock3}
            label="Carga diária"
            value={`${funcionario.cargaDiariaHoras} horas`}
          />

          <DetailRow
            icon={Clock3}
            label="Carga mensal"
            value={`${funcionario.cargaMensalHoras} horas`}
          />

          <DetailRow
            icon={BadgeCheck}
            label="Jornada vinculada"
            value={`Jornada #${funcionario.jornadaId}`}
          />

          <DetailRow
            icon={CalendarDays}
            label="Cadastrado em"
            value={formatarData(funcionario.criadoEm.split("T")[0])}
          />
        </div>
      </section>
    </div>
  );
}

interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-yellow-700">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}