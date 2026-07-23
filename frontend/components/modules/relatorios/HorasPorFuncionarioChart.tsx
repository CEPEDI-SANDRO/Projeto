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

import type { ResumoFuncionarioGeral } from "@/types/relatorio";

interface Props {
  data: ResumoFuncionarioGeral[];
}

export function HorasPorFuncionarioChart({
  data,
}: Props) {
  const chartData = data.map((item) => ({
    nome: item.funcionario.nome.split(" ")[0],
    horas:
      item.totalHorasTrabalhadasMin / 60,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis dataKey="nome" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="horas"
            fill="#FACC15"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}