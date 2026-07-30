import { API_URL } from "@/services/api";

import type {
  Configuracao,
  ConfiguracaoFormData,
} from "@/types/configuracao";

const BASE_URL = `${API_URL}/configuracoes`;

async function obterMensagemErro(
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

export async function buscarConfiguracoes(): Promise<Configuracao> {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await obterMensagemErro(
        response,
        "Não foi possível carregar as configurações.",
      ),
    );
  }

  return response.json();
}

export async function atualizarConfiguracoes(
  data: ConfiguracaoFormData,
): Promise<Configuracao> {
  const response = await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await obterMensagemErro(
        response,
        "Não foi possível salvar as configurações.",
      ),
    );
  }

  return response.json();
}