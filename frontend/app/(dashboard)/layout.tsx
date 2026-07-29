"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import Layout from "@/components/layout/Layout";
import { useAuthContext } from "@/components/providers/AuthProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { autenticado, carregando } = useAuthContext();
  const router = useRouter();
  const redirecionando = useRef(false);

  useEffect(() => {
    if (!carregando && !autenticado && !redirecionando.current) {
      redirecionando.current = true;
      router.replace("/login");
    }

    // Reseta a flag se o usuário autenticar novamente (troca de conta, etc.)
    if (autenticado) {
      redirecionando.current = false;
    }
  }, [autenticado, carregando, router]);

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
          <p className="text-sm text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return null;
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}