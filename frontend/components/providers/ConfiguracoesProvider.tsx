"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  atualizarConfiguracoes,
  buscarConfiguracoes,
} from "@/services/configuracoes.service";

import type { Configuracao, ConfiguracaoFormData } from "@/types/configuracao";

interface ConfiguracoesContextValue {
  configuracao: Configuracao | null;
  loading: boolean;
  salvando: boolean;
  error: string | null;
  carregarConfiguracoes: () => Promise<Configuracao>;
  salvarConfiguracoes: (data: ConfiguracaoFormData) => Promise<Configuracao>;
}

const ConfiguracoesContext = createContext<ConfiguracoesContextValue | null>(
  null,
);

interface ConfiguracoesProviderProps {
  children: ReactNode;
}

export function ConfiguracoesProvider({
  children,
}: ConfiguracoesProviderProps) {
  const [configuracao, setConfiguracao] = useState<Configuracao | null>(null);

  const [loading, setLoading] = useState(true);

  const [salvando, setSalvando] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const carregarConfiguracoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dados = await buscarConfiguracoes();

      setConfiguracao(dados);

      return dados;
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as configurações.";

      setError(mensagem);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const salvarConfiguracoes = useCallback(
    async (data: ConfiguracaoFormData) => {
      try {
        setSalvando(true);
        setError(null);

        const atualizada = await atualizarConfiguracoes(data);

        setConfiguracao(atualizada);

        return atualizada;
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível salvar as configurações.";

        setError(mensagem);
        throw error;
      } finally {
        setSalvando(false);
      }
    },
    [],
  );

  useEffect(() => {
    let ativo = true;

    buscarConfiguracoes()
      .then((dados) => {
        if (!ativo) {
          return;
        }

        setConfiguracao(dados);
      })
      .catch((error) => {
        if (!ativo) {
          return;
        }

        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as configurações.";

        setError(mensagem);
      })
      .finally(() => {
        if (ativo) {
          setLoading(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      configuracao,
      loading,
      salvando,
      error,
      carregarConfiguracoes,
      salvarConfiguracoes,
    }),
    [
      configuracao,
      loading,
      salvando,
      error,
      carregarConfiguracoes,
      salvarConfiguracoes,
    ],
  );

  return (
    <ConfiguracoesContext.Provider value={value}>
      {children}
    </ConfiguracoesContext.Provider>
  );
}

export function useConfiguracoesContext() {
  const contexto = useContext(ConfiguracoesContext);

  if (!contexto) {
    throw new Error(
      "useConfiguracoesContext deve ser usado dentro de ConfiguracoesProvider.",
    );
  }

  return contexto;
}
