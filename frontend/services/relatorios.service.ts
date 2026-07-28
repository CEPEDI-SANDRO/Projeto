import type {
  RelatorioGeral,
  RelatorioIndividual,
} from "@/types/relatorio";

import { API_URL } from "./api";

const BASE_URL = `${API_URL}/relatorio`;

async function lerErro(
  response: Response,
  mensagemPadrao: string,
) {
  const dados = await response
    .json()
    .catch(() => null);

  if (
    dados &&
    typeof dados === "object" &&
    "error" in dados &&
    typeof dados.error === "string"
  ) {
    return dados.error;
  }

  return mensagemPadrao;
}

export async function gerarRelatorioGeral(
  mes: number,
  ano: number,
): Promise<RelatorioGeral> {
  const params = new URLSearchParams({
    mes: String(mes),
    ano: String(ano),
  });

  const response = await fetch(
    `${BASE_URL}/geral?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const mensagem = await lerErro(
      response,
      "Não foi possível gerar o relatório geral.",
    );

    throw new Error(mensagem);
  }

  return response.json();
}

export async function gerarRelatorioIndividual(
  funcionarioId: number,
  mes: number,
  ano: number,
): Promise<RelatorioIndividual> {
  const params = new URLSearchParams({
    mes: String(mes),
    ano: String(ano),
  });

  const response = await fetch(
    `${BASE_URL}/individual/${funcionarioId}?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const mensagem = await lerErro(
      response,
      "Não foi possível gerar o relatório individual.",
    );

    throw new Error(mensagem);
  }

  return response.json();
}