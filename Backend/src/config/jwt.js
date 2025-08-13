// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Configurações do JWT para autenticação, conforme especificado no escopo
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret', // Chave secreta para assinar tokens
  expiresIn: '1h', // Tokens expiram em 1 hora
};

// Exporta as configurações do JWT para uso no middleware e controlador de autenticação
module.exports = jwtConfig;