// Importa o framework Express para gerenciar as rotas da nossa aplicação
const express = require('express');

// Cria uma instância do roteador do Express (Router) para mapear os caminhos locais
const router = express.Router();

// Importa o controller de ponto
const pontoController = require('../controllers/pontoController');

// ROTA POST: Registro inteligente/rápido de ponto do colaborador (batida de ponto)
router.post('/registrar', pontoController.registrarPonto);

// ROTA GET: Listar todos os pontos cadastrados
router.get('/listar', pontoController.listarTodos);

// ROTA POST: Lançar ponto manual (RH)
router.post('/lancar-manual', pontoController.lancarManual);

// ROTA PUT: Editar ponto existente
router.put('/atualizar/:id', pontoController.atualizar);

// ROTA DELETE: Excluir ponto existente
router.delete('/deletar/:id', pontoController.deletar);

// EXPORTAÇÃO DO ROTEADOR: Torna este arquivo de rotas visível para o arquivo principal 'server.js'
module.exports = router;