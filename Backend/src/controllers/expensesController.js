const { Expense, FinancialCategory, ExpenseRelation } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { Op } = require('sequelize');

// Função para criar uma nova despesa
const create = async (req, res) => {
  try {
    const { due_date, paid_at, expense_date, ...data } = req.body;

    // Determina a data de vencimento
    // Se due_date não for fornecido, assume a data da despesa.
    // Se nem a data da despesa for fornecida, assume a data atual.
    const final_due_date = due_date || expense_date || new Date();

    // Lógica para determinar o status inicial da despesa
    let status = 'pendente';
    if (paid_at) {
      status = 'pago';
    } else if (final_due_date) {
      const now = new Date();
      const dueDate = new Date(final_due_date);
      // Verifica se a data de vencimento está no passado e ajusta o status para "atrasado"
      if (dueDate < now) {
        status = 'atrasado';
      }
    }

    const expense = await Expense.create({
      ...data,
      due_date: final_due_date, // Usa a data de vencimento final
      paid_at,
      expense_date,
      status,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    res.status(400).json({ error: 'Erro ao criar despesa' });
  }
};

// Funções de list, getById, update e remove
const list = async (req, res) => {
  try {
    const { 
      page = 1, 
      size = 20, 
      category_id, 
      status, 
      payment_method, 
      due_date_start, 
      due_date_end,
      paid_at_start,
      paid_at_end,
      expense_date_start,
      expense_date_end
    } = req.query;
    
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (category_id) where.category_id = category_id;
    if (status) where.status = status;
    if (payment_method) where.payment_method = payment_method;

    if (expense_date_start && expense_date_end) {
      where.expense_date = { [Op.between]: [expense_date_start, expense_date_end] };
    }
    if (due_date_start && due_date_end) {
      where.due_date = { [Op.between]: [due_date_start, due_date_end] };
    }
    if (paid_at_start && paid_at_end) {
      where.paid_at = { [Op.between]: [paid_at_start, paid_at_end] };
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
      include: [{ model: FinancialCategory, attributes: ['id', 'name'] }]
    });

    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error('Erro ao buscar despesa:', error);
    res.status(500).json({ error: 'Erro ao buscar despesa.' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { due_date, paid_at, expense_date, ...data } = req.body;
    
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    // Lógica para determinar a data de vencimento na atualização
    const final_due_date = due_date || expense_date || expense.due_date;

    // Lógica para determinar o status na atualização
    let status = data.status || expense.status;
    if (paid_at) {
      status = 'pago';
    } else if (final_due_date) {
      const now = new Date();
      const dueDate = new Date(final_due_date);
      if (dueDate < now) {
        status = 'atrasado';
      } else {
        status = 'pendente';
      }
    }

    await expense.update({
      ...data,
      due_date: final_due_date,
      paid_at,
      expense_date,
      status,
    });

    res.status(200).json(expense);
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    res.status(400).json({ error: 'Erro ao atualizar despesa.' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    await expense.destroy();
    res.status(204).json();
  } catch (error) {
    console.error('Erro ao remover despesa:', error);
    res.status(500).json({ error: 'Erro ao remover despesa.' });
  }
};

module.exports = { create, list, getById, update, remove };