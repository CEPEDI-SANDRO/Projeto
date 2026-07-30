import type { DashboardData } from "@/types/dashboard";
import { API_URL } from "./api";

const BASE_URL = `${API_URL}/dashboard`;

export async function buscarDadosDashboard(): Promise<DashboardData> {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error("Erro ao obter dados do dashboard do servidor.");
    }
    return await res.json();
  } catch (error) {
    console.error("Erro em buscarDadosDashboard:", error);
    throw error;
  }
}