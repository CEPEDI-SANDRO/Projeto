"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatarMinutosParaHoras } from "@/lib/formatters";

interface WeeklyHoursChartProps {
  data: {
    dia: string;
    horasTrabalhadasMin: number;
  }[];
}

interface TooltipPayload {
  value?: number;
  payload?: {
    dia: string;
    horasTrabalhadasMin: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export function WeeklyHoursChart({
  data,
}: WeeklyHoursChartProps) {
  const dadosFormatados = data.map((item) => ({
    ...item,
    horas: Number(
      (item.horasTrabalhadasMin / 60).toFixed(2),
    ),
  }));

  return (
    <div className="h-[280px] w-full sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dadosFormatados}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="4 4"
            stroke="#E2E8F0"
          />

          <XAxis
            dataKey="dia"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#64748B",
              fontSize: 12,
            }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
            }}
            tickFormatter={(valor: number) =>
              `${valor}h`
            }
          />

          <Tooltip
            cursor={{
              fill: "rgba(245, 208, 0, 0.08)",
              radius: 12,
            }}
            content={<CustomTooltip />}
          />

          <Bar
            dataKey="horas"
            fill="#F5D000"
            radius={[10, 10, 3, 3]}
            maxBarSize={48}
            activeBar={{
              fill: "#E4C100",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const minutos =
    payload[0]?.payload?.horasTrabalhadasMin ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-950">
        {formatarMinutosParaHoras(minutos)}
      </p>
    </div>
  );
}