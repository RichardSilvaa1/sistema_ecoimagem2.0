module.exports = (models) => {
  // Log para verificar quantas vezes a função é chamada e os modelos recebidos
  console.log('associations.js chamado com modelos:', Object.keys(models));

  const {
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
  } = models;

  // Verifica modelos críticos e loga avisos
  if (!Expense) console.warn('Aviso: Modelo Expense não foi carregado');
  if (!FinancialCategory) console.warn('Aviso: Modelo FinancialCategory não foi carregado');
  if (!ExpenseRelation) console.warn('Aviso: Modelo ExpenseRelation não foi carregado');
  if (!Revenue) console.warn('Aviso: Modelo Revenue não foi carregado');

  // Associações entre Clinica e Usuario (1:1)
  if (Clinica && Usuario) {
    Clinica.belongsTo(Usuario, { foreignKey: 'user_id' });
    Usuario.hasOne(Clinica, { foreignKey: 'user_id' });
  }

  // Associações do Exame
  if (Exame && Clinica && ExamType && Usuario && TipoPagamento) {
    Exame.belongsTo(Clinica, { foreignKey: 'clinic_id' });
    Exame.belongsTo(ExamType, { foreignKey: 'exam_type_id' });
    Exame.belongsTo(Usuario, { foreignKey: 'created_by' });
    Exame.belongsTo(TipoPagamento, { foreignKey: 'tipo_pagamento_id' });
  }

  // Associações do Log
  if (Log && Exame && Usuario) {
    Log.belongsTo(Exame, { foreignKey: 'exame_id' });
    Log.belongsTo(Usuario, { foreignKey: 'user_id' });
  }

  // Associações do EmailLog
  if (EmailLog && Exame) {
    EmailLog.belongsTo(Exame, { foreignKey: 'exame_id' });
  }

  // Associações do Expense
  if (Expense && FinancialCategory) {
    Expense.belongsTo(FinancialCategory, { foreignKey: 'category_id' });
  }

  // Associações do ExpenseRelation
  if (ExpenseRelation && Expense) {
    ExpenseRelation.belongsTo(Expense, { foreignKey: 'expense_id' });
    Expense.hasMany(ExpenseRelation, { foreignKey: 'expense_id' });
  }

  // Associações do Revenue
  if (Revenue && Exame) {
    Revenue.belongsTo(Exame, { foreignKey: 'exame_id', as: 'exame' });
    Exame.hasMany(Revenue, { foreignKey: 'exame_id', as: 'revenues' });
  }
};