 
// Importa o Nodemailer para envio de e-mails
const nodemailer = require('nodemailer');
// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Configura o transporte de e-mails usando Gmail, conforme requerido para envio de laudos
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usa o serviço Gmail
  auth: {
    user: process.env.EMAIL_USER, // E-mail configurado no .env
    pass: process.env.EMAIL_PASS, // Senha de aplicativo do Gmail
  },
});

// Exporta o transporter para uso no controlador de exames
module.exports = transporter;