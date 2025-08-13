 // Importa tipos de dados do Sequelize
const { DataTypes } = require('sequelize');
// Importa a instância do Sequelize
const sequelize = require('../config/database');
// Importa modelo relacionado
const Exame = require('./exame.model');

// Define o modelo EmailLog para registrar envios de e-mails, conforme escopo
const EmailLog = sequelize.define('EmailLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Chave primária
  },
  exame_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Relaciona com Exame
  },
  sent_to: {
    type: DataTypes.STRING,
    allowNull: false, // E-mail do destinatário
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Data e hora do envio
  },
  status: {
    type: DataTypes.ENUM('Enviado', 'Falhou'),
    allowNull: false, // Status do envio
  },
  error_message: {
    type: DataTypes.STRING,
    allowNull: true, // Mensagem de erro, se houver
  },
});

// Define associação: EmailLog pertence a Exame
EmailLog.belongsTo(Exame, { foreignKey: 'exame_id' });

// Exporta o modelo EmailLog
module.exports = EmailLog;
