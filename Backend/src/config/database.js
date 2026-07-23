// Importa o módulo nativo do SQLite3 com o modo verbose ativado para nos dar logs detalhados no terminal
const sqlite3 = require('sqlite3').verbose();

// Importa o módulo nativo 'path' do Node.js, usado para gerenciar e resolver caminhos de arquivos no sistema
const path = require('path');

// Importa bcryptjs para hash seguro de senhas
const bcrypt = require('bcryptjs');

// Resolve o caminho físico do banco de dados. 
// O '__dirname' pega a pasta atual (src/config). 
// Os dois parâmetros '..' sobem duas pastas para salvar o arquivo 'banco_ponto.sqlite' diretamente na raiz do projeto.
const caminhoBanco = path.resolve(__dirname, '..', '..', 'banco_ponto.sqlite');

// PADRÃO SINGLETON: Cria a instância de conexão com o banco de dados.
// Se o arquivo SQLite não existir no caminho especificado, o próprio driver cria o arquivo automaticamente neste momento.
const db = new sqlite3.Database(caminhoBanco, (err) => {
    // Verifica se houve algum erro físico ou de permissão ao tentar abrir/criar o arquivo
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        // Se não houver erros, printa a mensagem de sucesso. Essa mensagem só aparecerá uma vez por execução do servidor.
        console.log('Conexão Singleton estabelecida com o SQLite com sucesso.');
    }
});

// Executa a criação das tabelas de forma serializada.
// O 'db.serialize' garante que o SQLite execute os comandos SQL estritamente um após o outro, evitando problemas de concorrência.
db.serialize(() => {
    
    // 1. Tabela de usuários para autenticação
    const sqlTabelaUsuarios = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            nome TEXT NOT NULL,
            cargo TEXT DEFAULT 'Administrador',
            criadoEm TEXT NOT NULL
        )
    `;

    db.run(sqlTabelaUsuarios, (err) => {
        if (err) {
            console.error('Erro ao criar tabela usuarios:', err.message);
        } else {
            // Verifica se já existe ao menos um usuário cadastrado
            db.get("SELECT COUNT(*) as total FROM usuarios", [], (err, row) => {
                if (err) {
                    console.error('Erro ao verificar usuarios:', err.message);
                    return;
                }
                
                // Se a tabela estiver vazia, cria o usuário padrão 'admin' / 'admin123'
                if (row.total === 0) {
                    const senhaHash = bcrypt.hashSync('admin123', 10);
                    const sqlInsertAdmin = `
                        INSERT INTO usuarios (usuario, senha, nome, cargo, criadoEm)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    db.run(sqlInsertAdmin, ['admin', senhaHash, 'Administrador', 'Administrador', new Date().toISOString()], (err) => {
                        if (err) {
                            console.error('Erro ao criar usuario admin padrão:', err.message);
                        } else {
                            console.log('Usuário admin padrão ("admin" / "admin123") criado com sucesso no banco de dados.');
                        }
                    });
                }
            });
        }
    });

    // 2. Define a instrução SQL para criar a tabela de funcionários caso ela ainda não exista no arquivo
    const sqlTabelaFuncionarios = `
        CREATE TABLE IF NOT EXISTS funcionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            documento TEXT UNIQUE NOT NULL,
            cargo TEXT,
            matricula TEXT,
            cargaDiariaHoras INTEGER DEFAULT 8,
            cargaMensalHoras INTEGER DEFAULT 220,
            status TEXT DEFAULT 'ativo',
            jornadaId INTEGER DEFAULT 1,
            criadoEm TEXT NOT NULL
        )
    `;

    // Executa o comando de criação da tabela de funcionários no banco de dados
    db.run(sqlTabelaFuncionarios, (err) => {
        if (err) {
            console.error('Erro ao criar tabela funcionarios:', err.message);
        } else {
            // Migração automática de colunas faltantes para tabelas já criadas anteriormente
            const colunasDesejadas = [
                { nome: 'matricula', tipo: 'TEXT' },
                { nome: 'cargaDiariaHoras', tipo: 'INTEGER DEFAULT 8' },
                { nome: 'cargaMensalHoras', tipo: 'INTEGER DEFAULT 220' },
                { nome: 'status', tipo: "TEXT DEFAULT 'ativo'" },
                { nome: 'jornadaId', tipo: 'INTEGER DEFAULT 1' },
                { nome: 'criadoEm', tipo: "TEXT DEFAULT ''" }
            ];

            db.all("PRAGMA table_info(funcionarios)", [], (err, colunas) => {
                if (err) {
                    console.error('Erro ao verificar info da tabela funcionarios para migração:', err.message);
                    return;
                }
                const nomesColunasExistentes = colunas.map(c => c.name);
                colunasDesejadas.forEach(col => {
                    if (!nomesColunasExistentes.includes(col.nome)) {
                        db.run(`ALTER TABLE funcionarios ADD COLUMN ${col.nome} ${col.tipo}`, (err) => {
                            if (err) {
                                console.error(`Erro ao migrar adicionando coluna ${col.nome}:`, err.message);
                            } else {
                                console.log(`Coluna '${col.nome}' adicionada via migração automática na tabela funcionarios.`);
                            }
                        });
                    }
                });
            });
        }
    });

    // 3. Define a instrução SQL para criar a tabela de pontos (onde as 4 marcações diárias serão salvas)
    const sqlTabelaPontos = `
        CREATE TABLE IF NOT EXISTS pontos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, -- Chave primária do registro de ponto
            funcionario_id INTEGER NOT NULL,      -- ID do funcionário vindo da tabela 'funcionarios'
            data TEXT NOT NULL,                   -- Data do ponto no padrão texto ISO 'AAAA-MM-DD'
            entrada_1 TEXT,                       -- Horário da primeira entrada (Manhã)
            saida_1 TEXT,                         -- Horário da primeira saída (Almoço)
            entrada_2 TEXT,                       -- Horário da segunda entrada (Retorno)
            saida_2 TEXT,                         -- Horário da segunda saída (Fim do expediente)
            horasTrabalhadasMin INTEGER DEFAULT 0,
            horasExtrasMin INTEGER DEFAULT 0,
            status TEXT DEFAULT 'pendente',
            observacao TEXT,
            FOREIGN KEY (funcionario_id) REFERENCES funcionarios (id) -- Cria o relacionamento (Chave Estrangeira) com a tabela de funcionários
        )
    `;

    // Executa o comando de criação da tabela de pontos no banco de dados
    db.run(sqlTabelaPontos, (err) => {
        if (err) {
            console.error('Erro ao criar tabela pontos:', err.message);
        } else {
            // Migração automática de colunas faltantes para a tabela pontos
            const colunasDesejadasPonto = [
                { nome: 'horasTrabalhadasMin', tipo: 'INTEGER DEFAULT 0' },
                { nome: 'horasExtrasMin', tipo: 'INTEGER DEFAULT 0' },
                { nome: 'status', tipo: "TEXT DEFAULT 'pendente'" },
                { nome: 'observacao', tipo: 'TEXT' }
            ];

            db.all("PRAGMA table_info(pontos)", [], (err, colunas) => {
                if (err) {
                    console.error('Erro ao verificar info da tabela pontos para migração:', err.message);
                    return;
                }
                const nomesColunasExistentes = colunas.map(c => c.name);
                colunasDesejadasPonto.forEach(col => {
                    if (!nomesColunasExistentes.includes(col.nome)) {
                        db.run(`ALTER TABLE pontos ADD COLUMN ${col.nome} ${col.tipo}`, (err) => {
                            if (err) {
                                console.error(`Erro ao migrar adicionando coluna ${col.nome} na tabela pontos:`, err.message);
                            } else {
                                console.log(`Coluna '${col.nome}' adicionada via migração automática na tabela pontos.`);
                            }
                        });
                    }
                });
            });
        }
    });
});

// EXPORTAÇÃO DO SINGLETON: Exporta o objeto 'db' contendo a conexão já aberta e as tabelas estruturadas.
// Como o Node.js faz cache de arquivos exportados, qualquer outro arquivo que der 'require' neste código receberá exatamente essa mesma instância.
module.exports = db;