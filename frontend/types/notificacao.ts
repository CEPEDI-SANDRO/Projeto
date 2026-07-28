export interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  href: string;
  tipo: "warning" | "info";
  criadoEm: string;
}