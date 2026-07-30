"use client";

import {
  useCallback,
  useState,
} from "react";

import { listarNotificacoes } from "@/services/notificacoes.service";

import type { Notificacao } from "@/types/notificacao";

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] =
    useState<Notificacao[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const carregarNotificacoes =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const dados =
          await listarNotificacoes();

        setNotificacoes(dados);

        return dados;
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as notificações.";

        setError(mensagem);
        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  return {
    notificacoes,
    loading,
    error,
    carregarNotificacoes,
  };
}