import type {
  RelatorioGeral,
  RelatorioIndividual,
} from "@/types/relatorio";

import { funcionariosMock } from "@/mocks/funcionarios.mock";
import { pontosMock } from "@/mocks/pontos.mock";
import { relatorioGeralMock } from "@/mocks/relatorios.mock";

export async function gerarRelatorioIndividual(
  funcionarioId: number,
  mes: number,
  ano: number,
): Promise<RelatorioIndividual> {
  const funcionario = funcionariosMock.find(
    (item) => item.id === funcionarioId,
  );

  if (!funcionario) {
    throw new Error("Funcionário não encontrado.");
  }

  const registros = pontosMock.filter((registro) => {
    if (registro.funcionarioId !== funcionarioId) {
      return false;
    }

    const [registroAno, registroMes] = registro.data
      .split("-")
      .map(Number);

    return registroMes === mes && registroAno === ano;
  });

  return {
    funcionario,
    mes,
    ano,
    totalHorasTrabalhadasMin: registros.reduce(
      (total, registro) =>
        total + registro.horasTrabalhadasMin,
      0,
    ),
    totalHorasExtrasMin: registros.reduce(
      (total, registro) =>
        total + registro.horasExtrasMin,
      0,
    ),
    totalFaltas: registros.filter(
      (registro) => registro.status === "falta",
    ).length,
    totalParciais: registros.filter(
      (registro) =>
        registro.status === "parcial_manha" ||
        registro.status === "parcial_tarde",
    ).length,
    totalPendentes: registros.filter(
      (registro) => registro.status === "pendente",
    ).length,
    registros,
  };
}

export async function gerarRelatorioGeral(
  mes: number,
  ano: number,
): Promise<RelatorioGeral> {
  return {
    ...relatorioGeralMock,
    mes,
    ano,
  };
}