const { Expense, FinancialCategory, ExpenseRelation } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { Op } = require('sequelize');

// Função para criar uma nova despesa
const create = async (req, res) => {
  try {
    const { 
      due_date, 
      paid_at, 
      expense_date, 
      installments, // Adicionado para parcelamento
      amount,      // Adicionado para o valor
      ...data 
    } = req.body;

    const final_due_date = due_date || expense_date || new Date();

    // Lógica para despesa parcelada (recorrente com valor fixo)
    if (installments && installments > 1) {
      const numInstallments = parseInt(installments, 10);
      const expenseAmount = parseFloat(amount);
      
      const expensesToCreate = [];
      let currentDueDate = new Date(final_due_date);

      // Cria a despesa principal
      const mainExpense = await Expense.create({
        ...data,
        amount: expenseAmount,
        status: 'pendente', 
        installments: numInstallments,
        due_date: new Date(currentDueDate),
        description: `${data.description} (Parcela 1/${numInstallments})`,
        is_main: true // Adicione esta flag no seu modelo Expense
      });

      expensesToCreate.push(mainExpense);
      
      currentDueDate.setMonth(currentDueDate.getMonth() + 1);

      // Cria as demais parcelas, relacionadas à despesa principal
      for (let i = 1; i < numInstallments; i++) {
        const newExpense = {
          ...data,
          amount: expenseAmount,
          status: 'pendente', 
          installments: numInstallments,
          due_date: new Date(currentDueDate),
          description: `${data.description} (Parcela ${i + 1}/${numInstallments})`,
          main_expense_id: mainExpense.id // Relaciona com a despesa principal
        };
        expensesToCreate.push(newExpense);
        
        currentDueDate.setMonth(currentDueDate.getMonth() + 1);
      }

      await Expense.bulkCreate(expensesToCreate.slice(1)); // Cria as parcelas em lote, exceto a primeira
      const allExpenses = await Expense.findAll({
        where: {
          [Op.or]: [
            { id: mainExpense.id },
            { main_expense_id: mainExpense.id }
          ]
        },
        order: [['due_date', 'ASC']]
      });

      return res.status(201).json(allExpenses);

    } else {
      // Lógica para despesa normal (não parcelada)
      let status = 'pendente';
      if (paid_at) {
        status = 'pago';
      } else {
        const now = new Date();
        const dueDate = new Date(final_due_date);
        if (dueDate < now) {
          status = 'atrasado';
        }
      }
      
      const expense = await Expense.create({
        ...data,
        amount: parseFloat(amount),
        due_date: final_due_date,
        paid_at,
        expense_date,
        status,
        installments: 1,
        is_main: false
      });

      return res.status(201).json(expense);
    }
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
      expense_date_end,
      is_main,
      main_expense_id
    } = req.query;
    
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (category_id) where.category_id = category_id;
    if (status) where.status = status;
    if (payment_method) where.payment_method = payment_method;
    if (is_main !== undefined) where.is_main = is_main === 'true'; // Conversão de string para booleano
    if (main_expense_id) where.main_expense_id = main_expense_id;

    if (expense_date_start && expense_date_end) {
      where.expense_date = { [Op.between]: [new Date(expense_date_start), new Date(expense_date_end)] };
    }
    if (due_date_start && due_date_end) {
      where.due_date = { [Op.between]: [new Date(due_date_start), new Date(due_date_end)] };
    }
    if (paid_at_start && paid_at_end) {
      where.paid_at = { [Op.between]: [new Date(paid_at_start), new Date(paid_at_end)] };
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

    const final_due_date = due_date || expense_date || expense.due_date;

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
    
    // Se a despesa principal for removida, remova todas as parcelas relacionadas
    if (expense.is_main) {
      await Expense.destroy({
        where: {
          [Op.or]: [
            { id: expense.id },
            { main_expense_id: expense.id }
          ]
        }
      });
    } else {
      await expense.destroy();
    }

    res.status(204).json();
  } catch (error) {
    console.error('Erro ao remover despesa:', error);
    res.status(500).json({ error: 'Erro ao remover despesa.' });
  }
};

module.exports = { create, list, getById, update, remove };