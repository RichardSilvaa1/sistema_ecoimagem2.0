// src/controllers/categoriesController.js
const { FinancialCategory } = require('../models');

const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await FinancialCategory.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(400).json({ error: 'Erro ao criar categoria' });
  }
};

const list = async (req, res) => {
  try {
    const categories = await FinancialCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro ao listar categorias' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await FinancialCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    await category.update({ name, description });
    res.json(category);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(400).json({ error: 'Erro ao atualizar categoria' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await FinancialCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    await category.destroy();
    res.status(204).json({});
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
};

module.exports = { create, list, update, delete: remove };