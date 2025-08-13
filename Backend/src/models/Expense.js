const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define o modelo Expense
const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200], // Descrição opcional até 200 caracteres
    },
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0.01, // Garante que o valor seja positivo
    },
  },
  payment_method: {
    type: DataTypes.ENUM('dinheiro', 'cartao de credito','cartao de debito', 'transferencia', 'pix', 'boleto'),
    allowNull: false,
  },
  
  status: {
    type: DataTypes.ENUM('pago', 'pendente', 'parcelado'),
    allowNull: false,
    defaultValue: 'pendente',
  },
  installments: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      isInt: true, // Garante que seja um número inteiro positivo
    },
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  is_recurring: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  recurrence_period: {
    type: DataTypes.ENUM('diario', 'semanal', 'mensal', 'anual'),
    allowNull: true,
  },
}, {
  tableName: 'expenses',
  underscored: true,
  timestamps: true,
  indexes: [
    { fields: ['category_id'] }, // Índice para a chave estrangeira
  ],
  hooks: {
    beforeValidate: (expense) => {
      if (expense.is_recurring && !expense.recurrence_period) {
        throw new Error('recurrence_period is required when is_recurring is true');
      }
    },
  },
});

// Exporta o modelo
module.exports = Expense;