"use client";

import { useState, useCallback } from "react";
import type { RegistroPonto, RegistroPontoFormData } from "@/types/ponto";
import {
  listarPontos,
  buscarPontoPorId,
  listarPontosPorFuncionario,
  listarPontosPorMes,
  criarPonto,
  atualizarPonto,
  removerPonto,
} from "@/services/pontos.service";

export function usePontos() {
  const [pontos, setPontos] = useState<RegistroPonto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarPontos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dados = await listarPontos();

      setPontos(dados);
    } catch (error) {
      console.error("Erro ao carregar registros de ponto:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os registros.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  async function adicionarPonto(data: RegistroPontoFormData) {
    setLoading(true);
    try {
      const novo = await criarPonto(data);
      setPontos((prev) => [novo, ...prev]);
      return novo;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function editarPonto(id: number, data: Partial<RegistroPontoFormData>) {
    setLoading(true);
    try {
      const atualizado = await atualizarPonto(id, data);
      if (atualizado) {
        setPontos((prev) =>
          prev.map((ponto) => (ponto.id === id ? atualizado : ponto)),
        );
      }
      return atualizado;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function excluirPonto(id: number) {
    setLoading(true);
    try {
      const removido = await removerPonto(id);
      if (removido) {
        setPontos((prev) => prev.filter((ponto) => ponto.id !== id));
      }
      return removido;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    pontos,
    loading,
    error,
    carregarPontos,
    buscarPontoPorId,
    listarPontosPorFuncionario,
    listarPontosPorMes,
    adicionarPonto,
    editarPonto,
    excluirPonto,
  };
}
