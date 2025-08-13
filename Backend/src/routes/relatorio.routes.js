// Importa o Express para criar rotas
const express = require('express');
// Cria um roteador
const router = express.Router();
// Importa o controlador de relatórios
const relatorioController = require('../controllers/relatorio.controller');
// Importa middleware de autenticação
const { authMiddleware } = require('../middlewares/auth.middleware');

// Define rota para relatórios financeiros
router.get('/financeiros', authMiddleware, relatorioController.generateFinancialReport);

// Exporta o roteador
module.exports = router; 
