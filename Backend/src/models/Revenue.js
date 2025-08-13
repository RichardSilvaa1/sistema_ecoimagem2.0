const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define o modelo Revenue
const Revenue = sequelize.define('Revenue', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  exame_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'exames', // nome da tabela no banco
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
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
    type: DataTypes.ENUM('dinheiro', 'cartao', 'transferencia', 'pix', 'boleto'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('recebido', 'pendente', 'parcelado'),
    allowNull: false,
    defaultValue: 'pendente',
  },
  installments: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      isInt: true,
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
  tableName: 'revenues',
  underscored: true,
  timestamps: true,
  hooks: {
    beforeValidate: (revenue) => {
      if (revenue.is_recurring && !revenue.recurrence_period) {
        throw new Error('recurrence_period is required when is_recurring is true');
      }
    },
  },
});

module.exports = Revenue;
