const fs = require('fs');
const path = require('path');

const sequelize = require('../config/database'); // sua instância do sequelize
const modelsDir = path.join(__dirname, '../models');

console.log('📦 Estrutura dos Models:\n');

fs.readdirSync(modelsDir).forEach(file => {
  if (file.endsWith('.model.js')) {
    const modelPath = path.join(modelsDir, file);
    const model = require(modelPath); // já traz o model definido

    console.log(`Model: ${model.name || path.basename(file, '.model.js')}`);

    console.log('Campos:');
    Object.entries(model.rawAttributes).forEach(([attrName, attr]) => {
      let type = attr.type.key || attr.type.toSql ? attr.type.toSql() : attr.type.toString();
      console.log(`  - ${attrName}: ${type}`);
    });

    console.log('---------------------------------------\n');
  }
});
