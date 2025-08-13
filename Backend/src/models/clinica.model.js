const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Clinica = sequelize.define('Clinica', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, // Permite que o e-mail seja nulo
    // Removido unique: true para evitar conflitos com múltiplos valores nulos
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Já permite clínicas sem usuário
  },
});

module.exports = Clinica;