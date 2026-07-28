"use client";

import { useState } from "react";

import type {
  Jornada,
  JornadaFormData,
} from "@/types/jornada";
import { jornadasMock } from "@/mocks/jornadas.mock";

import {
  buscarJornadaPorId,
  buscarJornadaPorFuncionarioId,
  criarJornada,
  atualizarJornada,
  removerJornada,
} from "@/services/jornadas.service";

export function useJornadas() {
  const [jornadas, setJornadas] =
    useState<Jornada[]>(jornadasMock);

  const [loading] = useState(false);

  function carregarJornadas() {
    setJornadas(jornadasMock);
  }

  async function adicionarJornada(
    data: JornadaFormData,
  ) {
    const nova = await criarJornada(data);

    setJornadas((estadoAtual) => [
      ...estadoAtual,
      nova,
    ]);

    return nova;
  }

  async function editarJornada(
    id: number,
    data: Partial<JornadaFormData>,
  ) {
    const atualizada = await atualizarJornada(
      id,
      data,
    );

    if (!atualizada) {
      return null;
    }

    setJornadas((estadoAtual) =>
      estadoAtual.map((jornada) =>
        jornada.id === id
          ? atualizada
          : jornada,
      ),
    );

    return atualizada;
  }

  async function excluirJornada(id: number) {
    const removida = await removerJornada(id);

    if (!removida) {
      return false;
    }

    setJornadas((estadoAtual) =>
      estadoAtual.filter(
        (jornada) => jornada.id !== id,
      ),
    );

    return true;
  }

  return {
    jornadas,
    loading,
    carregarJornadas,
    buscarJornadaPorId,
    buscarJornadaPorFuncionarioId,
    adicionarJornada,
    editarJornada,
    excluirJornada,
  };
}