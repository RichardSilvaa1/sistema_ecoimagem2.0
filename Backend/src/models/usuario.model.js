// src/models/usuario.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

// Define o modelo Usuario
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50], // Username entre 3 e 50 caracteres
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], // Senha com pelo menos 6 caracteres
    },
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Clínica'),
    allowNull: false,
  },
  clinic_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Apenas para usuários do tipo Clínica
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100], // Nome entre 2 e 100 caracteres
    },
  },
}, {
  hooks: {
    beforeSave: async (usuario) => {
      if (usuario.changed('password')) {
        usuario.password = await bcrypt.hash(usuario.password, 10);
      }
    },
  },
  timestamps: true,
});

// Método de instância para verificar senha
Usuario.prototype.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Exporta o modelo
module.exports = Usuario;