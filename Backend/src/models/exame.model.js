const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exame = sequelize.define('Exame', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  animal_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tutor: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[a-zA-ZÀ-ÿ\s]*$/,
      len: [0, 100],
    },
  },
  veterinario: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[a-zA-ZÀ-ÿ0-9\s().,°\-\/]*$/,
      len: [0, 100],
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  exam_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pdf_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_paths: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Concluído'),
    defaultValue: 'Pendente',
  },
  clinic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pago: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  observacaoPagamento: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tipo_pagamento_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'TipoPagamentos',
      key: 'id',
    },
  },
}, {
  indexes: [
    { fields: ['clinic_id'], name: 'idx_exames_clinic_id' },
    { fields: ['exam_type_id'], name: 'idx_exames_exam_type_id' },
    { fields: ['created_by'], name: 'idx_exames_created_by' },
    { fields: ['tipo_pagamento_id'], name: 'idx_exames_tipo_pagamento_id' },
    { fields: ['date'], name: 'idx_exames_date' },
    { fields: ['status'], name: 'idx_exames_status' },
    { fields: ['pago'], name: 'idx_exames_pago' },
  ],
});

module.exports = Exame;
