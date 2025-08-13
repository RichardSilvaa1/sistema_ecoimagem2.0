const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define o modelo FinancialCategory
const FinancialCategory = sequelize.define('FinancialCategory', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 50], // Nome da categoria entre 2 e 50 caracteres
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200], // Descrição opcional até 200 caracteres
    },
  },
}, {
  tableName: 'financial_categories',
  underscored: true,
  timestamps: true,
});

// Exporta o modelo
module.exports = FinancialCategory;