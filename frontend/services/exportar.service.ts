export interface ExportarPontoParams {
  funcionarioId?: number;
  mes: number;
  ano: number;
  tipo: "individual" | "geral";
}

export async function exportarEspelhoPonto(
  params: ExportarPontoParams
): Promise<boolean> {
  console.log("Exportando espelho de ponto:", params);

  return true;
}