const express = require('express');
const router = express.Router();

// Importa o controlador de autenticação
const authController = require('../controllers/auth.controller');

// Importa os middlewares
const { authMiddleware} = require('../middlewares/auth.middleware');
const { loginLimiter } = require('../middlewares/rateLimit.middleware'); // ✅ Importa o rate limiter

// Rota de login com rate limiter
router.post('/login', loginLimiter, authController.login);

// Rota protegida para obter dados do usuário autenticado
router.get('/me', authMiddleware, authController.getMe);

// Exporta o roteador
module.exports = router;
