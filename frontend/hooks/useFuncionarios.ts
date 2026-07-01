"use client";

import { useState } from "react";
import type { Funcionario, FuncionarioFormData } from "@/types/funcionario";
import { funcionariosMock } from "@/mocks/funcionarios.mock";

import {
  buscarFuncionarioPorId,
  criarFuncionario,
  atualizarFuncionario,
  removerFuncionario,
} from "@/services/funcionarios.service";

export function useFuncionarios() {
  const [funcionarios, setFuncionarios] =
    useState<Funcionario[]>(funcionariosMock);

  const [loading] = useState(false);

  function carregarFuncionarios() {
    setFuncionarios(funcionariosMock);
  }

  async function adicionarFuncionario(data: FuncionarioFormData) {
    const novo = await criarFuncionario(data);
    setFuncionarios((prev) => [...prev, novo]);
  }

  async function editarFuncionario(
    id: number,
    data: Partial<FuncionarioFormData>
  ) {
    const atualizado = await atualizarFuncionario(id, data);

    if (!atualizado) return;

    setFuncionarios((prev) =>
      prev.map((funcionario) =>
        funcionario.id === id ? atualizado : funcionario
      )
    );
  }

  async function excluirFuncionario(id: number) {
    const removido = await removerFuncionario(id);

    if (!removido) return;

    setFuncionarios((prev) =>
      prev.filter((funcionario) => funcionario.id !== id)
    );
  }

  return {
    funcionarios,
    loading,
    carregarFuncionarios,
    buscarFuncionarioPorId,
    adicionarFuncionario,
    editarFuncionario,
    excluirFuncionario,
  };
}