import type {
  RegistroPonto,
  RegistroPontoFormData,
} from "@/types/ponto";
import { API_URL } from "./api";

const BASE_URL = `${API_URL}/ponto`;

export async function listarPontos(): Promise<RegistroPonto[]> {
  try {
    const res = await fetch(`${BASE_URL}/listar`);
    if (!res.ok) {
      throw new Error("Erro ao obter lista de pontos do servidor.");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro em listarPontos:", error);
    throw error;
  }
}

export async function buscarPontoPorId(
  id: number
): Promise<RegistroPonto | undefined> {
  try {
    const pontos = await listarPontos();
    return pontos.find((ponto) => ponto.id === id);
  } catch (error) {
    console.error(`Erro ao buscar ponto ID ${id}:`, error);
    return undefined;
  }
}

export async function listarPontosPorFuncionario(
  funcionarioId: number
): Promise<RegistroPonto[]> {
  try {
    const pontos = await listarPontos();
    return pontos.filter((ponto) => ponto.funcionarioId === funcionarioId);
  } catch (error) {
    console.error(`Erro ao listar pontos do funcionário ID ${funcionarioId}:`, error);
    return [];
  }
}

export async function listarPontosPorMes(
  mes: number,
  ano: number
): Promise<RegistroPonto[]> {
  try {
    const pontos = await listarPontos();
    return pontos.filter((ponto) => {
      const data = new Date(ponto.data);
      // getMonth() retorna 0-11, logo somamos 1
      return data.getMonth() + 1 === mes && data.getFullYear() === ano;
    });
  } catch (error) {
    console.error(`Erro ao listar pontos por mês:`, error);
    return [];
  }
}

export async function criarPonto(
  data: RegistroPontoFormData
): Promise<RegistroPonto> {
  try {
    const res = await fetch(`${BASE_URL}/lancar-manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Erro ao registrar ponto manual no servidor.");
    }

    return await res.json();
  } catch (error) {
    console.error("Erro em criarPonto:", error);
    throw error;
  }
}

export async function atualizarPonto(
  id: number,
  data: Partial<RegistroPontoFormData>
): Promise<RegistroPonto | undefined> {
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
      throw new Error(errData.error || "Erro ao atualizar ponto no servidor.");
    }

    return await res.json();
  } catch (error) {
    console.error("Erro em atualizarPonto:", error);
    return undefined;
  }
}

export async function removerPonto(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/deletar/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("Erro em removerPonto:", error);
    return false;
  }
}