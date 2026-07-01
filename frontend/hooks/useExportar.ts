"use client";

import { useState } from "react";
import {
  exportarEspelhoPonto,
  type ExportarPontoParams,
} from "@/services/exportar.service";

export function useExportar() {
  const [loading, setLoading] = useState(false);
  const [exportado, setExportado] = useState(false);

  async function exportar(params: ExportarPontoParams) {
    setLoading(true);
    setExportado(false);

    const sucesso = await exportarEspelhoPonto(params);

    setExportado(sucesso);
    setLoading(false);

    return sucesso;
  }

  return {
    loading,
    exportado,
    exportar,
  };
}