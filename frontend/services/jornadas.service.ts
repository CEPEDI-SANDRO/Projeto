import type { Jornada, JornadaFormData } from "@/types/jornada";
import { jornadasMock } from "@/mocks/jornadas.mock";

export async function listarJornadas(): Promise<Jornada[]> {
  return jornadasMock;
}

export async function buscarJornadaPorId(
  id: number
): Promise<Jornada | undefined> {
  return jornadasMock.find((jornada) => jornada.id === id);
}

export async function buscarJornadaPorFuncionarioId(
  funcionarioId: number
): Promise<Jornada | undefined> {
  return jornadasMock.find((jornada) => jornada.funcionarioId === funcionarioId);
}

export async function criarJornada(data: JornadaFormData): Promise<Jornada> {
  const novaJornada: Jornada = {
    id: jornadasMock.length + 1,
    ...data,
    criadoEm: new Date().toISOString(),
  };

  jornadasMock.push(novaJornada);

  return novaJornada;
}

export async function atualizarJornada(
  id: number,
  data: Partial<JornadaFormData>
): Promise<Jornada | undefined> {
  const index = jornadasMock.findIndex((jornada) => jornada.id === id);

  if (index === -1) return undefined;

  jornadasMock[index] = {
    ...jornadasMock[index],
    ...data,
    atualizadoEm: new Date().toISOString(),
  };

  return jornadasMock[index];
}

export async function removerJornada(id: number): Promise<boolean> {
  const index = jornadasMock.findIndex((jornada) => jornada.id === id);

  if (index === -1) return false;

  jornadasMock.splice(index, 1);

  return true;
}