// src/controllers/usuario.controller.js

const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model');
const Clinica = require('../models/clinica.model');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Apenas administradores podem criar usuários
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Apenas administradores podem criar usuários' });
    }

    const { username, password, name, role, clinic, existingClinicId } = req.body;

    // Verifica se o role é válido
    if (!['Admin', 'Clínica'].includes(role)) {
      return res.status(400).json({ message: 'Role inválido. Use Admin ou Clínica' });
    }

    // Verifica se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ where: { username } });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'Usuário com este nome de usuário já existe' });
    }

    if (clinic && existingClinicId) {
      return res.status(400).json({ message: 'Você só pode criar uma nova clínica ou associar a uma existente, não ambos.' });
    }

    if (role === 'Clínica' && !clinic && !existingClinicId) {
      return res.status(400).json({ message: 'Usuários com o papel de Clínica devem ser associados a uma clínica.' });
    }

    // Cria o usuário
    const usuario = await Usuario.create({
      username,
      password,
      role,
      name,
    });

    // Se for do tipo Clínica, cria ou associa a clínica
    let clinica = null;
    if (role === 'Clínica') {
      if (clinic) {
        // Verifica se a clínica já existe pelo nome ou email
        const clinicaExistente = await Clinica.findOne({
          where: {
            [Op.or]: [
              { name: clinic.name },
              { email: clinic.email },
            ],
          },
        });
        if (clinicaExistente) {
          return res.status(409).json({ message: 'Clínica com este nome ou email já existe' });
        }

        clinica = await Clinica.create({
          name: clinic.name,
          email: clinic.email,
          user_id: usuario.id,
        });
        usuario.clinic_id = clinica.id;
        await usuario.save();
      } else if (existingClinicId) {
        const clinicaExistente = await Clinica.findByPk(existingClinicId);
        if (!clinicaExistente) {
          return res.status(404).json({ message: 'Clínica com este ID não foi encontrada.' });
        }
        usuario.clinic_id = existingClinicId;
        await usuario.save();
        clinica = clinicaExistente;
      }
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario: { id: usuario.id, username, role, name, clinic_id: usuario.clinic_id },
      clinica: clinica ? { id: clinica.id, name: clinica.name, email: clinica.email } : null,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.fields.includes('username')) {
        return res.status(409).json({ message: 'Usuário com este nome de usuário já existe' });
      }
      if (role === 'Clínica' && clinic && (error.fields.includes('name') || error.fields.includes('email'))) {
        return res.status(409).json({ message: 'Clínica com este nome ou email já existe' });
      }
    }
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    // Apenas administradores podem consultar usuários
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Apenas administradores podem consultar usuários' });
    }

    const { role } = req.query; // Filtro opcional por role (Admin ou Clínica)

    const where = {};
    if (role && ['Admin', 'Clínica'].includes(role)) {
      where.role = role;
    }

    const usuarios = await Usuario.findAll({
      where,
      attributes: ['id', 'username', 'role', 'name', 'clinic_id'],
      include: [
        {
          model: Clinica,
          attributes: ['id', 'name', 'email'],
          required: false,
        },
      ],
    });

    res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Apenas administradores podem alterar senhas
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Apenas administradores podem alterar senhas' });
    }

    const { userId } = req.params; // ID do usuário a ter a senha alterada
    const { password } = req.body; // Nova senha

    // Busca o usuário pelo ID
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualiza a senha
    usuario.password = password; // Assumindo que o modelo já faz o hash da senha
    await usuario.save();

    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // Apenas administradores podem deletar usuários
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Apenas administradores podem deletar usuários' });
    }

    const { userId } = req.params; // ID do usuário a ser deletado

    // Busca o usuário pelo ID
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Deleta o usuário (a clínica associada será deletada automaticamente se configurado o CASCADE)
    await usuario.destroy();

    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};