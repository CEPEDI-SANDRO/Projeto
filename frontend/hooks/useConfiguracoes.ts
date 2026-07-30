"use client";

import {
  useCallback,
  useState,
} from "react";

import {
  atualizarConfiguracoes,
  buscarConfiguracoes,
} from "@/services/configuracoes.service";

import type {
  Configuracao,
  ConfiguracaoFormData,
} from "@/types/configuracao";

export function useConfiguracoes() {
  const [
    configuracao,
    setConfiguracao,
  ] = useState<Configuracao | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const carregarConfiguracoes =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const dados =
          await buscarConfiguracoes();

        setConfiguracao(dados);

        return dados;
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Erro ao carregar as configurações.";

        setError(mensagem);
        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  const salvarConfiguracoes =
    useCallback(
      async (
        data: ConfiguracaoFormData,
      ) => {
        try {
          setLoading(true);
          setError(null);

          const atualizada =
            await atualizarConfiguracoes(
              data,
            );

          setConfiguracao(atualizada);

          return atualizada;
        } catch (error) {
          const mensagem =
            error instanceof Error
              ? error.message
              : "Erro ao salvar as configurações.";

          setError(mensagem);
          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  return {
    configuracao,
    loading,
    error,
    carregarConfiguracoes,
    salvarConfiguracoes,
  };
}