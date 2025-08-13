const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const sequelize = require('./config/database');
const models = require('./models'); // Importa o objeto models completo

// Cria a aplicação Express
const app = express();

// Configura CORS para permitir requisições do frontend
// Configura CORS para permitir requisições do frontend
const allowedOrigins = [
  'http://localhost:3001',
  'https://sistema.ecoimagemvet.com.br',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configura o parsing de JSON
app.use(express.json());

// Cria a pasta de uploads, se não existir
const fs = require('fs');
const uploadDir = './Uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configura as rotas
app.use('/api', routes);

// Configura o middleware de erros
app.use(errorMiddleware);

// Função para inicializar dados iniciais
async function inicializarDados() {
  try {
    const examTypes = [
      { name: 'Us Abdominal' },
      { name: 'Us Revisão' },
      { name: 'Cistocentese' },
      { name: 'Us Abdominal + Cisto' },
      { name: 'Ultrassom Torácico' },
    ];

    for (const type of examTypes) {
      await models.ExamType.findOrCreate({ where: { name: type.name }, defaults: type });
    }
    console.log('Tipos de exames iniciais verificados/inseridos.');
  } catch (error) {
    console.error('Erro ao inicializar os dados:', error);
    throw error;
  }
}

// Sincroniza o banco de dados e inicializa os dados
async function inicializarBanco() {
  try {
    await sequelize.sync({ force: false });
    console.log('Banco de dados sincronizado.');
    await inicializarDados();
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
    throw error;
  }
}

module.exports = { app, inicializarBanco };