import type { RegistroPonto, StatusPresenca } from "@/types/ponto";

/**
 * Converte HH:mm para minutos.
 */
export function horaParaMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Converte minutos para HH:mm.
 */
export function minutosParaHora(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;

  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;
}


/**
 * Calcula um período.
 */
export function calcularPeriodo(
  entrada: string | null,
  saida: string | null
): number {
  if (!entrada || !saida) return 0;

  return horaParaMinutos(saida) - horaParaMinutos(entrada);
}

/**
 * Calcula o total trabalhado.
 */
export function calcularHorasTrabalhadas(
  ponto: Pick<
    RegistroPonto,
    "entrada1" | "saida1" | "entrada2" | "saida2"
  >
): number {
  return (
    calcularPeriodo(ponto.entrada1, ponto.saida1) +
    calcularPeriodo(ponto.entrada2, ponto.saida2)
  );
}

/**
 * Calcula hora extra.
 */
export function calcularHoraExtra(
  minutosTrabalhados: number,
  cargaDiariaHoras: number
): number {
  const carga = cargaDiariaHoras * 60;

  return Math.max(0, minutosTrabalhados - carga);
}

/**
 * Retorna atraso em minutos.
 */
export function calcularAtraso(
  entradaReal: string | null,
  entradaEsperada: string,
  tolerancia: number
): number {
  if (!entradaReal) return 0;

  const atraso =
    horaParaMinutos(entradaReal) - horaParaMinutos(entradaEsperada);

  return atraso > tolerancia ? atraso : 0;
}

export function calcularStatusPresenca(
  ponto: Pick<RegistroPonto, "entrada1" | "saida1" | "entrada2" | "saida2">
): StatusPresenca {
  const { entrada1, saida1, entrada2, saida2 } = ponto;
  const temManha = !!entrada1 && !!saida1;
  const temTarde = !!entrada2 && !!saida2;

  if (!temManha && !temTarde) return "falta";
  if (temManha && temTarde) return "completo";
  if (temManha && !temTarde) return "parcial_manha";
  if (!temManha && temTarde) return "parcial_tarde";
  return "pendente";
}