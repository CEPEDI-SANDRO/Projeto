"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface StatusPieChartProps {
  completos: number;
  parciais: number;
  faltas: number;
  pendentes: number;
}

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  payload?: {
    label: string;
    value: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const STATUS_COLORS = {
  completos: "#10B981",
  parciais: "#F59E0B",
  faltas: "#EF4444",
  pendentes: "#3B82F6",
};

export function StatusPieChart({
  completos,
  parciais,
  faltas,
  pendentes,
}: StatusPieChartProps) {
  const data = [
    {
      label: "Completos",
      value: completos,
      color: STATUS_COLORS.completos,
    },
    {
      label: "Parciais",
      value: parciais,
      color: STATUS_COLORS.parciais,
    },
    {
      label: "Faltas",
      value: faltas,
      color: STATUS_COLORS.faltas,
    },
    {
      label: "Pendentes",
      value: pendentes,
      color: STATUS_COLORS.pendentes,
    },
  ].filter((item) => item.value > 0);

  const total = data.reduce(
    (acumulado, item) => acumulado + item.value,
    0,
  );

  if (total === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-200">
        <p className="text-sm text-slate-500">
          Não há dados de status para o período selecionado.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="45%"
            innerRadius={68}
            outerRadius={104}
            paddingAngle={3}
            cornerRadius={6}
            stroke="transparent"
          >
            {data.map((item) => (
              <Cell
                key={item.label}
                fill={item.color}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value: string) => (
              <span className="text-xs font-medium text-slate-600">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-3xl font-bold text-slate-950">
          {total}
        </p>

        <p className="mt-1 text-xs font-medium text-slate-500">
          ocorrências
        </p>
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="text-xs font-medium text-slate-500">
        {item.label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-950">
        {item.value}
      </p>
    </div>
  );
}