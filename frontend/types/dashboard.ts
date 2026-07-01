import type { RegistroPonto } from "./ponto";
import type { Funcionario } from "./funcionario";

export interface DashboardResumo {
  totalFuncionarios: number;
  presentesHoje: number;
  ausentesHoje: number;
  atrasosHoje: number;
  horasTrabalhadasHojeMin: number;
  horasExtrasHojeMin: number;
  pendenciasHoje: number;
}

export interface DashboardStatusFuncionario {
  funcionario: Funcionario;
  registro: RegistroPonto | null;
}

export interface DashboardGraficoPresenca {
  dia: string;
  presentes: number;
  ausentes: number;
}

export interface DashboardGraficoHoras {
  dia: string;
  horasTrabalhadasMin: number;
}

export interface DashboardData {
  resumo: DashboardResumo;
  statusHoje: DashboardStatusFuncionario[];
  graficoPresenca: DashboardGraficoPresenca[];
  graficoHoras: DashboardGraficoHoras[];
  pendenciasRecentes: RegistroPonto[];
}