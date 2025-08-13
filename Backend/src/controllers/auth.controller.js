// src/controllers/auth.controller.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model');
const Clinica = require('../models/clinica.model');
const Log = require('../models/log.model');
const jwtConfig = require('../config/jwt');

// Endpoint de login com validação de entrada
const login = [
  check('username').notEmpty().withMessage('Username é obrigatório'),
  check('password').notEmpty().withMessage('Senha é obrigatória'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      const usuario = await Usuario.findOne({ where: { username } });

      if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: usuario.id, role: usuario.role, clinic_id: usuario.clinic_id },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      await Log.create({
        user_id: usuario.id,
        action: 'LOGIN',
        details: `Usuário ${username} fez login`,
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// Retorna os dados do usuário logado
const getMe = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ['id', 'username', 'role', 'name', 'clinic_id'],
      include: [
        {
          model: Clinica,
          attributes: ['id', 'name', 'email'],
          required: false,
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Exporta os dois controladores corretamente
module.exports = {
  login,
  getMe,
};
