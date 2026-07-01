import type {
  RegistroPonto,
  RegistroPontoFormData,
} from "@/types/ponto";

import { pontosMock } from "@/mocks/pontos.mock";

export async function listarPontos(): Promise<RegistroPonto[]> {
  return pontosMock;
}

export async function buscarPontoPorId(
  id: number
): Promise<RegistroPonto | undefined> {
  return pontosMock.find((ponto) => ponto.id === id);
}

export async function listarPontosPorFuncionario(
  funcionarioId: number
): Promise<RegistroPonto[]> {
  return pontosMock.filter((ponto) => ponto.funcionarioId === funcionarioId);
}

export async function listarPontosPorMes(
  mes: number,
  ano: number
): Promise<RegistroPonto[]> {
  return pontosMock.filter((ponto) => {
    const data = new Date(ponto.data);
    return data.getMonth() + 1 === mes && data.getFullYear() === ano;
  });
}

export async function criarPonto(
  data: RegistroPontoFormData
): Promise<RegistroPonto> {
  const novoPonto: RegistroPonto = {
    id: pontosMock.length + 1,
    ...data,
    horasTrabalhadasMin: 0,
    horasExtrasMin: 0,
    status: "pendente",
    criadoEm: new Date().toISOString(),
  };

  pontosMock.push(novoPonto);

  return novoPonto;
}

export async function atualizarPonto(
  id: number,
  data: Partial<RegistroPontoFormData>
): Promise<RegistroPonto | undefined> {
  const index = pontosMock.findIndex((ponto) => ponto.id === id);

  if (index === -1) return undefined;

  pontosMock[index] = {
    ...pontosMock[index],
    ...data,
    atualizadoEm: new Date().toISOString(),
  };

  return pontosMock[index];
}

export async function removerPonto(id: number): Promise<boolean> {
  const index = pontosMock.findIndex((ponto) => ponto.id === id);

  if (index === -1) return false;

  pontosMock.splice(index, 1);

  return true;
}