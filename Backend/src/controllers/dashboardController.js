const db = require('../config/database');

const dashboardController = {};

// Helper para executar consultas GET com Promise
const queryGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Helper para executar consultas ALL com Promise
const queryAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Helper para obter abreviação do dia da semana
const obterDiaSemana = (dataStr) => {
    // Adiciona T00:00:00 para evitar desvios de fuso horário local na conversão
    const data = new Date(dataStr + 'T00:00:00');
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias[data.getDay()];
};

dashboardController.obterDados = async (req, res) => {
    const hoje = new Date().toISOString().split('T')[0];

    try {
        // Executa todas as consultas agregadas em paralelo usando Promise.all
        const [
            rowTotalFunc,
            rowPresentes,
            rowAtrasos,
            rowHoras,
            rowPendencias,
            rowsStatusHoje,
            rowsPendenciasRecentes,
            rowsPresencaGrafico,
            rowsHorasGrafico
        ] = await Promise.all([
            queryGet("SELECT COUNT(*) AS total FROM funcionarios"),
            queryGet("SELECT COUNT(DISTINCT funcionario_id) AS total FROM pontos WHERE data = ?", [hoje]),
            queryGet("SELECT COUNT(*) AS total FROM pontos WHERE data = ? AND entrada_1 > '08:10'", [hoje]),
            queryGet("SELECT SUM(horasTrabalhadasMin) AS total, SUM(horasExtrasMin) AS totalExtras FROM pontos WHERE data = ?", [hoje]),
            queryGet("SELECT COUNT(*) AS total FROM pontos WHERE data = ? AND status != 'completo'", [hoje]),
            queryAll(`
                SELECT f.id AS func_id, f.nome AS func_nome, f.cargo AS func_cargo, f.status AS func_status,
                       p.id AS ponto_id, p.entrada_1, p.saida_1, p.entrada_2, p.saida_2, p.horasTrabalhadasMin, p.horasExtrasMin, p.status AS ponto_status, p.observacao
                FROM funcionarios f
                LEFT JOIN pontos p ON f.id = p.funcionario_id AND p.data = ?
                ORDER BY f.nome ASC
            `, [hoje]),
            queryAll(`
                SELECT p.*, f.nome AS func_nome 
                FROM pontos p 
                LEFT JOIN funcionarios f ON p.funcionario_id = f.id 
                WHERE p.status != 'completo' 
                ORDER BY p.data DESC, p.id DESC 
                LIMIT 10
            `),
            queryAll(`
                SELECT data, COUNT(DISTINCT funcionario_id) AS presentes
                FROM pontos
                GROUP BY data
                ORDER BY data DESC
                LIMIT 6
            `),
            queryAll(`
                SELECT data, SUM(horasTrabalhadasMin) AS horas
                FROM pontos
                GROUP BY data
                ORDER BY data DESC
                LIMIT 6
            `)
        ]);

        const totalFuncs = rowTotalFunc ? rowTotalFunc.total : 0;
        const presentesHoje = rowPresentes ? rowPresentes.total : 0;
        const ausentesHoje = totalFuncs - presentesHoje > 0 ? totalFuncs - presentesHoje : 0;
        const atrasosHoje = rowAtrasos ? rowAtrasos.total : 0;
        const horasTrabalhadasHojeMin = rowHoras ? (rowHoras.total || 0) : 0;
        const horasExtrasHojeMin = rowHoras ? (rowHoras.totalExtras || 0) : 0;
        const pendenciasHoje = rowPendencias ? rowPendencias.total : 0;

        // Gera a lista dos últimos 6 dias úteis para consolidar os gráficos de forma linear
        const ultimos6Dias = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dataStr = d.toISOString().split('T')[0];
            const diaNome = obterDiaSemana(dataStr);
            ultimos6Dias.push({ dataStr, diaNome });
        }

        // Consolida Gráfico de Presença (últimos 6 dias)
        const graficoPresenca = ultimos6Dias.map(d => {
            const pontoDia = rowsPresencaGrafico.find(r => r.data === d.dataStr);
            const presentes = pontoDia ? pontoDia.presentes : 0;
            const ausentes = totalFuncs - presentes > 0 ? totalFuncs - presentes : 0;
            return {
                dia: d.diaNome,
                presentes,
                ausentes
            };
        });

        // Consolida Gráfico de Horas (últimos 6 dias)
        const graficoHoras = ultimos6Dias.map(d => {
            const pontoDia = rowsHorasGrafico.find(r => r.data === d.dataStr);
            const horas = pontoDia ? pontoDia.horas : 0;
            return {
                dia: d.diaNome,
                horasTrabalhadasMin: horas
            };
        });

        // Formata os status dos funcionários hoje
        const statusHoje = rowsStatusHoje.map(row => ({
            funcionario: {
                id: row.func_id,
                nome: row.func_nome,
                cargo: row.func_cargo,
                status: row.func_status
            },
            registro: row.ponto_id ? {
                id: row.ponto_id,
                funcionarioId: row.func_id,
                data: hoje,
                entrada1: row.entrada_1,
                saida1: row.saida_1,
                entrada2: row.entrada_2,
                saida2: row.saida_2,
                horasTrabalhadasMin: row.horasTrabalhadasMin || 0,
                horasExtrasMin: row.horasExtrasMin || 0,
                status: row.ponto_status || "pendente",
                observacao: row.observacao || ""
            } : null
        }));

        // Formata pendências recentes
        const pendenciasRecentes = rowsPendenciasRecentes.map(row => ({
            id: row.id,
            funcionarioId: row.funcionario_id,
            data: row.data,
            entrada1: row.entrada_1,
            saida1: row.saida_1,
            entrada2: row.entrada_2,
            saida2: row.saida_2,
            horasTrabalhadasMin: row.horasTrabalhadasMin || 0,
            horasExtrasMin: row.horasExtrasMin || 0,
            status: row.status || "pendente",
            observacao: row.observacao || `Ponto pendente de ajuste (${row.func_nome})`
        }));

        // Devolve o JSON estruturado idêntico ao DashboardData do frontend
        return res.status(200).json({
            resumo: {
                totalFuncionarios: totalFuncs,
                presentesHoje,
                ausentesHoje,
                atrasosHoje,
                horasTrabalhadasHojeMin,
                horasExtrasHojeMin,
                pendenciasHoje
            },
            statusHoje,
            graficoPresenca,
            graficoHoras,
            pendenciasRecentes
        });

    } catch (error) {
        console.error("Erro ao obter dados do dashboard:", error);
        return res.status(500).json({ error: "Erro ao compilar os dados do painel principal." });
    }
};

module.exports = dashboardController;
