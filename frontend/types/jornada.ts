export interface Jornada {
  id: number;
  funcionarioId: number;
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
  toleranciaMinutos: number;
  percentualHoraExtra: number;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface JornadaFormData {
  funcionarioId: number;
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
  toleranciaMinutos: number;
  percentualHoraExtra: number;
}

export type NovaJornada = JornadaFormData;