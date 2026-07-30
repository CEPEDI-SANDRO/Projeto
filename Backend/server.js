// Importa o framework Express para criação e gerenciamento do servidor HTTP
const express = require('express');

// Importa os roteadores do sistema
const pontoRoutes = require('./src/routes/pontoRoutes');
const funcionarioRoutes = require('./src/routes/funcionarioRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const authRoutes = require('./src/routes/authRoutes');
const relatorioRoutes = require("./src/routes/relatorioRoutes");
const configuracaoRoutes = require("./src/routes/configuracaoRoutes");
const notificacaoRoutes = require("./src/routes/notificacaoRoutes");
// Inicializa a aplicação Express criando o objeto do nosso servidor
const app = express();

// Habilita CORS (Cross-Origin Resource Sharing) para que o frontend (Next.js) possa consumir a API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Trata requisições de preflight do CORS
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Define a porta lógica onde o servidor vai rodar (usaremos a porta 3001 para não chocar com o Next.js)
const PORTA = process.env.PORT || 3001;

// MIDDLEWARE: Configura o Express para interceptar e ler requisições que enviam dados no formato JSON.
app.use(express.json());

// VINCULAÇÃO DE ROTAS DA API
app.use('/api/auth', authRoutes);
app.use('/api/ponto', pontoRoutes);
app.use('/api/funcionario', funcionarioRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/relatorio", relatorioRoutes);
app.use("/api/configuracoes", configuracaoRoutes);
app.use("/api/notificacao", notificacaoRoutes);

// ROTA DE TESTE (RAIZ): Uma rota simples apenas para checar se o servidor está online acessando pelo navegador
app.get('/', (req, res) => {
    return res.status(200).send("Servidor do Sistema ChronosPonto está online e funcionando perfeitamente!");
});

// INICIALIZAÇÃO DO SERVIDOR: Faz o aplicativo começar a escutar a porta 3001 e ativa o banco de dados.
app.listen(PORTA, () => {
    console.log(`Servidor rodando com sucesso no endereço: http://localhost:${PORTA}`);
});