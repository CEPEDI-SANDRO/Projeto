"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { ActionButton } from "@/components/common/ActionButton";
import { realizarLogin } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [entrando, setEntrando] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!usuario.trim() || !senha.trim()) {
      toast.warning("Preencha os campos", {
        description: "Informe o usuário e a senha para continuar.",
      });

      return;
    }

    try {
      setEntrando(true);

      const response = await realizarLogin({
        usuario: usuario.trim(),
        senha,
      });

      if (response.sucesso) {
        // Armazena dados de autenticação e sessão no localStorage
        localStorage.setItem("chronos_token", response.token);
        localStorage.setItem("chronos_user", JSON.stringify(response.usuario));

        if (lembrar) {
          localStorage.setItem("chronos_remember_user", usuario.trim());
        } else {
          localStorage.removeItem("chronos_remember_user");
        }

        toast.success("Login realizado com sucesso", {
          description: `Bem-vindo ao Chronos Ponto, ${response.usuario.nome}!`,
        });

        router.push("/");
      }
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Confira as credenciais e tente novamente.";

      toast.error("Não foi possível entrar", {
        description: mensagem,
      });
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#151515] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-lg">
            <Image
              src="/logo.jpeg"
              alt="Logo do Supermercado Sandro"
              width={56}
              height={56}
              className="h-full w-full rounded-full object-contain"
              priority
            />
          </div>

          <div>
            <p className="text-lg font-bold">Chronos Ponto</p>
            <p className="text-sm text-neutral-400">
              Supermercado Sandro
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Controle de jornada
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
            Gestão de ponto simples, segura e organizada.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-neutral-400">
            Acompanhe funcionários, registros, jornadas,
            relatórios e exportações em uma única plataforma.
          </p>
        </div>

        <p className="relative z-10 text-xs text-neutral-500">
          © {new Date().getFullYear()} Supermercado Sandro.
          Todos os direitos reservados.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-md ring-1 ring-slate-200">
              <Image
                src="/logo.jpeg"
                alt="Logo do Supermercado Sandro"
                width={48}
                height={48}
                className="h-full w-full rounded-full object-contain"
              />
            </div>

            <div>
              <p className="font-bold text-slate-950">
                Chronos Ponto
              </p>
              <p className="text-xs text-slate-500">
                Supermercado Sandro
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Acesse sua conta
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Informe suas credenciais para entrar no sistema.
            </p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Usuário
              </span>

              <div className="relative mt-1">
                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={usuario}
                  onChange={(event) =>
                    setUsuario(event.target.value)
                  }
                  placeholder="Digite seu usuário (ex: admin)"
                  autoComplete="username"
                  className={inputClass}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Senha
              </span>

              <div className="relative mt-1">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(event) =>
                    setSenha(event.target.value)
                  }
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarSenha((estado) => !estado)
                  }
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={
                    mostrarSenha
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(event) =>
                    setLembrar(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 accent-yellow-400"
                />

                <span className="text-sm text-slate-600">
                  Lembrar de mim
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  toast.info("Recuperação de senha", {
                    description:
                      "Entre em contato com o suporte ou administrador do sistema.",
                  })
                }
                className="text-sm font-semibold text-yellow-700 transition hover:text-yellow-800"
              >
                Esqueci minha senha
              </button>
            </div>

            <ActionButton
              type="submit"
              disabled={entrando}
              className="w-full"
            >
              <LogIn className="h-4 w-4" />

              {entrando ? "Entrando..." : "Entrar"}
            </ActionButton>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs leading-5 text-slate-600">
              <strong className="font-semibold text-slate-900">Autenticação Integrada:</strong> O login é validado em tempo real pelo banco de dados SQLite do backend.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Usuário padrão: <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-slate-800">admin</code> | Senha: <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-slate-800">admin123</code>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20";