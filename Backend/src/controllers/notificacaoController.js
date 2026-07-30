const db = require("../config/database");

const notificacaoController = {};

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

notificacaoController.listar = async (req, res) => {
  try {
    const registrosPendentes = await dbAll(`
      SELECT
        p.id,
        p.funcionario_id,
        p.data,
        p.status,
        p.entrada_1,
        p.saida_1,
        p.entrada_2,
        p.saida_2,
        f.nome AS funcionario_nome
      FROM pontos p
      INNER JOIN funcionarios f
        ON f.id = p.funcionario_id
      WHERE p.status IN (
        'pendente',
        'parcial_manha',
        'parcial_tarde'
      )
      ORDER BY p.data DESC, p.id DESC
      LIMIT 10
    `);

    const notificacoes = registrosPendentes.map(
      (registro) => {
        let descricao =
          `${registro.funcionario_nome} possui um registro de ponto incompleto em ${registro.data}.`;

        if (registro.status === "parcial_manha") {
          descricao =
            `${registro.funcionario_nome} possui um registro parcial no período da manhã.`;
        }

        if (registro.status === "parcial_tarde") {
          descricao =
            `${registro.funcionario_nome} possui um registro parcial no período da tarde.`;
        }

        return {
          id: `ponto-${registro.id}`,
          titulo: "Registro pendente",
          descricao,
          href: "/registros?status=pendente",
          tipo: "warning",
          criadoEm: registro.data,
        };
      },
    );

    return res.status(200).json(notificacoes);
  } catch (erro) {
    console.error(
      "Erro ao listar notificações:",
      erro.message,
    );

    return res.status(500).json({
      error:
        "Não foi possível carregar as notificações.",
    });
  }
};

module.exports = notificacaoController;