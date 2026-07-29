// Importa a instância única e ativa do banco de dados SQLite (Padrão Singleton)
const db = require('../config/database');

// Cria o objeto do Controller que guardará todas as funções de negócio do ponto
const pontoController = {};

// Função auxiliar para calcular minutos trabalhados
const calcularMinutosTrabalhados = (e1, s1, e2, s2) => {
    let total = 0;
    
    const parseHora = (h) => {
        if (!h) return null;
        const partes = h.split(':');
        if (partes.length < 2) return null;
        const hrs = Number(partes[0]);
        const mins = Number(partes[1]);
        if (isNaN(hrs) || isNaN(mins)) return null;
        return hrs * 60 + mins;
    };

    const tE1 = parseHora(e1);
    const tS1 = parseHora(s1);
    const tE2 = parseHora(e2);
    const tS2 = parseHora(s2);

    if (tE1 !== null && tS1 !== null && tS1 >= tE1) {
        total += (tS1 - tE1);
    }
    if (tE2 !== null && tS2 !== null && tS2 >= tE2) {
        total += (tS2 - tE2);
    }
    return total;
};

// Função auxiliar para determinar o status do ponto
const determinarStatus = (e1, s1, e2, s2) => {
    if (e1 && s1 && e2 && s2) return "completo";
    if (e1 && s1 && e2) return "pendente";
    if (e1 && s1) return "parcial_manha";
    if (e1) return "pendente";
    return "falta";
};

// Função auxiliar para validar e formatar data YYYY-MM-DD
const validarEFormatarData = (dataStr) => {
    if (!dataStr || typeof dataStr !== 'string') return null;
    const partes = dataStr.trim().split('-');
    if (partes.length !== 3) return null;
    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);
    if (isNaN(ano) || isNaN(mes) || isNaN(dia)) return null;
    if (ano < 2000 || ano > 2100 || mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
    return `${String(ano).padStart(4, '0')}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
};

// FUNÇÃO PRINCIPAL: Registra ou atualiza o ponto do funcionário de forma inteligente (via batida de ponto)
pontoController.registrarPonto = (req, res) => {
    const { funcionario_id } = req.body;
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const dataAtual = `${ano}-${mes}-${dia}`;
    const horaAtual = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (!funcionario_id) {
        return res.status(400).json({ error: "O ID do funcionário é obrigatório para registrar o ponto." });
    }

    const sqlBuscarPontoHoje = `SELECT * FROM pontos WHERE funcionario_id = ? AND data = ?`;
    
    db.get(sqlBuscarPontoHoje, [funcionario_id, dataAtual], (err, registro) => {
        if (err) {
            console.error("Erro ao buscar ponto de hoje:", err.message);
            return res.status(500).json({ error: "Erro interno ao buscar o ponto no banco de dados." });
        }

        // CASO A: Primeiro ponto do dia (Entrada 1)
        if (!registro) {
            const sqlInserirPrimeiroPonto = `
                INSERT INTO pontos (funcionario_id, data, entrada_1, status, horasTrabalhadasMin, horasExtrasMin) 
                VALUES (?, ?, ?, 'pendente', 0, 0)
            `;
            
            db.run(sqlInserirPrimeiroPonto, [funcionario_id, dataAtual, horaAtual], function(err) {
                if (err) {
                    console.error("Erro ao gravar Entrada 1:", err.message);
                    return res.status(500).json({ error: "Erro ao gravar a Entrada 1 no banco de dados." });
                }
                return res.status(201).json({ 
                    message: "Entrada 1 (Início do expediente) registrada com sucesso!", 
                    horario: horaAtual 
                });
            });
            return;
        }

        // CASO B: Próximas batidas do dia
        let colunaParaAtualizar = null;
        let nomeDoTurno = "";

        if (!registro.saida_1) {
            colunaParaAtualizar = "saida_1";
            nomeDoTurno = "Saída 1 (Intervalo para almoço)";
        } else if (!registro.entrada_2) {
            colunaParaAtualizar = "entrada_2";
            nomeDoTurno = "Entrada 2 (Retorno do almoço)";
        } else if (!registro.saida_2) {
            colunaParaAtualizar = "saida_2";
            nomeDoTurno = "Saída 2 (Fim do expediente)";
        } else {
            return res.status(400).json({ error: "Jornada diária encerrada. Todos os 4 pontos de hoje já foram registrados." });
        }

        // Prepara valores atualizados para cálculos
        const nE1 = registro.entrada_1;
        const nS1 = (colunaParaAtualizar === "saida_1") ? horaAtual : registro.saida_1;
        const nE2 = (colunaParaAtualizar === "entrada_2") ? horaAtual : registro.entrada_2;
        const nS2 = (colunaParaAtualizar === "saida_2") ? horaAtual : registro.saida_2;

        const minutosTrabalhados = calcularMinutosTrabalhados(nE1, nS1, nE2, nS2);
        const status = determinarStatus(nE1, nS1, nE2, nS2);
        const minutosExtras = minutosTrabalhados > 480 ? minutosTrabalhados - 480 : 0;

        const sqlAtualizarPonto = `
            UPDATE pontos 
            SET ${colunaParaAtualizar} = ?, horasTrabalhadasMin = ?, horasExtrasMin = ?, status = ?
            WHERE id = ?
        `;
        
        db.run(sqlAtualizarPonto, [horaAtual, minutosTrabalhados, minutosExtras, status, registro.id], function(err) {
            if (err) {
                console.error(`Erro ao atualizar coluna ${colunaParaAtualizar}:`, err.message);
                return res.status(500).json({ error: `Erro ao gravar dados na coluna ${colunaParaAtualizar}.` });
            }
            return res.status(200).json({ 
                message: `${nomeDoTurno} registrada com sucesso!`, 
                horario: horaAtual 
            });
        });
    });
};

// FUNÇÃO: Listar todos os pontos cadastrados (para exibição na tela do frontend)
pontoController.listarTodos = (req, res) => {
    const sql = `SELECT * FROM pontos ORDER BY data DESC, id DESC`;

    db.all(sql, [], (err, linhas) => {
        if (err) {
            console.error("Erro ao listar pontos:", err.message);
            return res.status(500).json({ error: "Erro ao buscar registros de ponto." });
        }

        // Mapeia os dados do SQLite snake_case para o padrão camelCase esperado pelo frontend
        const formatados = linhas.map(l => ({
            id: l.id,
            funcionarioId: l.funcionario_id,
            data: l.data,
            entrada1: l.entrada_1,
            saida1: l.saida_1,
            entrada2: l.entrada_2,
            saida2: l.saida_2,
            horasTrabalhadasMin: l.horasTrabalhadasMin || 0,
            horasExtrasMin: l.horasExtrasMin || 0,
            status: l.status || "pendente",
            observacao: l.observacao || ""
        }));

        return res.status(200).json(formatados);
    });
};

// FUNÇÃO: Lançar ponto manualmente (via formulário do RH no frontend)
pontoController.lancarManual = (req, res) => {
    const { funcionarioId, data, entrada1, saida1, entrada2, saida2, observacao } = req.body;

    if (!funcionarioId || !data) {
        return res.status(400).json({ error: "O ID do funcionário e a data são obrigatórios." });
    }

    const dataValida = validarEFormatarData(data);
    if (!dataValida) {
        return res.status(400).json({ error: "A data informada é inválida ou possui ano fora do limite permitido (2000 a 2100)." });
    }

    const minutosTrabalhados = calcularMinutosTrabalhados(entrada1, saida1, entrada2, saida2);
    const status = determinarStatus(entrada1, saida1, entrada2, saida2);
    const minutosExtras = minutosTrabalhados > 480 ? minutosTrabalhados - 480 : 0;

    const sql = `
        INSERT INTO pontos (funcionario_id, data, entrada_1, saida_1, entrada_2, saida_2, horasTrabalhadasMin, horasExtrasMin, status, observacao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        funcionarioId,
        dataValida,
        entrada1 || null,
        saida1 || null,
        entrada2 || null,
        saida2 || null,
        minutosTrabalhados,
        minutosExtras,
        status,
        observacao || null
    ], function(err) {
        if (err) {
            console.error("Erro ao inserir ponto manual:", err.message);
            return res.status(500).json({ error: "Erro ao salvar o registro de ponto no banco." });
        }

        return res.status(201).json({
            id: this.lastID,
            funcionarioId: Number(funcionarioId),
            data: dataValida,
            entrada1,
            saida1,
            entrada2,
            saida2,
            horasTrabalhadasMin: minutosTrabalhados,
            horasExtrasMin: minutosExtras,
            status,
            observacao
        });
    });
};


// FUNÇÃO: Atualizar ponto existente
pontoController.atualizar = (req, res) => {
    const { id } = req.params;
    const { entrada1, saida1, entrada2, saida2, observacao } = req.body;

    db.get("SELECT * FROM pontos WHERE id = ?", [id], (err, ponto) => {
        if (err) {
            console.error("Erro ao buscar ponto para atualização:", err.message);
            return res.status(500).json({ error: "Erro ao buscar registro para atualização." });
        }
        if (!ponto) {
            return res.status(404).json({ error: "Registro de ponto não encontrado." });
        }

        const nE1 = entrada1 !== undefined ? entrada1 : ponto.entrada_1;
        const nS1 = saida1 !== undefined ? saida1 : ponto.saida_1;
        const nE2 = entrada2 !== undefined ? entrada2 : ponto.entrada_2;
        const nS2 = saida2 !== undefined ? saida2 : ponto.saida_2;
        const nObservacao = observacao !== undefined ? observacao : ponto.observacao;

        const minutosTrabalhados = calcularMinutosTrabalhados(nE1, nS1, nE2, nS2);
        const status = determinarStatus(nE1, nS1, nE2, nS2);
        const minutosExtras = minutosTrabalhados > 480 ? minutosTrabalhados - 480 : 0;

        const sql = `
            UPDATE pontos 
            SET entrada_1 = ?, saida_1 = ?, entrada_2 = ?, saida_2 = ?, horasTrabalhadasMin = ?, horasExtrasMin = ?, status = ?, observacao = ?
            WHERE id = ?
        `;

        db.run(sql, [
            nE1 || null,
            nS1 || null,
            nE2 || null,
            nS2 || null,
            minutosTrabalhados,
            minutosExtras,
            status,
            nObservacao || null,
            id
        ], function(err) {
            if (err) {
                console.error("Erro ao executar UPDATE de ponto:", err.message);
                return res.status(500).json({ error: "Erro ao atualizar o registro no banco de dados." });
            }

            return res.status(200).json({
                id: Number(id),
                funcionarioId: ponto.funcionario_id,
                data: ponto.data,
                entrada1: nE1,
                saida1: nS1,
                entrada2: nE2,
                saida2: nS2,
                horasTrabalhadasMin: minutosTrabalhados,
                horasExtrasMin: minutosExtras,
                status,
                observacao: nObservacao
            });
        });
    });
};

// FUNÇÃO: Deletar ponto
pontoController.deletar = (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM pontos WHERE id = ?", [id], function(err) {
        if (err) {
            console.error("Erro ao deletar ponto:", err.message);
            return res.status(500).json({ error: "Erro ao excluir o registro do banco de dados." });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Registro de ponto não encontrado." });
        }
        return res.status(200).json({ message: "Registro de ponto excluído com sucesso!" });
    });
};

// Exporta o objeto do controller para que o arquivo de rotas possa utilizá-lo
module.exports = pontoController;