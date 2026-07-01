export type StatusVinculo = "ativo" | "inativo";

export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  matricula: string;
  cargaDiariaHoras: number;
  cargaMensalHoras: number;
  status: StatusVinculo;
  jornadaId: number;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface FuncionarioFormData {
  nome: string;
  cargo: string;
  matricula: string;
  cargaDiariaHoras: number;
  cargaMensalHoras: number;
  status: StatusVinculo;
  jornadaId?: number;
}

export type NovoFuncionario = FuncionarioFormData;