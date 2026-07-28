export interface Configuracao {
  id: number;
  nomeEmpresa: string;
  nomeUsuario: string;
  atualizadoEm: string;
}

export interface ConfiguracaoFormData {
  nomeEmpresa: string;
  nomeUsuario: string;
}