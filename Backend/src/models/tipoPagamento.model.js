const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoPagamento = sequelize.define('TipoPagamento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 50],
    },
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});


module.exports = TipoPagamento;