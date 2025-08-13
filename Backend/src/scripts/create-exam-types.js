// src/utils/create-exam-types.js

const sequelize = require('../config/database');
const ExamType = require('../models/examType.model');

async function createExamTypes() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado');

    await ExamType.bulkCreate([
      { name: 'Ultrassom Abdominal' },
      { name: 'Ultrassom Cardíaco' },
    ], { ignoreDuplicates: true }); // Ignora duplicatas devido à restrição unique

    console.log('Tipos de exame criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar tipos de exame:', error);
  } finally {
    await sequelize.close();
  }
}

createExamTypes();