import {
  Clock,
  Download,
  FileText,
  LayoutDashboard,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

export const GLOBAL_SEARCH_ITEMS = [
  {
    title: "Dashboard",
    description: "Visão geral do sistema",
    href: "/",
    icon: LayoutDashboard,
    keywords: ["início", "resumo", "painel"],
  },
  {
    title: "Funcionários",
    description: "Consultar funcionários cadastrados",
    href: "/funcionarios",
    icon: Users,
    keywords: ["colaboradores", "empregados", "pessoas"],
  },
  {
    title: "Novo funcionário",
    description: "Cadastrar um novo colaborador",
    href: "/funcionarios/novo",
    icon: UserRound,
    keywords: ["adicionar", "cadastro", "novo"],
  },
  {
    title: "Registros de ponto",
    description: "Consultar entradas e saídas",
    href: "/registros",
    icon: Clock,
    keywords: ["ponto", "horários", "marcações"],
  },
  {
    title: "Relatório geral",
    description: "Indicadores consolidados dos funcionários",
    href: "/relatorios/geral",
    icon: FileText,
    keywords: ["relatório", "geral", "consolidado"],
  },
  {
    title: "Relatório individual",
    description: "Histórico mensal por funcionário",
    href: "/relatorios/individual",
    icon: FileText,
    keywords: ["relatório", "individual", "histórico"],
  },
  {
    title: "Exportar relatórios",
    description: "Gerar arquivos XLSX ou CSV",
    href: "/exportar",
    icon: Download,
    keywords: ["excel", "csv", "baixar", "planilha"],
  },
  {
    title: "Configurações",
    description: "Empresa, perfil e aparência",
    href: "/configuracoes",
    icon: Settings,
    keywords: ["tema", "dark mode", "preferências"],
  },
];