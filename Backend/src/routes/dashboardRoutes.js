const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// ROTA GET: Obter painel de métricas analíticas e estatísticas diárias
router.get('/', dashboardController.obterDados);

module.exports = router;
