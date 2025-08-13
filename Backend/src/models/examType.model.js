 // Importa tipos de dados do Sequelize
const { DataTypes } = require('sequelize');
// Importa a instância do Sequelize
const sequelize = require('../config/database');

// Define o modelo ExamType para tipos de exames pré-definidos
const ExamType = sequelize.define('ExamType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Chave primária
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Nome do tipo de exame, único
  },
});

// Exporta o modelo ExamType
module.exports = ExamType;
