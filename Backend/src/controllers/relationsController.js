// src/controllers/relationsController.js
const { ExpenseRelation, Expense } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');

const create = async (req, res) => {
  try {
    const { expense_id } = req.body;
    const expense = await Expense.findByPk(expense_id);
    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    const relation = await ExpenseRelation.create(req.body);
    res.status(201).json(relation);
  } catch (error) {
    console.error('Erro ao criar relação:', error);
    res.status(400).json({ error: 'Erro ao criar relação' });
  }
};

const list = async (req, res) => {
  try {
    const { page = 1, size = 20, expense_id, related_type, related_id } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (expense_id) where.expense_id = expense_id;
    if (related_type) where.related_type = related_type;
    if (related_id) where.related_id = related_id;

    const data = await ExpenseRelation.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    const response = getPagingData(data, page, limit);
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar relações:', error);
    res.status(500).json({ error: 'Erro ao listar relações' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const relation = await ExpenseRelation.findByPk(id);
    if (!relation) {
      return res.status(404).json({ error: 'Relação não encontrada' });
    }
    res.status(200).json(relation);
  } catch (error) {
    console.error('Erro ao buscar relação:', error);
    res.status(500).json({ error: 'Erro ao buscar relação' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const relation = await ExpenseRelation.findByPk(id);
    if (!relation) {
      return res.status(404).json({ error: 'Relação não encontrada' });
    }
    await relation.update(req.body);
    res.status(200).json(relation);
  } catch (error) {
    console.error('Erro ao atualizar relação:', error);
    res.status(400).json({ error: 'Erro ao atualizar relação' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const relation = await ExpenseRelation.findByPk(id);
    if (!relation) {
      return res.status(404).json({ error: 'Relação não encontrada' });
    }
    await relation.destroy();
    res.status(204).json({});
  } catch (error) {
    console.error('Erro ao deletar relação:', error);
    res.status(500).json({ error: 'Erro ao deletar relação' });
  }
};

module.exports = { create, list, getById, update, remove };