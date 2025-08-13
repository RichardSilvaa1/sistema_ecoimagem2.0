const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define o modelo ExpenseRelation
const ExpenseRelation = sequelize.define('ExpenseRelation', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  expense_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  related_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Garante que não seja uma string vazia
    },
  }, // ex: 'vehicle', 'employee', 'cost_center'
  related_id: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Garante que não seja uma string vazia
    },
  }, // Identificador externo ou UUID do recurso relacionado
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'expense_relations',
  underscored: true,
  timestamps: true,
  indexes: [
    { fields: ['expense_id'] }, // Índice para a chave estrangeira
  ],
});

// Exporta o modelo
module.exports = ExpenseRelation;