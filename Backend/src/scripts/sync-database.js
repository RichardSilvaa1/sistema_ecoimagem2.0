const sequelize = require('../config/database');

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado');
  } catch (error) {
    console.error('Erro ao sincronizar:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();