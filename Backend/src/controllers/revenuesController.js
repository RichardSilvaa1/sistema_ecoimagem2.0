// src/controllers/revenuesController.js
const { Revenue } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { Op } = require('sequelize');

// Criar uma nova receita
const create = async (req, res) => {
  try {
    const revenue = await Revenue.create(req.body);
    res.status(201).json(revenue);
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    res.status(400).json({ error: 'Erro ao criar receita' });
  }
};

// Listar receitas com filtros e paginação
const list = async (req, res) => {
  try {
    const { page = 1, size = 20, status, payment_method, start_date, end_date } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (status) where.status = status;
    if (payment_method) where.payment_method = payment_method;
    if (start_date && end_date) {
      where.due_date = { [Op.between]: [start_date, end_date] };
    }

    const data = await Revenue.findAndCountAll({
      where,
      limit,
      offset,
      order: [['due_date', 'DESC']],
    });

    const response = getPagingData(data, page, limit);
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar receitas:', error);
    res.status(500).json({ error: 'Erro ao listar receitas' });
  }
};

// Obter uma receita por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const revenue = await Revenue.findByPk(id);
    if (!revenue) {
      return res.status(404).json({ error: 'Receita não encontrada' });
    }
    res.status(200).json(revenue);
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    res.status(500).json({ error: 'Erro ao buscar receita' });
  }
};

// Atualizar uma receita
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const revenue = await Revenue.findByPk(id);
    if (!revenue) {
      return res.status(404).json({ error: 'Receita não encontrada' });
    }
    await revenue.update(req.body);
    res.status(200).json(revenue);
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    res.status(400).json({ error: 'Erro ao atualizar receita' });
  }
};

// Deletar uma receita
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const revenue = await Revenue.findByPk(id);
    if (!revenue) {
      return res.status(404).json({ error: 'Receita não encontrada' });
    }
    await revenue.destroy();
    res.status(204).json({});
  } catch (error) {
    console.error('Erro ao deletar receita:', error);
    res.status(500).json({ error: 'Erro ao deletar receita' });
  }
};

module.exports = { create, list, getById, update, remove };