// Importa o framework Express para criação e gerenciamento do servidor HTTP
const express = require('express');

// Importa a instância do nosso roteador de pontos (onde mapeamos a rota /registrar)
const pontoRoutes = require('./src/routes/pontoRoutes');

// NOVA ALTERAÇÃO: Importa a instância do roteador de funcionários (cadastro e listagem)
const funcionarioRoutes = require('./src/routes/funcionarioRoutes');

// NOVA ALTERAÇÃO: Importa a instância do roteador de dashboard (estatísticas analíticas)
const dashboardRoutes = require('./src/routes/dashboardRoutes');

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
// Isso é essencial para que os nossos controllers consigam ler os dados enviados pelo aplicativo.
app.use(express.json());

// VINCULAÇÃO DE ROTAS DE PONTO: Define o prefixo global '/api/ponto' para as rotas de ponto.
// Endereço completo para registrar ponto: http://localhost:3001/api/ponto/registrar
app.use('/api/ponto', pontoRoutes);

// NOVA ALTERAÇÃO: Vincula o prefixo global '/api/funcionario' para as rotas de funcionário.
// Endereço para cadastrar: http://localhost:3001/api/funcionario/cadastrar
// Endereço para listar: http://localhost:3001/api/funcionario/listar
app.use('/api/funcionario', funcionarioRoutes);

// NOVA ALTERAÇÃO: Vincula o prefixo global '/api/dashboard' para as rotas do painel analítico.
app.use('/api/dashboard', dashboardRoutes);

// ROTA DE TESTE (RAIZ): Uma rota simples apenas para checar se o servidor está online acessando pelo navegador
app.get('/', (req, res) => {
    return res.status(200).send("Servidor do Sistema ChronosPonto está online e funcionando perfeitamente!");
});

// INICIALIZAÇÃO DO SERVIDOR: Faz o aplicativo começar a escutar a porta 3000 e ativa o banco de dados.
app.listen(PORTA, () => {
    // Esse log aparecerá no terminal do seu VS Code assim que o servidor iniciar
    console.log(`Servidor rodando com sucesso no endereço: http://localhost:${PORTA}`);
});