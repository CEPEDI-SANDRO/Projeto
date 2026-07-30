import { API_URL } from "@/services/api";

import type { Notificacao } from "@/types/notificacao";

const BASE_URL = `${API_URL}/notificacao`;

export async function listarNotificacoes(): Promise<
  Notificacao[]
> {
  const response = await fetch(`${BASE_URL}/listar`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const dados = await response
      .json()
      .catch(() => null);

    throw new Error(
      dados?.error ??
        "Não foi possível carregar as notificações.",
    );
  }

  return response.json();
}