// src/controllers/reportsController.js
const { Expense, Revenue, FinancialCategory, sequelize } = require('../models');
const { Op } = require('sequelize');
const exportService = require('../services/exportService');

const summary = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const where = {};
    if (start_date && end_date) {
      where.due_date = { [Op.between]: [start_date, end_date] };
    }

    const totalExpenses = await Expense.sum('amount', { where }) || 0;
    const totalRevenues = await Revenue.sum('amount', { where }) || 0;
    const profit = Number(totalRevenues) - Number(totalExpenses);

    res.json({ totalExpenses, totalRevenues, profit });
  } catch (error) {
    console.error('Erro ao gerar resumo:', error);
    res.status(500).json({ error: 'Erro ao gerar resumo' });
  }
};

const byCategory = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const where = {};
    if (start_date && end_date) {
      where.due_date = { [Op.between]: [start_date, end_date] };
    }

    const rows = await Expense.findAll({
      attributes: ['category_id', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      where,
      group: ['category_id'],
      include: [{ model: FinancialCategory, attributes: ['name'] }],
    });

    res.json(rows);
  } catch (error) {
    console.error('Erro ao gerar relatório por categoria:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório por categoria' });
  }
};

const monthly = async (req, res) => {
  try {
    const { year } = req.query;
    const y = year || new Date().getFullYear();

    const expenses = await sequelize.query(
      `SELECT DATE_TRUNC('month', due_date) as month, SUM(amount) as total FROM expenses WHERE EXTRACT(YEAR FROM due_date) = :y GROUP BY 1 ORDER BY 1`,
      { replacements: { y }, type: sequelize.QueryTypes.SELECT }
    );

    const revenues = await sequelize.query(
      `SELECT DATE_TRUNC('month', due_date) as month, SUM(amount) as total FROM revenues WHERE EXTRACT(YEAR FROM due_date) = :y GROUP BY 1 ORDER BY 1`,
      { replacements: { y }, type: sequelize.QueryTypes.SELECT }
    );

    res.json({ expenses, revenues });
  } catch (error) {
    console.error('Erro ao gerar relatório mensal:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório mensal' });
  }
};

const exportReport = async (req, res) => {
  try {
    const { format = 'xlsx', start_date, end_date } = req.query;
    const where = {};
    if (start_date && end_date) {
      where.due_date = { [Op.between]: [start_date, end_date] };
    }

    const expenses = await Expense.findAll({ where, include: [{ model: FinancialCategory }] });
    const revenues = await Revenue.findAll({ where });

    if (format === 'xlsx') {
      const buffer = await exportService.toExcel({ expenses, revenues });
      res.setHeader('Content-Disposition', 'attachment; filename=financial_export.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buffer);
    }

    if (format === 'pdf') {
      const buffer = await exportService.toPDF({ expenses, revenues });
      res.setHeader('Content-Disposition', 'attachment; filename=financial_export.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(buffer);
    }

    res.status(400).json({ error: 'Erro ao exportar: formato inválido' });
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    res.status(500).json({ error: 'Erro ao exportar relatório' });
  }
};

module.exports = { summary, byCategory, monthly, exportReport };
