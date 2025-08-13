const express = require('express');
const router = express.Router();
const tipoPagamentoController = require('../controllers/tipoPagamento.controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, isAdmin, tipoPagamentoController.createTipoPagamento);
router.get('/', authMiddleware, tipoPagamentoController.getTiposPagamento);
router.put('/:id', authMiddleware, isAdmin, tipoPagamentoController.updateTipoPagamento);
router.delete('/:id', authMiddleware, isAdmin, tipoPagamentoController.deactivateTipoPagamento);

module.exports = router;