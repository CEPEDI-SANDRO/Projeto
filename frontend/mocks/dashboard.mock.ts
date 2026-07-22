import type { DashboardData } from "@/types/dashboard";

import { funcionariosMock } from "./funcionarios.mock";
import { pontosMock } from "./pontos.mock";

export const dashboardMock: DashboardData = {
  resumo: {
    totalFuncionarios: funcionariosMock.length,
    presentesHoje: 3,
    ausentesHoje: 1,
    atrasosHoje: 1,
    horasTrabalhadasHojeMin: 1670,
    horasExtrasHojeMin: 5,
    pendenciasHoje: 1,
  },

  statusHoje: funcionariosMock.map((funcionario) => ({
    funcionario,
    registro:
      pontosMock.find(
        (ponto) =>
          ponto.funcionarioId === funcionario.id && ponto.data === "2026-07-01"
      ) ?? null,
  })),

  graficoPresenca: [
    { dia: "Seg", presentes: 4, ausentes: 1 },
    { dia: "Ter", presentes: 3, ausentes: 2 },
    { dia: "Qua", presentes: 5, ausentes: 0 },
    { dia: "Qui", presentes: 4, ausentes: 1 },
    { dia: "Sex", presentes: 4, ausentes: 1 },
    { dia: "Sáb", presentes: 2, ausentes: 3 },
  ],

  graficoHoras: [
    { dia: "Seg", horasTrabalhadasMin: 1920 },
    { dia: "Ter", horasTrabalhadasMin: 1670 },
    { dia: "Qua", horasTrabalhadasMin: 2400 },
    { dia: "Qui", horasTrabalhadasMin: 1880 },
    { dia: "Sex", horasTrabalhadasMin: 1900 },
    { dia: "Sáb", horasTrabalhadasMin: 960 },
  ],

  pendenciasRecentes: pontosMock.filter(
    (ponto) => ponto.status === "pendente" || ponto.status === "parcial_manha"
  ),
};