const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const defineAssociations = require('./associations');

// Carrega os modelos com try-catch para depuração
let Usuario, Clinica, Exame, ExamType, Log, EmailLog, TipoPagamento, Expense, ExpenseRelation, FinancialCategory, Revenue;

try {
  Usuario = require('./usuario.model');
} catch (error) {
  console.error('Erro ao carregar Usuario:', error);
}
try {
  Clinica = require('./clinica.model');
} catch (error) {
  console.error('Erro ao carregar Clinica:', error);
}
try {
  Exame = require('./exame.model');
} catch (error) {
  console.error('Erro ao carregar Exame:', error);
}
try {
  ExamType = require('./examType.model');
} catch (error) {
  console.error('Erro ao carregar ExamType:', error);
}
try {
  Log = require('./log.model');
} catch (error) {
  console.error('Erro ao carregar Log:', error);
}
try {
  EmailLog = require('./emailLog.model');
} catch (error) {
  console.error('Erro ao carregar EmailLog:', error);
}
try {
  TipoPagamento = require('./tipoPagamento.model');
} catch (error) {
  console.error('Erro ao carregar TipoPagamento:', error);
}
try {
  Expense = require('./Expense');
} catch (error) {
  console.error('Erro ao carregar Expense:', error);
}
try {
  ExpenseRelation = require('./ExpenseRelation');
} catch (error) {
  console.error('Erro ao carregar ExpenseRelation:', error);
}
try {
  FinancialCategory = require('./FinancialCategory');
} catch (error) {
  console.error('Erro ao carregar FinancialCategory:', error);
}
try {
  Revenue = require('./Revenue');
} catch (error) {
  console.error('Erro ao carregar Revenue:', error);
}

// Log para verificar os modelos carregados
console.log('Modelos carregados em index.js:', {
  Usuario: !!Usuario,
  Clinica: !!Clinica,
  Exame: !!Exame,
  ExamType: !!ExamType,
  Log: !!Log,
  EmailLog: !!EmailLog,
  TipoPagamento: !!TipoPagamento,
  Expense: !!Expense,
  ExpenseRelation: !!ExpenseRelation,
  FinancialCategory: !!FinancialCategory,
  Revenue: !!Revenue,
});

// Organiza os modelos em um objeto
const models = {
  Usuario,
  Clinica,
  Exame,
  ExamType,
  Log,
  EmailLog,
  TipoPagamento,
  Expense,
  ExpenseRelation,
  FinancialCategory,
  Revenue,
  sequelize,
  Sequelize
};

// Log para verificar o objeto models
console.log('Modelos no objeto models:', Object.keys(models));

// Define as associações entre os modelos
defineAssociations(models);

// Exporta o conjunto de modelos
module.exports = models;