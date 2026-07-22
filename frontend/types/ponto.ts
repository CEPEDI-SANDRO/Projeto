export type StatusPresenca =
  | "completo"
  | "falta"
  | "parcial_manha"
  | "parcial_tarde"
  | "pendente";

export interface RegistroPonto {
  id: number;
  funcionarioId: number;
  data: string;
  entrada1: string | null;
  saida1: string | null;
  entrada2: string | null;
  saida2: string | null;
  horasTrabalhadasMin: number;
  horasExtrasMin: number;
  status: StatusPresenca;
  observacao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface RegistroPontoFormData {
  funcionarioId: number;
  data: string;
  entrada1: string | null;
  saida1: string | null;
  entrada2: string | null;
  saida2: string | null;
  observacao?: string;
}

export type NovoRegistroPonto = RegistroPontoFormData;