"use client";

import { useState } from "react";

import { pontosMock } from "@/mocks/pontos.mock";

import {
  atualizarPonto,
  buscarPontoPorId,
  criarPonto,
  listarPontosPorFuncionario,
  listarPontosPorMes,
  removerPonto,
} from "@/services/pontos.service";

import type {
  RegistroPonto,
  RegistroPontoFormData,
} from "@/types/ponto";

export function usePontos() {
  const [pontos, setPontos] = useState<RegistroPonto[]>([
    ...pontosMock,
  ]);

  const [loading] = useState(false);

  function carregarPontos() {
    setPontos([...pontosMock]);
  }

  async function adicionarPonto(data: RegistroPontoFormData) {
    const novo = await criarPonto(data);

    setPontos((estadoAtual) => [
      ...estadoAtual,
      novo,
    ]);

    return novo;
  }

  async function editarPonto(
    id: number,
    data: Partial<RegistroPontoFormData>,
  ) {
    const atualizado = await atualizarPonto(id, data);

    if (!atualizado) {
      return undefined;
    }

    setPontos((estadoAtual) =>
      estadoAtual.map((ponto) =>
        ponto.id === id ? atualizado : ponto,
      ),
    );

    return atualizado;
  }

  async function excluirPonto(id: number) {
    const removido = await removerPonto(id);

    if (!removido) {
      return false;
    }

    setPontos((estadoAtual) =>
      estadoAtual.filter((ponto) => ponto.id !== id),
    );

    return true;
  }

  return {
    pontos,
    loading,
    carregarPontos,
    buscarPontoPorId,
    listarPontosPorFuncionario,
    listarPontosPorMes,
    adicionarPonto,
    editarPonto,
    excluirPonto,
  };
}
