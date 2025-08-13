 // Importa o módulo jsonwebtoken para verificar tokens JWT
const jwt = require('jsonwebtoken');
// Importa as configurações do JWT
const jwtConfig = require('../config/jwt');

// Middleware de autenticação: verifica o token JWT no cabeçalho Authorization
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extrai o token (Bearer <token>)
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret); // Verifica o token
    req.user = decoded; // Armazena os dados do usuário (id, role, clinic_id) na requisição
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para restringir acesso a administradores
const isAdmin = (req, res, next) => {
  if (req.user.role === 'Admin') {
    next(); // Permite acesso se for administrador
  } else {
    res.status(403).json({ error: 'Acesso negado: Apenas administradores' });
  }
};

// Middleware para restringir acesso a exames da própria clínica
const restrictToOwnClinic = async (req, res, next) => {
  if (req.user.role === 'Admin') {
    return next(); // Administradores têm acesso total
  }
  const exameId = req.params.id;
  const Exame = require('../models/exame.model');
  const exame = await Exame.findByPk(exameId);
  if (!exame || exame.clinic_id !== req.user.clinic_id) {
    return res.status(403).json({ error: 'Acesso negado: Exame não pertence à sua clínica' });
  }
  next();
};

// Exporta os middlewares
module.exports = { authMiddleware, isAdmin, restrictToOwnClinic };
