// create-admin.js

const sequelize = require('../config/database'); // Ajuste o caminho se necessário
const Usuario = require('../models/usuario.model'); // Ajuste o caminho para o modelo

async function createAdmin() {
  try {
    // Sincroniza o banco de dados (sem recriar, para preservar dados existentes)
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado');

    // Cria o usuário administrador
    const admin = await Usuario.create({
      username: 'admin',
      password: 'admin123', // Use uma senha forte
      role: 'Admin',
      name: 'Administrador Principal',
    });

    console.log('Usuário administrador criado com sucesso:', admin.username);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await sequelize.close();
  }
}

createAdmin();