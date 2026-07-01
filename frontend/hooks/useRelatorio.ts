"use client";

import { useState } from "react";
import type {
  RelatorioGeral,
  RelatorioIndividual,
} from "@/types/relatorio";

import {
  gerarRelatorioGeral,
  gerarRelatorioIndividual,
} from "@/services/relatorios.service";

export function useRelatorios() {
  const [relatorioIndividual, setRelatorioIndividual] =
    useState<RelatorioIndividual | null>(null);

  const [relatorioGeral, setRelatorioGeral] =
    useState<RelatorioGeral | null>(null);

  const [loading, setLoading] = useState(false);

  async function buscarRelatorioIndividual(
    funcionarioId: number,
    mes: number,
    ano: number
  ) {
    setLoading(true);
    const data = await gerarRelatorioIndividual(funcionarioId, mes, ano);
    setRelatorioIndividual(data);
    setLoading(false);
  }

  async function buscarRelatorioGeral(mes: number, ano: number) {
    setLoading(true);
    const data = await gerarRelatorioGeral(mes, ano);
    setRelatorioGeral(data);
    setLoading(false);
  }

  return {
    relatorioIndividual,
    relatorioGeral,
    loading,
    buscarRelatorioIndividual,
    buscarRelatorioGeral,
  };
}