import type { RegistroPonto } from "./ponto";
import type { Funcionario } from "./funcionario";

export interface RelatorioIndividual {
  funcionario: Funcionario;
  mes: number;
  ano: number;
  totalHorasTrabalhadasMin: number;
  totalHorasExtrasMin: number;
  totalFaltas: number;
  totalParciais: number;
  totalPendentes: number;
  registros: RegistroPonto[];
}

export interface ResumoFuncionarioGeral {
  funcionario: Funcionario;
  totalHorasTrabalhadasMin: number;
  totalHorasExtrasMin: number;
  totalFaltas: number;
  totalParciais: number;
  totalPendentes: number;
}

export interface RelatorioGeral {
  mes: number;
  ano: number;
  totalFuncionarios: number;
  totalHorasTrabalhadasMin: number;
  totalHorasExtrasMin: number;
  totalFaltas: number;
  resumos: ResumoFuncionarioGeral[];
}