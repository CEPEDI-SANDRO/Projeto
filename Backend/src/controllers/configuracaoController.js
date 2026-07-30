const db = require("../config/database");

const configuracaoController = {};

configuracaoController.buscar = (req, res) => {
  db.get(
    `
      SELECT
        id,
        nomeEmpresa,
        nomeUsuario,
        atualizadoEm
      FROM configuracoes
      WHERE id = 1
    `,
    [],
    (err, configuracao) => {
      if (err) {
        console.error(
          "Erro ao buscar configurações:",
          err.message,
        );

        return res.status(500).json({
          error: "Erro ao buscar as configurações.",
        });
      }

      if (!configuracao) {
        return res.status(404).json({
          error: "Configurações não encontradas.",
        });
      }

      return res.status(200).json(configuracao);
    },
  );
};

configuracaoController.atualizar = (req, res) => {
  const { nomeEmpresa, nomeUsuario } = req.body;

  if (
    typeof nomeEmpresa !== "string" ||
    !nomeEmpresa.trim() ||
    typeof nomeUsuario !== "string" ||
    !nomeUsuario.trim()
  ) {
    return res.status(400).json({
      error:
        "Nome da empresa e nome do usuário são obrigatórios.",
    });
  }

  const empresa = nomeEmpresa.trim();
  const usuario = nomeUsuario.trim();
  const atualizadoEm = new Date().toISOString();

  db.run(
    `
      UPDATE configuracoes
      SET
        nomeEmpresa = ?,
        nomeUsuario = ?,
        atualizadoEm = ?
      WHERE id = 1
    `,
    [empresa, usuario, atualizadoEm],
    function (err) {
      if (err) {
        console.error(
          "Erro ao atualizar configurações:",
          err.message,
        );

        return res.status(500).json({
          error: "Erro ao atualizar as configurações.",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Configurações não encontradas.",
        });
      }

      return res.status(200).json({
        id: 1,
        nomeEmpresa: empresa,
        nomeUsuario: usuario,
        atualizadoEm,
      });
    },
  );
};

module.exports = configuracaoController;