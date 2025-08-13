// src/controllers/expensesController.js
const { Expense, FinancialCategory, ExpenseRelation } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    res.status(400).json({ error: 'Erro ao criar despesa' });
  }
};

const list = async (req, res) => {
  try {
    const { page = 1, size = 20, category_id, status, payment_method, start_date, end_date } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (category_id) where.category_id = category_id;
    if (status) where.status = status;
    if (payment_method) where.payment_method = payment_method;
    if (start_date && end_date) {
      where.due_date = { [Op.between]: [start_date, end_date] };
    }

    const data = await Expense.findAndCountAll({
      where,
      include: [{ model: FinancialCategory, attributes: ['id', 'name'] }],
      limit,
      offset,
      order: [['due_date', 'DESC']],
    });

    const response = getPagingData(data, page, limit);
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar despesas:', error);
    res.status(500).json({ error: 'Erro ao listar despesas' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id, {
      include: [{ model: FinancialCategory }, { model: ExpenseRelation }],
    });
    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    res.status(200).json(expense);
  } catch (error) {
    console.error('Erro ao buscar despesa:', error);
    res.status(500).json({ error: 'Erro ao buscar despesa' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    await expense.update(req.body);
    res.status(200).json(expense);
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    res.status(400).json({ error: 'Erro ao atualizar despesa' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    await expense.destroy();
    res.status(204).json({});
  } catch (error) {
    console.error('Erro ao deletar despesa:', error);
    res.status(500).json({ error: 'Erro ao deletar despesa' });
  }
};

module.exports = { create, list, getById, update, remove };