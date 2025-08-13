const TipoPagamento = require('../models/tipoPagamento.model');
const Log = require('../models/log.model');
const { check, validationResult } = require('express-validator');

// Criar tipo de pagamento (Admin)
const createTipoPagamento = [
  check('nome')
    .notEmpty()
    .isLength({ max: 50 })
    .matches(/^[a-zA-Z0-9\s-]*$/)
    .withMessage('Nome é obrigatório, máx. 50 caracteres, apenas letras, números, espaços ou hífens'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { nome, ativo = true } = req.body;
      const tipoPagamento = await TipoPagamento.create({ nome, ativo });
      await Log.create({
        user_id: req.user.id,
        action: `Criou tipo de pagamento: ${nome}`,
      });
      res.status(201).json(tipoPagamento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// Listar tipos de pagamento
const getTiposPagamento = async (req, res) => {
  try {
    const tiposPagamento = await TipoPagamento.findAll({
      where: req.query.ativo ? { ativo: req.query.ativo === 'true' } : {},
    });
    res.json(tiposPagamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar tipo de pagamento (Admin)
const updateTipoPagamento = [
  check('nome')
    .optional()
    .notEmpty()
    .isLength({ max: 50 })
    .matches(/^[a-zA-Z0-9\s-]*$/)
    .withMessage('Nome deve ter máx. 50 caracteres, apenas letras, números, espaços ou hífens'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const tipoPagamento = await TipoPagamento.findByPk(req.params.id);
      if (!tipoPagamento) {
        return res.status(404).json({ error: 'Tipo de pagamento não encontrado' });
      }
      await tipoPagamento.update(req.body);
      await Log.create({
        user_id: req.user.id,
        action: `Atualizou tipo de pagamento: ${tipoPagamento.nome}`,
      });
      res.json(tipoPagamento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// Desativar tipo de pagamento (Admin)
const deactivateTipoPagamento = async (req, res) => {
  try {
    const tipoPagamento = await TipoPagamento.findByPk(req.params.id);
    if (!tipoPagamento) {
      return res.status(404).json({ error: 'Tipo de pagamento não encontrado' });
    }
    if (!tipoPagamento.ativo) {
      return res.status(400).json({ error: 'Tipo de pagamento já está inativo' });
    }
    tipoPagamento.ativo = false;
    await tipoPagamento.save();
    await Log.create({
      user_id: req.user.id,
      action: `Desativou tipo de pagamento: ${tipoPagamento.nome}`,
    });
    res.json({ message: 'Tipo de pagamento desativado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTipoPagamento,
  getTiposPagamento,
  updateTipoPagamento,
  deactivateTipoPagamento,
};