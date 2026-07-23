import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f8fb] px-5 py-10">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <section className="relative z-10 w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-lg ring-1 ring-slate-200">
          <Image
            src="/logo.jpeg"
            alt="Logo Supermercado Sandro"
            width={64}
            height={64}
            className="h-full w-full rounded-full object-contain"
            priority
          />
        </div>

        <div className="mt-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-yellow-700">
            <SearchX className="h-8 w-8" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-yellow-700">
            Erro 404
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Página não encontrada
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
            O endereço acessado não existe, foi alterado ou não está mais
            disponível no Chronos Ponto.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-black shadow-sm transition hover:bg-primary-hover"
          >
            <LayoutDashboard className="h-4 w-4" />
            Ir para o Dashboard
          </Link>

          <Link
            href="/funcionarios"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao sistema
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-500 shadow-sm backdrop-blur">
          Verifique o endereço digitado ou utilize o menu principal para
          continuar navegando.
        </div>
      </section>
    </main>
  );
}