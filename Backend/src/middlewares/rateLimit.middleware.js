// src/middlewares/rateLimit.middleware.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo de 5 requisições por IP
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    },
  },
  standardHeaders: true, // Inclui cabeçalhos de rate limit
  legacyHeaders: false,
});

const sendEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Máximo de 10 requisições por IP
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Muitas tentativas de envio de e-mail. Tente novamente em 1 hora.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, sendEmailLimiter };