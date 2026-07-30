import { API_URL } from "./api";

export interface LoginParams {
  usuario: string;
  senha: string;
}

export interface UsuarioAutenticado {
  id: number;
  usuario: string;
  nome: string;
  cargo: string;
}

export interface LoginResponse {
  sucesso: boolean;
  mensagem: string;
  usuario: UsuarioAutenticado;
  token: string;
}

const BASE_URL = `${API_URL}/auth`;

export async function realizarLogin(params: LoginParams): Promise<LoginResponse> {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.erro || "Falha na autenticação.");
    }

    return data;
  } catch (error) {
    console.error("Erro no serviço de login:", error);
    throw error;
  }
}
