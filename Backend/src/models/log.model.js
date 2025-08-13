// src/models/log.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  exame_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permitir null para tentativas de login falhas
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true, // Adicionado para suportar detalhes
  },
}, {
  timestamps: true,
});


module.exports = Log;