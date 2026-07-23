import {
  CalendarDays,
  Clock3,
  FileText,
  Timer,
  UserRound,
} from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { funcionariosMock } from "@/mocks/funcionarios.mock";
import {
  formatarData,
  formatarHora,
  formatarMinutosParaHoras,
} from "@/lib/formatters";

import type { RegistroPonto } from "@/types/ponto";

interface RegistroDetalhesProps {
  registro: RegistroPonto;
}

export function RegistroDetalhes({
  registro,
}: RegistroDetalhesProps) {
  const funcionario = funcionariosMock.find(
    (item) => item.id === registro.funcionarioId
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-black">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-950">
                {funcionario?.nome ?? "Funcionário não encontrado"}
              </h3>

              <p className="text-sm text-slate-500">
                Registro #{registro.id}
              </p>
            </div>
          </div>

          <StatusBadge status={registro.status} />
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-950">
          Informações do registro
        </h3>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
          <DetailRow
            icon={CalendarDays}
            label="Data"
            value={formatarData(registro.data)}
          />

          <DetailRow
            icon={Clock3}
            label="Entrada 1"
            value={formatarHora(registro.entrada1)}
          />

          <DetailRow
            icon={Clock3}
            label="Saída 1"
            value={formatarHora(registro.saida1)}
          />

          <DetailRow
            icon={Clock3}
            label="Entrada 2"
            value={formatarHora(registro.entrada2)}
          />

          <DetailRow
            icon={Clock3}
            label="Saída 2"
            value={formatarHora(registro.saida2)}
          />

          <DetailRow
            icon={Timer}
            label="Horas trabalhadas"
            value={formatarMinutosParaHoras(
              registro.horasTrabalhadasMin
            )}
          />

          <DetailRow
            icon={Timer}
            label="Horas extras"
            value={formatarMinutosParaHoras(
              registro.horasExtrasMin
            )}
          />
        </div>
      </section>

      {registro.observacao && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-950">
            Observação
          </h3>

          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

            <p className="text-sm leading-6 text-slate-600">
              {registro.observacao}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-yellow-700">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}