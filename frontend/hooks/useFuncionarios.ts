"use client";

import { useCallback, useState } from "react";

import type {
  Funcionario,
  FuncionarioFormData,
} from "@/types/funcionario";

import {
  listarFuncionarios,
  buscarFuncionarioPorId as buscarFuncionarioPorIdService,
  criarFuncionario,
  atualizarFuncionario,
  removerFuncionario,
} from "@/services/funcionarios.service";

export function useFuncionarios() {
  const [funcionarios, setFuncionarios] =
    useState<Funcionario[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const carregarFuncionarios = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const dados = await listarFuncionarios();

        setFuncionarios(dados);
      } catch (error) {
        console.error(
          "Erro ao carregar funcionários:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os funcionários.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const buscarFuncionarioPorId = useCallback(
    async (id: number) => {
      return buscarFuncionarioPorIdService(id);
    },
    [],
  );

  async function adicionarFuncionario(
    data: FuncionarioFormData,
  ) {
    const novo = await criarFuncionario(data);

    setFuncionarios((estadoAtual) => [
      ...estadoAtual,
      novo,
    ]);

    return novo;
  }

  async function editarFuncionario(
    id: number,
    data: Partial<FuncionarioFormData>,
  ) {
    const atualizado = await atualizarFuncionario(
      id,
      data,
    );

    if (!atualizado) {
      return null;
    }

    setFuncionarios((estadoAtual) =>
      estadoAtual.map((funcionario) =>
        funcionario.id === id
          ? atualizado
          : funcionario,
      ),
    );

    return atualizado;
  }

  async function excluirFuncionario(id: number) {
    const removido = await removerFuncionario(id);

    if (!removido) {
      throw new Error(
        "Não foi possível excluir o funcionário.",
      );
    }

    setFuncionarios((estadoAtual) =>
      estadoAtual.filter(
        (funcionario) => funcionario.id !== id,
      ),
    );

    return true;
  }

  return {
    funcionarios,
    loading,
    error,
    carregarFuncionarios,
    buscarFuncionarioPorId,
    adicionarFuncionario,
    editarFuncionario,
    excluirFuncionario,
  };
}