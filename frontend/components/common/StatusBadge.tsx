import type { StatusPresenca } from "@/types/ponto";
import type { StatusVinculo } from "@/types/funcionario";
import { cn } from "@/lib/utils";

type BadgeStatus = StatusPresenca | StatusVinculo | "sem_registro";

interface StatusBadgeProps {
  status: BadgeStatus;
}

const statusConfig: Record<
  BadgeStatus,
  {
    label: string;
    className: string;
  }
> = {
  ativo: {
    label: "Ativo",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  inativo: {
    label: "Inativo",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  completo: {
    label: "Completo",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  falta: {
    label: "Falta",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  parcial_manha: {
    label: "Parcial manhã",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  parcial_tarde: {
    label: "Parcial tarde",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  pendente: {
    label: "Pendente",
    className: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  },
  sem_registro: {
    label: "Sem registro",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}