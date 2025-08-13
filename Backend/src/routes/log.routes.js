// Importa o Express para criar rotas
const express = require('express');
// Cria um roteador
const router = express.Router();
// Importa o controlador de logs
const logController = require('../controllers/log.controller');
// Importa middlewares de autenticação e autorização
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');

// Define rotas para logs
router.get('/', authMiddleware, isAdmin, logController.getLogs); // Lista logs gerais (Admin)
router.get('/email-logs', authMiddleware, isAdmin, logController.getEmailLogs); // Lista todos os logs de e-mail (Admin)
router.get('/email-logs/:id', authMiddleware, isAdmin, logController.getEmailLogs); // Lista logs de e-mail de um exame (Admin)

// Exporta o roteador
module.exports = router;
