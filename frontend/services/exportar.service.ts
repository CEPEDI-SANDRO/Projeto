import * as XLSX from "xlsx";
import {
  gerarRelatorioGeral,
  gerarRelatorioIndividual,
} from "./relatorios.service";
import {
  formatarData,
  formatarHora,
  formatarMinutosParaHoras,
} from "@/lib/formatters";
import { STATUS_PRESENCA_LABEL } from "@/lib/constants";

export interface ExportarPontoParams {
  funcionarioId?: number;
  mes: number;
  ano: number;
  tipo: "individual" | "geral";
}

export async function exportarRelatorioExcel(
  params: ExportarPontoParams,
): Promise<boolean> {
  if (params.tipo === "geral") {
    const relatorio = await gerarRelatorioGeral(
      params.mes,
      params.ano,
    );

    const resumoData = relatorio.resumos.map((item) => ({
      "Funcionário": item.funcionario.nome,
      "Documento": item.funcionario.documento || "-",
      "Cargo": item.funcionario.cargo || "-",
      "Matrícula": item.funcionario.matricula || "-",
      "Horas Trabalhadas": formatarMinutosParaHoras(
        item.totalHorasTrabalhadasMin,
      ),
      "Horas Extras": formatarMinutosParaHoras(
        item.totalHorasExtrasMin,
      ),
      "Faltas": item.totalFaltas,
      "Registros Parciais": item.totalParciais,
      "Pendentes": item.totalPendentes,
    }));

    resumoData.push({
      "Funcionário": "TOTAL GERAL",
      "Documento": "",
      "Cargo": "",
      "Matrícula": "",
      "Horas Trabalhadas": formatarMinutosParaHoras(
        relatorio.totalHorasTrabalhadasMin,
      ),
      "Horas Extras": formatarMinutosParaHoras(
        relatorio.totalHorasExtrasMin,
      ),
      "Faltas": relatorio.totalFaltas,
      "Registros Parciais": relatorio.resumos.reduce(
        (acc, r) => acc + r.totalParciais,
        0,
      ),
      "Pendentes": relatorio.resumos.reduce(
        (acc, r) => acc + r.totalPendentes,
        0,
      ),
    });

    const worksheet = XLSX.utils.json_to_sheet(resumoData);

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 18 },
      { wch: 15 },
      { wch: 10 },
      { wch: 18 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Relatório Geral",
    );

    const fileName = `relatorio-geral-${params.ano}-${String(
      params.mes,
    ).padStart(2, "0")}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    return true;
  } else {
    if (!params.funcionarioId) {
      throw new Error("Selecione um funcionário.");
    }

    const relatorio = await gerarRelatorioIndividual(
      params.funcionarioId,
      params.mes,
      params.ano,
    );

    const detalheData = relatorio.registros.map(
      (reg) => ({
        "Data": formatarData(reg.data),
        "Entrada 1": formatarHora(reg.entrada1),
        "Saída 1": formatarHora(reg.saida1),
        "Entrada 2": formatarHora(reg.entrada2),
        "Saída 2": formatarHora(reg.saida2),
        "Horas Trabalhadas": formatarMinutosParaHoras(
          reg.horasTrabalhadasMin,
        ),
        "Horas Extras": formatarMinutosParaHoras(
          reg.horasExtrasMin,
        ),
        "Status":
          STATUS_PRESENCA_LABEL[reg.status] || reg.status,
        "Observação": reg.observacao || "",
      }),
    );

    const worksheet = XLSX.utils.json_to_sheet(detalheData);

    worksheet["!cols"] = [
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 18 },
      { wch: 15 },
      { wch: 16 },
      { wch: 30 },
    ];

    const workbook = XLSX.utils.book_new();
    const sheetName = relatorio.funcionario.nome
      .substring(0, 31)
      .replace(/[\\/?*:[\]]/g, "");

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sheetName || "Relatório Individual",
    );

    const nomeSanitizado = relatorio.funcionario.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const fileName = `relatorio-${nomeSanitizado}-${params.ano}-${String(
      params.mes,
    ).padStart(2, "0")}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    return true;
  }
}

export async function exportarEspelhoPonto(
  params: ExportarPontoParams,
): Promise<boolean> {
  return exportarRelatorioExcel(params);
}