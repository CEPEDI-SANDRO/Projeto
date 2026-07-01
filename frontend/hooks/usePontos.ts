"use client";

import { useState } from "react";
import type { RegistroPonto, RegistroPontoFormData } from "@/types/ponto";
import { pontosMock } from "@/mocks/pontos.mock";

import {
  buscarPontoPorId,
  listarPontosPorFuncionario,
  listarPontosPorMes,
  criarPonto,
  atualizarPonto,
  removerPonto,
} from "@/services/pontos.service";

export function usePontos() {
  const [pontos, setPontos] = useState<RegistroPonto[]>(pontosMock);
  const [loading] = useState(false);

  function carregarPontos() {
    setPontos(pontosMock);
  }

  async function adicionarPonto(data: RegistroPontoFormData) {
    const novo = await criarPonto(data);
    setPontos((prev) => [...prev, novo]);
  }

  async function editarPonto(id: number, data: Partial<RegistroPontoFormData>) {
    const atualizado = await atualizarPonto(id, data);

    if (!atualizado) return;

    setPontos((prev) =>
      prev.map((ponto) => (ponto.id === id ? atualizado : ponto))
    );
  }

  async function excluirPonto(id: number) {
    const removido = await removerPonto(id);

    if (!removido) return;

    setPontos((prev) => prev.filter((ponto) => ponto.id !== id));
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