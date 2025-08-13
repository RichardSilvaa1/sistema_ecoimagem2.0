// Importa o Express para criar rotas
const express = require('express');
// Cria um roteador
const router = express.Router();
// Importa o controlador de clínicas
const clinicaController = require('../controllers/clinica.controller');
// Importa middlewares de autenticação e autorização
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');

// Define rotas para clínicas
router.post('/', authMiddleware, isAdmin, clinicaController.createClinica); // Cria clínica (Admin)
router.get('/', authMiddleware, isAdmin, clinicaController.getClinicas); // Lista clínicas (Admin)
router.put('/:id', authMiddleware, isAdmin, clinicaController.updateClinica); // Atualiza clínica (Admin)
router.delete('/:id', authMiddleware, isAdmin, clinicaController.deleteClinica); // Deleta clínica (Admin)

// Exporta o roteador
module.exports = router;