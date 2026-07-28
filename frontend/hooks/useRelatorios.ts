"use client";

import { useCallback, useState } from "react";

import {
  gerarRelatorioGeral,
  gerarRelatorioIndividual,
} from "@/services/relatorios.service";

import type {
  RelatorioGeral,
  RelatorioIndividual,
} from "@/types/relatorio";

export function useRelatorios() {
  const [
    relatorioIndividual,
    setRelatorioIndividual,
  ] = useState<RelatorioIndividual | null>(
    null,
  );

  const [
    relatorioGeral,
    setRelatorioGeral,
  ] = useState<RelatorioGeral | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const buscarRelatorioIndividual =
    useCallback(
      async (
        funcionarioId: number,
        mes: number,
        ano: number,
      ) => {
        try {
          setLoading(true);
          setError(null);

          const data =
            await gerarRelatorioIndividual(
              funcionarioId,
              mes,
              ano,
            );

          setRelatorioIndividual(data);

          return data;
        } catch (error) {
          const mensagem =
            error instanceof Error
              ? error.message
              : "Erro ao gerar relatório individual.";

          setError(mensagem);
          setRelatorioIndividual(null);

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const buscarRelatorioGeral =
    useCallback(
      async (mes: number, ano: number) => {
        try {
          setLoading(true);
          setError(null);

          const data =
            await gerarRelatorioGeral(
              mes,
              ano,
            );

          setRelatorioGeral(data);

          return data;
        } catch (error) {
          const mensagem =
            error instanceof Error
              ? error.message
              : "Erro ao gerar relatório geral.";

          setError(mensagem);
          setRelatorioGeral(null);

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  return {
    relatorioIndividual,
    relatorioGeral,
    loading,
    error,
    buscarRelatorioIndividual,
    buscarRelatorioGeral,
  };
}