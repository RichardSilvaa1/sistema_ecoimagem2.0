const { sequelize } = require('../config/database');

(async () => {
  try {
    await sequelize.query(`
      ALTER TABLE expenses
      ADD COLUMN expense_date DATE NOT NULL;
    `);
    console.log('Coluna expense_date adicionada com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao adicionar coluna expense_date:', err);
    process.exit(1);
  }
})();
