export function formatarMinutosParaHoras(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  return `${horas}h ${mins.toString().padStart(2, "0")}min`;
}

export function formatarHora(hora: string | null): string {
  if (!hora) return "--:--";

  return hora;
}

export function formatarData(data: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${data}T00:00:00`));
}

export function formatarMesAno(mes: number, ano: number): string {
  const data = new Date(ano, mes - 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(data);
}

export function formatarPercentual(valor: number): string {
  return `${valor}%`;
}