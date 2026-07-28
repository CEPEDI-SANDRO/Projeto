const db = require("../config/database");

const relatorioController = {};

function dbAll(sql, parametros = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, parametros, (erro, linhas) => {
      if (erro) {
        reject(erro);
        return;
      }

      resolve(linhas);
    });
  });
}

function dbGet(sql, parametros = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, parametros, (erro, linha) => {
      if (erro) {
        reject(erro);
        return;
      }

      resolve(linha);
    });
  });
}

function validarPeriodo(mes, ano) {
  const mesNumerico = Number(mes);
  const anoNumerico = Number(ano);

  if (
    !Number.isInteger(mesNumerico) ||
    mesNumerico < 1 ||
    mesNumerico > 12
  ) {
    return {
      valido: false,
      erro: "O mês deve ser um número entre 1 e 12.",
    };
  }

  if (
    !Number.isInteger(anoNumerico) ||
    anoNumerico < 2000 ||
    anoNumerico > 2100
  ) {
    return {
      valido: false,
      erro: "O ano informado é inválido.",
    };
  }

  return {
    valido: true,
    mes: mesNumerico,
    ano: anoNumerico,
    mesFormatado: String(mesNumerico).padStart(2, "0"),
  };
}

function formatarFuncionario(funcionario) {
  return {
    id: funcionario.id,
    nome: funcionario.nome,
    documento: funcionario.documento,
    cargo: funcionario.cargo,
    matricula: funcionario.matricula,
    cargaDiariaHoras: funcionario.cargaDiariaHoras,
    cargaMensalHoras: funcionario.cargaMensalHoras,
    status: funcionario.status,
    jornadaId: funcionario.jornadaId,
    criadoEm: funcionario.criadoEm,
  };
}

function formatarRegistro(registro) {
  return {
    id: registro.id,
    funcionarioId: registro.funcionario_id,
    data: registro.data,
    entrada1: registro.entrada_1,
    saida1: registro.saida_1,
    entrada2: registro.entrada_2,
    saida2: registro.saida_2,
    horasTrabalhadasMin:
      Number(registro.horasTrabalhadasMin) || 0,
    horasExtrasMin:
      Number(registro.horasExtrasMin) || 0,
    status: registro.status || "pendente",
    observacao: registro.observacao || "",
  };
}

function calcularResumo(funcionario, registros) {
  return {
    funcionario: formatarFuncionario(funcionario),

    totalHorasTrabalhadasMin: registros.reduce(
      (total, registro) =>
        total +
        (Number(registro.horasTrabalhadasMin) || 0),
      0,
    ),

    totalHorasExtrasMin: registros.reduce(
      (total, registro) =>
        total +
        (Number(registro.horasExtrasMin) || 0),
      0,
    ),

    totalFaltas: registros.filter(
      (registro) => registro.status === "falta",
    ).length,

    totalParciais: registros.filter(
      (registro) =>
        registro.status === "parcial_manha" ||
        registro.status === "parcial_tarde",
    ).length,

    totalPendentes: registros.filter(
      (registro) => registro.status === "pendente",
    ).length,
  };
}

/**
 * GET /relatorio/geral?mes=7&ano=2026
 */
relatorioController.geral = async (req, res) => {
  const periodo = validarPeriodo(
    req.query.mes,
    req.query.ano,
  );

  if (!periodo.valido) {
    return res.status(400).json({
      error: periodo.erro,
    });
  }

  try {
    const funcionarios = await dbAll(`
      SELECT *
      FROM funcionarios
      ORDER BY nome ASC
    `);

    const registros = await dbAll(
      `
        SELECT *
        FROM pontos
        WHERE substr(data, 1, 4) = ?
          AND substr(data, 6, 2) = ?
        ORDER BY data ASC, id ASC
      `,
      [
        String(periodo.ano),
        periodo.mesFormatado,
      ],
    );

    const resumos = funcionarios.map(
      (funcionario) => {
        const registrosFuncionario =
          registros.filter(
            (registro) =>
              Number(registro.funcionario_id) ===
              Number(funcionario.id),
          );

        return calcularResumo(
          funcionario,
          registrosFuncionario,
        );
      },
    );

    const totalHorasTrabalhadasMin =
      resumos.reduce(
        (total, resumo) =>
          total +
          resumo.totalHorasTrabalhadasMin,
        0,
      );

    const totalHorasExtrasMin =
      resumos.reduce(
        (total, resumo) =>
          total + resumo.totalHorasExtrasMin,
        0,
      );

    const totalFaltas = resumos.reduce(
      (total, resumo) =>
        total + resumo.totalFaltas,
      0,
    );

    const totalParciais = resumos.reduce(
      (total, resumo) =>
        total + resumo.totalParciais,
      0,
    );

    const totalPendentes = resumos.reduce(
      (total, resumo) =>
        total + resumo.totalPendentes,
      0,
    );

    return res.status(200).json({
      mes: periodo.mes,
      ano: periodo.ano,

      totalFuncionarios: funcionarios.length,
      totalHorasTrabalhadasMin,
      totalHorasExtrasMin,
      totalFaltas,
      totalParciais,
      totalPendentes,

      resumos,
    });
  } catch (erro) {
    console.error(
      "Erro ao gerar relatório geral:",
      erro.message,
    );

    return res.status(500).json({
      error:
        "Erro ao gerar o relatório geral.",
    });
  }
};

/**
 * GET /relatorio/individual/:funcionarioId?mes=7&ano=2026
 */
relatorioController.individual = async (
  req,
  res,
) => {
  const funcionarioId = Number(
    req.params.funcionarioId,
  );

  if (
    !Number.isInteger(funcionarioId) ||
    funcionarioId <= 0
  ) {
    return res.status(400).json({
      error: "O ID do funcionário é inválido.",
    });
  }

  const periodo = validarPeriodo(
    req.query.mes,
    req.query.ano,
  );

  if (!periodo.valido) {
    return res.status(400).json({
      error: periodo.erro,
    });
  }

  try {
    const funcionario = await dbGet(
      `
        SELECT *
        FROM funcionarios
        WHERE id = ?
      `,
      [funcionarioId],
    );

    if (!funcionario) {
      return res.status(404).json({
        error: "Funcionário não encontrado.",
      });
    }

    const registrosBanco = await dbAll(
      `
        SELECT *
        FROM pontos
        WHERE funcionario_id = ?
          AND substr(data, 1, 4) = ?
          AND substr(data, 6, 2) = ?
        ORDER BY data ASC, id ASC
      `,
      [
        funcionarioId,
        String(periodo.ano),
        periodo.mesFormatado,
      ],
    );

    const registros =
      registrosBanco.map(formatarRegistro);

    const resumo = calcularResumo(
      funcionario,
      registrosBanco,
    );

    return res.status(200).json({
      funcionario:
        formatarFuncionario(funcionario),

      mes: periodo.mes,
      ano: periodo.ano,

      totalHorasTrabalhadasMin:
        resumo.totalHorasTrabalhadasMin,

      totalHorasExtrasMin:
        resumo.totalHorasExtrasMin,

      totalFaltas: resumo.totalFaltas,
      totalParciais: resumo.totalParciais,
      totalPendentes:
        resumo.totalPendentes,

      registros,
    });
  } catch (erro) {
    console.error(
      "Erro ao gerar relatório individual:",
      erro.message,
    );

    return res.status(500).json({
      error:
        "Erro ao gerar o relatório individual.",
    });
  }
};

module.exports = relatorioController;