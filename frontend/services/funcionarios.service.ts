import type {
  Funcionario,
  FuncionarioFormData,
} from "@/types/funcionario";

import { funcionariosMock } from "@/mocks/funcionarios.mock";

export async function listarFuncionarios(): Promise<Funcionario[]> {
  return funcionariosMock;
}

export async function buscarFuncionarioPorId(
  id: number
): Promise<Funcionario | undefined> {
  return funcionariosMock.find((funcionario) => funcionario.id === id);
}

export async function criarFuncionario(
  data: FuncionarioFormData
): Promise<Funcionario> {
  const novoFuncionario: Funcionario = {
    id: funcionariosMock.length + 1,
    ...data,
    jornadaId: data.jornadaId ?? 0,
    criadoEm: new Date().toISOString(),
  };

  funcionariosMock.push(novoFuncionario);

  return novoFuncionario;
}

export async function atualizarFuncionario(
  id: number,
  data: Partial<FuncionarioFormData>
): Promise<Funcionario | undefined> {
  const index = funcionariosMock.findIndex(
    (funcionario) => funcionario.id === id
  );

  if (index === -1) return undefined;

  funcionariosMock[index] = {
    ...funcionariosMock[index],
    ...data,
    atualizadoEm: new Date().toISOString(),
  };

  return funcionariosMock[index];
}

export async function removerFuncionario(id: number): Promise<boolean> {
  const index = funcionariosMock.findIndex(
    (funcionario) => funcionario.id === id
  );

  if (index === -1) return false;

  funcionariosMock.splice(index, 1);

  return true;
}