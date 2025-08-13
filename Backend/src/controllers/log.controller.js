// Importa os modelos necessários
const Log = require('../models/log.model');
const EmailLog = require('../models/emailLog.model');

// Endpoint para listar logs gerais (apenas Admin)
const getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [
        { model: require('../models/exame.model'), attributes: ['animal_name'], required: false, as: 'Exame' },
        { model: require('../models/usuario.model'), attributes: ['name'], as: 'Usuario' },
      ],
      order: [['timestamp', 'DESC']],
      limit: 50,
    });
    res.json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs gerais:', error);
    res.status(400).json({ error: 'Erro ao buscar logs gerais' });
  }
};

// Endpoint para listar logs de email (apenas Admin)
const getEmailLogs = async (req, res) => {
  try {
    const { id } = req.params; // exame_id é opcional
    const whereClause = id ? { exame_id: id } : {};

    const emailLogs = await EmailLog.findAll({
      where: whereClause,
      include: [
        {
          model: require('../models/exame.model'),
          attributes: ['animal_name'],
          required: false,
          as: 'Exame',
          include: [
            {
              model: require('../models/clinica.model'),
              attributes: ['name'],
              required: false,
              as: 'Clinica',
            },
          ],
        },
      ],
      order: [['sent_at', 'DESC']],
      limit: 50,
    });

    if (!emailLogs || emailLogs.length === 0) {
      return res.status(404).json({ error: 'Nenhum log de e-mail encontrado' });
    }

    res.json(emailLogs);
  } catch (error) {
    console.error('Erro ao buscar logs de email:', error);
    res.status(400).json({ error: 'Erro ao buscar logs de e-mails' });
  }
};

// Exporta os controladores
module.exports = { getLogs, getEmailLogs };
