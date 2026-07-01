import type {
  RelatorioGeral,
  RelatorioIndividual,
} from "@/types/relatorio";

import { funcionariosMock } from "./funcionarios.mock";
import { pontosMock } from "./pontos.mock";

export const relatorioIndividualMock: RelatorioIndividual = {
  funcionario: funcionariosMock[0],
  mes: 7,
  ano: 2026,
  totalHorasTrabalhadasMin: 720,
  totalHorasExtrasMin: 0,
  totalFaltas: 0,
  totalParciais: 0,
  totalPendentes: 1,
  registros: pontosMock.filter((ponto) => ponto.funcionarioId === 1),
};

export const relatorioGeralMock: RelatorioGeral = {
  mes: 7,
  ano: 2026,
  totalFuncionarios: funcionariosMock.length,
  totalHorasTrabalhadasMin: pontosMock.reduce(
    (total, ponto) => total + ponto.horasTrabalhadasMin,
    0
  ),
  totalHorasExtrasMin: pontosMock.reduce(
    (total, ponto) => total + ponto.horasExtrasMin,
    0
  ),
  totalFaltas: pontosMock.filter((ponto) => ponto.status === "falta").length,
  resumos: funcionariosMock.map((funcionario) => {
    const registros = pontosMock.filter(
      (ponto) => ponto.funcionarioId === funcionario.id
    );

    return {
      funcionario,
      totalHorasTrabalhadasMin: registros.reduce(
        (total, ponto) => total + ponto.horasTrabalhadasMin,
        0
      ),
      totalHorasExtrasMin: registros.reduce(
        (total, ponto) => total + ponto.horasExtrasMin,
        0
      ),
      totalFaltas: registros.filter((ponto) => ponto.status === "falta").length,
      totalParciais: registros.filter(
        (ponto) =>
          ponto.status === "parcial_manha" || ponto.status === "parcial_tarde"
      ).length,
      totalPendentes: registros.filter((ponto) => ponto.status === "pendente")
        .length,
    };
  }),
};