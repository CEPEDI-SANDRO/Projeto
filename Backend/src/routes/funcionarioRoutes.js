// Importa o framework Express para gerenciar as rotas
const express = require('express');

// Cria uma instância do roteador do Express
const router = express.Router();

// Importa o controller correspondente
const funcionarioController = require('../controllers/funcionarioController');

// ROTA GET: Listar todos os funcionários
router.get('/listar', funcionarioController.listarTodos);

// ROTA GET: Buscar um funcionário específico por ID
router.get('/:id', funcionarioController.buscarPorId);

// ROTA POST: Mapeia o caminho para criar um funcionário
router.post('/cadastrar', funcionarioController.cadastrar);

// ROTA PUT: Atualizar dados de um funcionário
router.put('/atualizar/:id', funcionarioController.atualizar);

// ROTA DELETE: Excluir um funcionário e seus pontos
router.delete('/deletar/:id', funcionarioController.deletar);

// Exporta o roteador de funcionários para ser plugado no servidor principal
module.exports = router;
