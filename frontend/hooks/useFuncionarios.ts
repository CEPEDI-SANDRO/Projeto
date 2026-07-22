"use client";

import { useState } from "react";
import type { Funcionario, FuncionarioFormData } from "@/types/funcionario";
import {
  listarFuncionarios,
  buscarFuncionarioPorId,
  criarFuncionario,
  atualizarFuncionario,
  removerFuncionario,
} from "@/services/funcionarios.service";

export function useFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function carregarFuncionarios() {
    setLoading(true);
    setError(null);
    try {
      const dados = await listarFuncionarios();
      setFuncionarios(dados);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao buscar funcionários.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function adicionarFuncionario(data: FuncionarioFormData) {
    setLoading(true);
    try {
      const novo = await criarFuncionario(data);
      setFuncionarios((prev) => [...prev, novo]);
      return novo;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function editarFuncionario(
    id: number,
    data: Partial<FuncionarioFormData>
  ) {
    setLoading(true);
    try {
      const atualizado = await atualizarFuncionario(id, data);
      if (atualizado) {
        setFuncionarios((prev) =>
          prev.map((funcionario) =>
            funcionario.id === id ? atualizado : funcionario
          )
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

  async function excluirFuncionario(id: number) {
    setLoading(true);
    try {
      const removido = await removerFuncionario(id);
      if (removido) {
        setFuncionarios((prev) =>
          prev.filter((funcionario) => funcionario.id !== id)
        );
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