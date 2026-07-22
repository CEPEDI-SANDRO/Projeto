"use client";

import { useState } from "react";
import type { DashboardData } from "@/types/dashboard";
import { buscarDadosDashboard } from "@/services/dashboard.service";

const resumoInicial = {
  totalFuncionarios: 0,
  presentesHoje: 0,
  ausentesHoje: 0,
  atrasosHoje: 0,
  horasTrabalhadasHojeMin: 0,
  horasExtrasHojeMin: 0,
  pendenciasHoje: 0,
};

const dadosIniciais: DashboardData = {
  resumo: resumoInicial,
  statusHoje: [],
  graficoPresenca: [],
  graficoHoras: [],
  pendenciasRecentes: [],
};

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData>(dadosIniciais);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function carregarDashboard() {
    setLoading(true);
    setError(null);
    try {
      const dados = await buscarDadosDashboard();
      setDashboard(dados);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar dados do dashboard.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    dashboard,
    loading,
    error,
    carregarDashboard,
  };
}