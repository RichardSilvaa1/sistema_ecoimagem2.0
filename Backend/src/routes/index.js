// src/routes/index.js

const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/exames', require('./exame.routes'));
router.use('/clinicas', require('./clinica.routes'));
router.use('/relatorios', require('./relatorio.routes'));
router.use('/logs', require('./log.routes'));
router.use('/usuarios', require('./usuario.routes'));
router.use('/tipos-pagamento', require('./tipoPagamento.routes'));

// Nova rota para as rotas financeiras
router.use('/financas', require('./financialRoutes'));


module.exports = router;