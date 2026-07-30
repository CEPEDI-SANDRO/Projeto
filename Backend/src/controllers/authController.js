const db = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Controller responsável pelo gerenciamento de autenticação de usuários
 */
const authController = {
    /**
     * Realiza a autenticação (login) do usuário no sistema
     * Route: POST /api/auth/login
     */
    login: (req, res) => {
        const { usuario, senha } = req.body;

        // Validação básica de entrada
        if (!usuario || !senha) {
            return res.status(400).json({
                erro: "É necessário informar o usuário e a senha."
            });
        }

        const sql = "SELECT * FROM usuarios WHERE usuario = ?";

        db.get(sql, [usuario.trim()], (err, user) => {
            if (err) {
                console.error("Erro ao buscar usuário para login:", err.message);
                return res.status(500).json({
                    erro: "Erro interno no servidor ao verificar credenciais."
                });
            }

            if (!user) {
                return res.status(401).json({
                    erro: "Usuário ou senha incorretos."
                });
            }

            // Verifica se a senha confere (compara hash ou senha em texto simples como fallback)
            let senhaValida = false;
            try {
                senhaValida = bcrypt.compareSync(senha, user.senha);
            } catch (e) {
                senhaValida = (senha === user.senha);
            }

            if (!senhaValida) {
                return res.status(401).json({
                    erro: "Usuário ou senha incorretos."
                });
            }

            // Retorna dados do usuário autenticado e um token fictício/de sessão
            return res.status(200).json({
                sucesso: true,
                mensagem: "Login realizado com sucesso.",
                usuario: {
                    id: user.id,
                    usuario: user.usuario,
                    nome: user.nome,
                    cargo: user.cargo
                },
                token: `chronos-token-${user.id}-${Date.now()}`
            });
        });
    }
};

module.exports = authController;
