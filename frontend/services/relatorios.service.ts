import type {
  RelatorioGeral,
  RelatorioIndividual,
} from "@/types/relatorio";

import {
  relatorioGeralMock,
  relatorioIndividualMock,
} from "@/mocks/relatorios.mock";

export async function gerarRelatorioIndividual(
  funcionarioId: number,
  mes: number,
  ano: number
): Promise<RelatorioIndividual> {
  return {
    ...relatorioIndividualMock,
    mes,
    ano,
    registros: relatorioIndividualMock.registros.filter(
      (registro) => registro.funcionarioId === funcionarioId
    ),
  };
}

export async function gerarRelatorioGeral(
  mes: number,
  ano: number
): Promise<RelatorioGeral> {
  return {
    ...relatorioGeralMock,
    mes,
    ano,
  };
}