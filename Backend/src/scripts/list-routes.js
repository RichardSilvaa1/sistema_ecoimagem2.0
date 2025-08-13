// list-routes.js
const express = require('express');
const app = express();
const routes = require('../routes'); // Importa suas rotas
const listEndpoints = require('express-list-endpoints');

// Configura as rotas (como no seu index.js)
app.use('/api', routes);

// Lista todas as rotas
console.log(listEndpoints(app));