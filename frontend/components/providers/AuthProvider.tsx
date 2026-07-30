"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { UsuarioAutenticado } from "@/services/auth.service";

interface AuthContextValue {
  usuario: UsuarioAutenticado | null;
  token: string | null;
  autenticado: boolean;
  carregando: boolean;
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

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [usuario, setUsuario] =
    useState<UsuarioAutenticado | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    try {
      const usuarioSalvo =
        localStorage.getItem("chronos_user");
      const tokenSalvo =
        localStorage.getItem("chronos_token");

      if (usuarioSalvo && tokenSalvo) {
        setUsuario(
          JSON.parse(usuarioSalvo) as UsuarioAutenticado,
        );
        setToken(tokenSalvo);
      }
    } catch {
      localStorage.removeItem("chronos_user");
      localStorage.removeItem("chronos_token");
    } finally {
      setCarregando(false);
    }
  }, []);

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
      autenticado: Boolean(usuario && token),
      carregando,
      registrarSessao,
      encerrarSessao,
    }),
    [
      usuario,
      token,
      carregando,
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