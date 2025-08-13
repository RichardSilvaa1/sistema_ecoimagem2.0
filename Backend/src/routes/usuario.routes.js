// src/routes/usuario.routes.js

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { check } = require('express-validator');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');

// Rota para criar usuário
router.post(
  '/',
  [
    authMiddleware,
    isAdmin,
    check('username').isLength({ min: 3, max: 50 }).withMessage('Username deve ter entre 3 e 50 caracteres'),
    check('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    check('name').isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    check('role').isIn(['Admin', 'Clínica']).withMessage('Role deve ser Admin ou Clínica'),
    check('clinic.name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome da clínica deve ter entre 2 e 100 caracteres'),
    check('clinic.email').optional().isEmail().withMessage('E-mail da clínica deve ser válido'),
  ],
  usuarioController.createUser
);

// Rota para listar usuários
router.get('/', [authMiddleware, isAdmin], usuarioController.getUsers);

// Rota para alterar senha
router.put(
  '/:userId/password',
  [
    authMiddleware,
    isAdmin,
    check('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  ],
  usuarioController.updatePassword
);

// Rota para deletar usuário
router.delete(
  '/:userId',
  [authMiddleware, isAdmin],
  usuarioController.deleteUser
);

module.exports = router;