// src/config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Carrega dotenv APENAS se não estiver em produção
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let sequelize;

if (process.env.DB_DIALECT === 'sqlite') {
    // Ambiente local com SQLite
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', 'database.sqlite'),
        logging: false,
    });
} else if (process.env.DB_DIALECT === 'postgres') {
    // Ambiente produção Railway com PostgreSQL
    // Adicione um log para depuração
    console.log('DEBUG: DB_DIALECT é postgres. Verificando DATABASE_URL...');
    console.log('DEBUG: process.env.DATABASE_URL =', process.env.DATABASE_URL);

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL não está definida no ambiente de produção para PostgreSQL!');
    }

    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        // protocol: 'postgres', // Esta linha geralmente não é necessária quando a URL é fornecida
        dialectOptions: {
            ssl: {
                require: true, // É importante, muitos provedores de nuvem exigem SSL
                rejectUnauthorized: false // Desabilita a verificação do certificado. Necessário para alguns provedores de nuvem que usam certificados auto-assinados ou não verificáveis
            },
        },
        logging: false,
        // Adicione outras opções que você possa precisar, como pool de conexões, etc.
    });
} else {
    throw new Error(`DB_DIALECT inválido ou não suportado: ${process.env.DB_DIALECT}`);
}

module.exports = sequelize;