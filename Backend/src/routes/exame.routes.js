const express = require('express');
const router = express.Router();
const exameController = require('../controllers/exame.controller');
const { authMiddleware, isAdmin, restrictToOwnClinic } = require('../middlewares/auth.middleware');
const { sendEmailLimiter } = require('../middlewares/rateLimit.middleware');

router.get('/', authMiddleware, exameController.getExames);
router.post('/', authMiddleware, isAdmin, exameController.createExame);
router.get('/tipos', authMiddleware, exameController.getExamTypes);
router.get('/:id', authMiddleware, restrictToOwnClinic, exameController.getExame);
router.put('/:id', authMiddleware, isAdmin, exameController.updateExame);
router.delete('/:id', authMiddleware, isAdmin, exameController.deleteExame);
router.post('/:id/carregar-arquivo', authMiddleware, isAdmin, exameController.uploadFiles);
router.post('/:id/enviar-email', authMiddleware, isAdmin, sendEmailLimiter, exameController.sendEmail);
router.post('/emails/:id/reenviar', authMiddleware, isAdmin, exameController.resendFailedEmail);
router.get('/:id/pdf', authMiddleware, restrictToOwnClinic, exameController.getExamPdf);
router.post('/:id/pagamento', authMiddleware, isAdmin, exameController.marcarPagamento);
router.post('/:id/desmarcar-pagamento', authMiddleware, isAdmin, exameController.desmarcarPagamento);
router.post('/marcar-pagamentos', authMiddleware, isAdmin, exameController.marcarPagamentos); // Nova rota adicionada

module.exports = router;


