const Clinica = require('../models/clinica.model');
const Usuario = require('../models/usuario.model');
const Log = require('../models/log.model');
const { check, validationResult } = require('express-validator');

// Endpoint para criar uma clínica (apenas Admin)
const createClinica = [
  // Validações de entrada
  check('name').notEmpty().withMessage('Nome da clínica é obrigatório'),
  check('email')
    .optional({ checkFalsy: true }) // Aceita null, undefined ou string vazia
    .custom((value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new Error('E-mail inválido');
      }
      return true;
    }),
  check('username').optional().notEmpty().withMessage('Username não pode ser vazio'),
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  check('responsible').optional().notEmpty().withMessage('Responsável não pode ser vazio'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, username, password, responsible } = req.body;

    try {
      let usuario = null;
      let clinica;

      // Verifica se os campos para criar usuário foram fornecidos
      if (username && password && responsible) {
        // Cria o usuário da clínica
        usuario = await Usuario.create({
          username,
          password,
          role: 'Clínica',
          name: responsible,
        });
      }

      // Cria a clínica com ou sem usuário e com ou sem e-mail
      clinica = await Clinica.create({
        name,
        email: email || null, // Define como null se o e-mail não for fornecido
        user_id: usuario ? usuario.id : null,
      });

      // Se usuário foi criado, atualiza com o clinic_id
      if (usuario) {
        await usuario.update({ clinic_id: clinica.id });
      }

      // Registra a criação no log
      await Log.create({
        user_id: req.user.id,
        action: `Criou clínica: ${clinica.name}${usuario ? ` com usuário: ${username}` : ' sem usuário'}`,
      });

      res.status(201).json(clinica);
    } catch (error) {
      console.error('Erro no endpoint createClinica:', error);
      res.status(400).json({ error: error.message });
    }
  },
];

// Endpoint para listar todas as clínicas (apenas Admin)
const getClinicas = async (req, res) => {
  try {
    const clinicas = await Clinica.findAll({
      include: [{ model: Usuario, attributes: ['username', 'name'], required: false }],
    });
    res.json(clinicas);
  } catch (error) {
    console.error('Erro no endpoint getClinicas:', error);
    res.status(400).json({ error: error.message });
  }
};

// Endpoint para atualizar uma clínica (apenas Admin)
const updateClinica = [
  // Validações de entrada opcionais
  check('name').optional().notEmpty().withMessage('Nome da clínica não pode ser vazio'),
  check('email')
    .optional({ checkFalsy: true }) // Aceita null, undefined ou string vazia
    .custom((value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new Error('E-mail inválido');
      }
      return true;
    }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      // Busca a clínica pelo ID
      const clinica = await Clinica.findByPk(req.params.id);
      if (!clinica) {
        return res.status(404).json({ error: 'Clínica não encontrada' });
      }

      // Atualiza os campos fornecidos
      if (name) clinica.name = name;
      if (email !== undefined) clinica.email = email; // Permite email null ou válido

      // Salva as alterações
      await clinica.save();

      // Registra a atualização no log
      await Log.create({
        user_id: req.user.id,
        action: `Atualizou clínica: ${clinica.name}`,
      });

      res.json({ message: 'Clínica atualizada com sucesso', clinica });
    } catch (error) {
      console.error('Erro no endpoint updateClinica:', error);
      res.status(400).json({ error: error.message });
    }
  },
];

// Endpoint para deletar uma clínica (apenas Admin)
const deleteClinica = async (req, res) => {
  try {
    // Busca a clínica pelo ID
    const clinica = await Clinica.findByPk(req.params.id);
    if (!clinica) {
      return res.status(404).json({ error: 'Clínica não encontrada' });
    }

    // Busca o usuário associado, se existir
    if (clinica.user_id) {
      const usuario = await Usuario.findOne({ where: { id: clinica.user_id } });
      if (usuario) {
        await usuario.destroy();
      }
    }

    // Deleta a clínica
    await clinica.destroy();

    // Registra a exclusão no log
    await Log.create({
      user_id: req.user.id,
      action: `Deletou clínica: ${clinica.name}`,
    });

    res.json({ message: 'Clínica deletada com sucesso' });
  } catch (error) {
    console.error('Erro no endpoint deleteClinica:', error);
    res.status(400).json({ error: error.message });
  }
};

// Exporta os controladores
module.exports = { createClinica, getClinicas, updateClinica, deleteClinica };