"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { UsuarioAutenticado } from "@/services/auth.service";

interface AuthContextValue {
  usuario: UsuarioAutenticado | null;
  token: string | null;
  autenticado: boolean;
  registrarSessao: (
    usuario: UsuarioAutenticado,
    token: string,
  ) => void;
  encerrarSessao: () => void;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

function lerUsuarioArmazenado(): UsuarioAutenticado | null {
  if (typeof window === "undefined") {
    return null;
  }

  const usuarioSalvo =
    localStorage.getItem("chronos_user");

  if (!usuarioSalvo) {
    return null;
  }

  try {
    return JSON.parse(
      usuarioSalvo,
    ) as UsuarioAutenticado;
  } catch {
    localStorage.removeItem("chronos_user");
    return null;
  }
}

function lerTokenArmazenado(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("chronos_token");
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [usuario, setUsuario] =
    useState<UsuarioAutenticado | null>(
      lerUsuarioArmazenado,
    );

  const [token, setToken] =
    useState<string | null>(
      lerTokenArmazenado,
    );

  const registrarSessao = useCallback(
    (
      novoUsuario: UsuarioAutenticado,
      novoToken: string,
    ) => {
      localStorage.setItem(
        "chronos_user",
        JSON.stringify(novoUsuario),
      );

      localStorage.setItem(
        "chronos_token",
        novoToken,
      );

      setUsuario(novoUsuario);
      setToken(novoToken);
    },
    [],
  );

  const encerrarSessao = useCallback(() => {
    localStorage.removeItem("chronos_user");
    localStorage.removeItem("chronos_token");

    setUsuario(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      token,
      autenticado: Boolean(
        usuario && token,
      ),
      registrarSessao,
      encerrarSessao,
    }),
    [
      usuario,
      token,
      registrarSessao,
      encerrarSessao,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuthContext deve ser usado dentro de AuthProvider.",
    );
  }

  return contexto;
}