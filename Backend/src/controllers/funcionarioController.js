// Importa a instância única e ativa do banco de dados SQLite (Padrão Singleton)
const db = require('../config/database');

// Cria o objeto do Controller que guardará as funções de negócio do funcionário
const funcionarioController = {};

// FUNÇÃO: Cadastra um novo funcionário no banco de dados
funcionarioController.cadastrar = (req, res) => {
    // Extrai os dados enviados pelo corpo da requisição (body)
    const { nome, documento, cargo, matricula, cargaDiariaHoras, cargaMensalHoras, status, jornadaId } = req.body;

    // Validação de segurança: Nome e Documento (CPF/CTPS) são obrigatórios no banco
    if (!nome || !documento) {
        return res.status(400).json({ error: "Nome e documento são campos obrigatórios." });
    }

    const criadoEm = new Date().toISOString();
    const statusValido = status || 'ativo';
    const cargaDiaria = cargaDiariaHoras !== undefined ? Number(cargaDiariaHoras) : 8;
    const cargaMensal = cargaMensalHoras !== undefined ? Number(cargaMensalHoras) : 220;
    const jId = jornadaId !== undefined ? Number(jornadaId) : 1;

    // Prepara a instrução SQL para inserir o funcionário na tabela com todas as colunas
    const sqlInserirFuncionario = `
        INSERT INTO funcionarios (nome, documento, cargo, matricula, cargaDiariaHoras, cargaMensalHoras, status, jornadaId, criadoEm) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Executa o comando no SQLite
    db.run(sqlInserirFuncionario, [nome, documento, cargo || null, matricula || null, cargaDiaria, cargaMensal, statusValido, jId, criadoEm], function(err) {
        if (err) {
            console.error('Erro ao inserir funcionário no banco:', err.message);
            if (err.message.includes("UNIQUE")) {
                return res.status(400).json({ error: "Este documento já está cadastrado para outro funcionário." });
            }
            return res.status(500).json({ error: "Erro ao cadastrar o funcionário no banco de dados." });
        }

        // Retorna o funcionário criado
        return res.status(201).json({
            message: "Funcionário cadastrado com sucesso!",
            id: this.lastID,
            nome,
            documento,
            cargo,
            matricula,
            cargaDiariaHoras: cargaDiaria,
            cargaMensalHoras: cargaMensal,
            status: statusValido,
            jornadaId: jId,
            criadoEm
        });
    });
};

// FUNÇÃO: Lista todos os funcionários cadastrados
funcionarioController.listarTodos = (req, res) => {
    const sqlListar = `SELECT * FROM funcionarios ORDER BY nome ASC`;

    db.all(sqlListar, [], (err, linhas) => {
        if (err) {
            console.error('Erro ao listar funcionários:', err.message);
            return res.status(500).json({ error: "Erro ao listar os funcionários." });
        }
        return res.status(200).json(linhas);
    });
};

// FUNÇÃO: Busca um funcionário específico por ID
funcionarioController.buscarPorId = (req, res) => {
    const { id } = req.params;
    const sqlBuscar = `SELECT * FROM funcionarios WHERE id = ?`;

    db.get(sqlBuscar, [id], (err, linha) => {
        if (err) {
            console.error(`Erro ao buscar funcionário ID ${id}:`, err.message);
            return res.status(500).json({ error: "Erro ao buscar o funcionário." });
        }
        if (!linha) {
            return res.status(404).json({ error: "Funcionário não encontrado." });
        }
        return res.status(200).json(linha);
    });
};

// FUNÇÃO: Atualiza os dados de um funcionário
funcionarioController.atualizar = (req, res) => {
    const { id } = req.params;
    const { nome, documento, cargo, matricula, cargaDiariaHoras, cargaMensalHoras, status, jornadaId } = req.body;

    db.get(`SELECT * FROM funcionarios WHERE id = ?`, [id], (err, funcionario) => {
        if (err) {
            console.error(`Erro ao verificar existência do funcionário ID ${id}:`, err.message);
            return res.status(500).json({ error: "Erro ao buscar o funcionário para atualização." });
        }
        if (!funcionario) {
            return res.status(404).json({ error: "Funcionário não encontrado." });
        }

        const novoNome = nome !== undefined ? nome : funcionario.nome;
        const novoDocumento = documento !== undefined ? documento : funcionario.documento;
        const novoCargo = cargo !== undefined ? cargo : funcionario.cargo;
        const novaMatricula = matricula !== undefined ? matricula : funcionario.matricula;
        const novaCargaDiaria = cargaDiariaHoras !== undefined ? Number(cargaDiariaHoras) : funcionario.cargaDiariaHoras;
        const novaCargaMensal = cargaMensalHoras !== undefined ? Number(cargaMensalHoras) : funcionario.cargaMensalHoras;
        const novoStatus = status !== undefined ? status : funcionario.status;
        const novaJornadaId = jornadaId !== undefined ? Number(jornadaId) : funcionario.jornadaId;

        const sqlAtualizar = `
            UPDATE funcionarios 
            SET nome = ?, documento = ?, cargo = ?, matricula = ?, cargaDiariaHoras = ?, cargaMensalHoras = ?, status = ?, jornadaId = ?
            WHERE id = ?
        `;

        db.run(sqlAtualizar, [novoNome, novoDocumento, novoCargo, novaMatricula, novaCargaDiaria, novaCargaMensal, novoStatus, novaJornadaId, id], function(err) {
            if (err) {
                console.error(`Erro ao atualizar funcionário ID ${id}:`, err.message);
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({ error: "Este documento já está cadastrado para outro funcionário." });
                }
                return res.status(500).json({ error: "Erro ao atualizar o funcionário no banco de dados." });
            }

            return res.status(200).json({
                message: "Funcionário atualizado com sucesso!",
                id: Number(id),
                nome: novoNome,
                documento: novoDocumento,
                cargo: novoCargo,
                matricula: novaMatricula,
                cargaDiariaHoras: novaCargaDiaria,
                cargaMensalHoras: novaCargaMensal,
                status: novoStatus,
                jornadaId: novaJornadaId
            });
        });
    });
};

// FUNÇÃO: Remove um funcionário (deleta seus registros de ponto associados primeiro)
funcionarioController.deletar = (req, res) => {
    const { id } = req.params;

    db.serialize(() => {
        // Exclui os pontos associados primeiro para preservar a consistência
        db.run(`DELETE FROM pontos WHERE funcionario_id = ?`, [id], (err) => {
            if (err) {
                console.error(`Erro ao excluir pontos vinculados ao funcionário ID ${id}:`, err.message);
            }
        });

        // Deleta o funcionário
        db.run(`DELETE FROM funcionarios WHERE id = ?`, [id], function(err) {
            if (err) {
                console.error(`Erro ao deletar funcionário ID ${id}:`, err.message);
                return res.status(500).json({ error: "Erro ao deletar o funcionário no banco de dados." });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Funcionário não encontrado." });
            }
            return res.status(200).json({ message: "Funcionário e pontos associados excluídos com sucesso!" });
        });
    });
};

// Exporta o controller para que o arquivo de rotas correspondente possa ler essas funções
module.exports = funcionarioController;