import type {
  Funcionario,
  FuncionarioFormData,
} from "@/types/funcionario";
import { API_URL } from "./api";

const BASE_URL = `${API_URL}/funcionario`;

export async function listarFuncionarios(): Promise<Funcionario[]> {
  try {
    const res = await fetch(`${BASE_URL}/listar`);
    if (!res.ok) {
      throw new Error("Erro ao obter lista de funcionários do servidor.");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro no service listarFuncionarios:", error);
    throw error;
  }
}

export async function buscarFuncionarioPorId(
  id: number,
): Promise<Funcionario | undefined> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return undefined;
  }

  if (!res.ok) {
    throw new Error(
      `Erro ao buscar funcionário ID ${id}. Status: ${res.status}`,
    );
  }

  return res.json();
}

export async function criarFuncionario(
  data: FuncionarioFormData
): Promise<Funcionario> {
  try {
    const res = await fetch(`${BASE_URL}/cadastrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Erro ao cadastrar funcionário no servidor.");
    }

    return await res.json();
  } catch (error) {
    console.error("Erro no service criarFuncionario:", error);
    throw error;
  }
}

export async function atualizarFuncionario(
  id: number,
  data: Partial<FuncionarioFormData>
): Promise<Funcionario | undefined> {
  try {
    const res = await fetch(`${BASE_URL}/atualizar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Erro ao atualizar funcionário no servidor.");
    }

    return await res.json();
  } catch (error) {
    console.error("Erro no service atualizarFuncionario:", error);
    return undefined;
  }
}

export async function removerFuncionario(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/deletar/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("Erro no service removerFuncionario:", error);
    return false;
  }
}