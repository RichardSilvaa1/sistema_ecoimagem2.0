// src/controllers/examController.js
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { isAdmin } = require('../middlewares/auth.middleware');

// Importação dos modelos
const Exame = require('../models/exame.model');
const Clinica = require('../models/clinica.model');
const ExamType = require('../models/examType.model');
const TipoPagamento = require('../models/tipoPagamento.model');
const Log = require('../models/log.model');
const Revenue = require('../models/Revenue');
const EmailLog = require('../models/emailLog.model');
const { EmailService } = require('../services/email.service');

// Middleware para buscar o animal
const fetchAnimalName = async (req, res, next) => {
  try {
    const exame = await Exame.findByPk(req.params.id);
    if (!exame) {
      return res.status(404).json({ error: 'Exame não encontrado' });
    }
    if (!exame.animal_name) {
      return res.status(400).json({ error: 'Exame não possui nome do animal' });
    }
    req.animalName = exame.animal_name;
    next();
  } catch (error) {
    console.error('Erro no middleware fetchAnimalName:', error);
    res.status(400).json({ error: error.message });
  }
};

// Configuração do multer para upload
const UPLOADS_DIR = '/app/Uploads'; // Caminho absoluto do volume montado

// Criar o diretório se não existir
async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (error) {
    console.error('Erro ao criar diretório de uploads:', error);
  }
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir(); // Garante que o diretório existe
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const prefix = file.mimetype === 'application/pdf' ? 'exame' : 'image';
    const timestamp = Date.now();
    if (!req.animalName || req.animalName.trim() === '') {
      return cb(new Error('Nome do animal não encontrado ou vazio'));
    }
    let animalName = req.animalName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/gi, '');
    if (!animalName) {
      return cb(new Error('Nome do animal inválido após formatação'));
    }
    const fileName = `${prefix}_${animalName}_${timestamp}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido: Apenas PDF, JPEG ou PNG'));
    }
  },
}).array('files', 21);

const createExame = [
  check('animal_name').notEmpty().withMessage('Nome do animal é obrigatório'),
  check('date').isISO8601().toDate().withMessage('Data inválida'),
  check('exam_type_id').isInt().withMessage('Tipo de exame inválido'),
  check('value').isFloat({ min: 0 }).withMessage('Valor deve ser positivo'),
  check('clinic_id').isInt().withMessage('Clínica inválida'),
  check('tipo_pagamento_id').optional().isInt().withMessage('Tipo de pagamento deve ser um número inteiro'),
  check('veterinario').optional().matches(/^[a-zA-ZÀ-ÿ0-9\s().,°\-\/]*$/).withMessage('Nome do veterinário inválido'),
  check('pago').optional().isBoolean().withMessage('Campo pago deve ser um booleano'),
  check('observacaoPagamento').optional().isLength({ max: 255 }).withMessage('Observação deve ter máx. 255 caracteres'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { animal_name, tutor, veterinario, date, exam_type_id, value, clinic_id, tipo_pagamento_id, pago, observacaoPagamento } = req.body;
    const userId = req.user.id;

    const t = await sequelize.transaction();

    try {
      const clinica = await Clinica.findByPk(clinic_id, { transaction: t });
      const examType = await ExamType.findByPk(exam_type_id, { transaction: t });
      if (!clinica || !examType) {
        await t.rollback();
        return res.status(404).json({ error: 'Clínica ou tipo de exame não encontrado' });
      }

      let tipoPagamentoNome = null;
      let paymentMethod = 'dinheiro'; // padrão
      if (tipo_pagamento_id) {
        const tipoPagamento = await TipoPagamento.findByPk(tipo_pagamento_id, { transaction: t });
        if (!tipoPagamento || !tipoPagamento.ativo) {
          await t.rollback();
          return res.status(400).json({ error: 'Tipo de pagamento inválido ou inativo' });
        }
        tipoPagamentoNome = tipoPagamento.nome;
        paymentMethod = tipoPagamento.slug || tipoPagamento.nome.toLowerCase();
      }

      // Criação do exame
      const exame = await Exame.create({
        animal_name,
        tutor,
        veterinario: veterinario || null,
        date,
        exam_type_id,
        value,
        clinic_id,
        tipo_pagamento_id: tipo_pagamento_id || null,
        pago: pago || false,
        observacaoPagamento: observacaoPagamento || null,
        created_by: userId,
        status: 'Pendente',
      }, { transaction: t });

      // Se marcado como pago, criar receita automaticamente
      if (pago) {
        await Revenue.create({
          exame_id: exame.id,
          description: `Receita do exame ID ${exame.id}`,
          amount: value,
          status: 'recebido',
          payment_method: paymentMethod,
          due_date: new Date(),
          received_date: new Date(),
          notes: `Receita gerada automaticamente na criação do exame marcado como pago. Obs: ${observacaoPagamento || ''}`,
        }, { transaction: t });
      }

      // Criar log
      const logDetails = [
        tipo_pagamento_id ? `Tipo de pagamento associado: ${tipoPagamentoNome}` : null,
        veterinario ? `Veterinário: ${veterinario}` : 'Veterinário: Nenhum',
        pago ? `Pagamento marcado: ${observacaoPagamento || 'Sem observação'}` : null,
      ].filter(Boolean).join(', ');

      await Log.create({
        exame_id: exame.id,
        user_id: userId,
        action: 'Criou exame',
        details: logDetails || 'Nenhum detalhe adicional',
      }, { transaction: t });

      await t.commit();

      const exameResponse = await Exame.findByPk(exame.id, {
        include: [
          { model: ExamType, attributes: ['name'] },
          { model: Clinica, attributes: ['name'] },
          { model: TipoPagamento, attributes: ['nome'], required: false },
        ],
      });

      const plainExame = exameResponse.get({ plain: true });
      plainExame.clinic_name = plainExame.Clinica ? plainExame.Clinica.name : 'N/A';
      delete plainExame.Clinica;
      delete plainExame.dataPagamento;

      res.status(201).json(plainExame);
    } catch (error) {
      await t.rollback();
      console.error('Erro no endpoint createExame:', error);
      res.status(400).json({ error: error.message });
    }
  },
];

// Endpoint para listar exames com filtros e paginação
const getExames = async (req, res) => {
  const { startDate, endDate, exam_type_id, animal_name, tutor, veterinario, status, pago, page, clinic_name, tipo_pagamento_id } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limit = 10; // Fixado em 10 exames por página
  const offset = (pageNumber - 1) * limit;

  const where = {};
  if (req.user.role === 'Clínica') {
    where.clinic_id = req.user.clinic_id;
  }

  // Verifica se algum filtro foi aplicado
  const hasFilters = startDate || endDate || exam_type_id || animal_name || tutor || veterinario || status || pago || clinic_name || tipo_pagamento_id;

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    where.date = { [Op.between]: [start, end] };
  }
  if (exam_type_id) where.exam_type_id = exam_type_id;

  // Filtros case-insensitive
  const isPostgreSQL = sequelize.getDialect() === 'postgres';

  if (animal_name) {
    if (isPostgreSQL) {
      where.animal_name = { [Op.iLike]: `%${animal_name}%` };
    } else {
      where.animal_name = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('animal_name')),
        'LIKE',
        `%${animal_name.toLowerCase()}%`
      );
    }
  }

  if (tutor) {
    if (isPostgreSQL) {
      where.tutor = { [Op.iLike]: `%${tutor}%` };
    } else {
      where.tutor = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('tutor')),
        'LIKE',
        `%${tutor.toLowerCase()}%`
      );
    }
  }

  if (veterinario) {
    if (isPostgreSQL) {
      where.veterinario = { [Op.iLike]: `%${veterinario}%` };
    } else {
      where.veterinario = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('veterinario')),
        'LIKE',
        `%${veterinario.toLowerCase()}%`
      );
    }
  }

  if (status) where.status = status;
  if (pago) where.pago = pago === 'true';
  if (tipo_pagamento_id) where.tipo_pagamento_id = parseInt(tipo_pagamento_id);

  const clinicaWhere = {};
  if (clinic_name && req.user.role === 'Admin') {
    if (isPostgreSQL) {
      clinicaWhere.name = { [Op.iLike]: `%${clinic_name}%` };
    } else {
      clinicaWhere.name = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('Clinica.name')),
        'LIKE',
        `%${clinic_name.toLowerCase()}%`
      );
    }
  }

  try {
    console.log('Filtros aplicados em getExames:', { where, clinicaWhere, pageNumber, limit, offset });

    // Define limite e offset com base na presença de filtros
    let queryLimit = limit;
    let queryOffset = offset;

    if (!hasFilters) {
      // Sem filtros, retorna até 25 exames mais recentes, divididos em páginas de 10
      queryLimit = Math.min(limit, 25 - offset); // Garante que não ultrapasse 25 exames
      queryOffset = offset;
      if (offset >= 25) {
        // Se o offset ultrapassar 25, retorna vazio
        return res.json({
          exames: [],
          totalPages: Math.ceil(25 / limit),
          totalCount: 25,
        });
      }
    }

    const { count, rows } = await Exame.findAndCountAll({
      where,
      include: [
        { model: ExamType, attributes: ['name'] },
        { model: TipoPagamento, attributes: ['nome'], required: false },
        {
          model: Clinica,
          attributes: ['name'],
          where: clinicaWhere,
          required: !!clinic_name,
        },
      ],
      order: [['date', 'DESC']],
      limit: queryLimit,
      offset: queryOffset,
    });

    const examesResponse = rows.map((exame) => {
      const examePlain = exame.get({ plain: true });
      examePlain.clinic_name = examePlain.Clinica ? examePlain.Clinica.name : 'N/A';
      delete examePlain.Clinica;
      delete examePlain.dataPagamento;
      return examePlain;
    });

    // Ajusta totalPages e totalCount
    const totalCount = hasFilters ? count : Math.min(count, 25);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    await Log.create({
      user_id: req.user.id,
      action: 'Visualizou lista de exames',
    });

    res.json({
      exames: examesResponse,
      totalPages,
      totalCount,
    });

    console.log('Resposta enviada em getExames:', { totalCount, totalPages, examesCount: examesResponse.length });
  } catch (error) {
    console.error('Erro no endpoint getExames:', error);
    res.status(400).json({ error: error.message });
  }
};

// Endpoint para obter detalhes de um exame
const getExame = async (req, res) => {
  try {
    const exame = await Exame.findByPk(req.params.id, {
      include: [
        { model: ExamType, attributes: ['name'] },
        { model: TipoPagamento, attributes: ['nome'], required: false },
        { model: Clinica, attributes: ['name'] },
      ],
    });
    if (!exame) {
      return res.status(404).json({ error: 'Exame não encontrado' });
    }
    const exameResponse = { ...exame.get({ plain: true }) };
    exameResponse.clinic_name = exameResponse.Clinica ? exameResponse.Clinica.name : 'N/A';
    delete exameResponse.Clinica;
    delete exameResponse.dataPagamento;
    await Log.create({
      exame_id: exame.id,
      user_id: req.user.id,
      action: 'Visualizou exame',
    });
    res.json(exameResponse);
  } catch (error) {
    console.error('Erro no endpoint getExame:', error);
    res.status(400).json({ error: error.message });
  }
};

// Endpoint para atualizar um exame (apenas Admin)
const updateExame = [
  check('animal_name').optional().notEmpty().withMessage('Nome do animal é obrigatório'),
  check('date').optional().isISO8601().toDate().withMessage('Data inválida'),
  check('exam_type_id').optional().isInt().withMessage('Tipo de exame inválido'),
  check('value').optional().isFloat({ min: 0 }).withMessage('Valor deve ser positivo'),
  check('clinic_id').optional().isInt().withMessage('Clínica inválida'),
  check('tipo_pagamento_id')
    .optional()
    .custom((value, { req }) => {
      if (req.body.pago && value == null) {
        throw new Error('Tipo de pagamento é obrigatório quando o exame está marcado como pago');
      }
      if (value != null && !Number.isInteger(Number(value))) {
        throw new Error('Tipo de pagamento deve ser um número inteiro');
      }
      return true;
    }),
  check('veterinario').optional().matches(/^[a-zA-ZÀ-ÿ0-9\s().,°\-\/]*$/).withMessage('Nome do veterinário inválido'),
  check('pago').optional().isBoolean().withMessage('Campo pago deve ser um booleano'),
  check('observacaoPagamento').optional().isLength({ max: 255 }).withMessage('Observação deve ter máx. 255 caracteres'),
  isAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const t = await sequelize.transaction();
    try {
      const exame = await Exame.findByPk(req.params.id, { transaction: t });
      if (!exame) {
        await t.rollback();
        return res.status(404).json({ error: 'Exame não encontrado' });
      }
      if (req.body.clinic_id) {
        const clinica = await Clinica.findByPk(req.body.clinic_id, { transaction: t });
        if (!clinica) {
          await t.rollback();
          return res.status(404).json({ error: 'Clínica não encontrada' });
        }
      }
      if (req.body.exam_type_id) {
        const examType = await ExamType.findByPk(req.body.exam_type_id, { transaction: t });
        if (!examType) {
          await t.rollback();
          return res.status(404).json({ error: 'Tipo de exame não encontrado' });
        }
      }

      let tipoPagamentoNome = 'Nenhum';
      let paymentMethod = 'dinheiro'; // padrão
      if (req.body.tipo_pagamento_id) {
        const tipoPagamento = await TipoPagamento.findByPk(req.body.tipo_pagamento_id, { transaction: t });
        if (!tipoPagamento || !tipoPagamento.ativo) {
          await t.rollback();
          return res.status(400).json({ error: 'Tipo de pagamento inválido ou inativo' });
        }
        tipoPagamentoNome = tipoPagamento.nome;
        paymentMethod = tipoPagamento.slug || tipoPagamento.nome.toLowerCase();
      }

      // Verificar se o exame está sendo marcado como pago
      const wasNotPaid = !exame.pago; // Estado anterior do campo pago
      const willBePaid = req.body.pago === true; // Novo estado do campo pago

      // Atualizar o exame
      await exame.update(req.body, { transaction: t });

      // Criar receita se o exame foi marcado como pago e não estava pago antes
      if (wasNotPaid && willBePaid && exame.value && exame.value > 0) {
        await Revenue.create(
          {
            exame_id: exame.id, // Vincular exame corretamente
            description: `Receita do exame ID ${exame.id}`,
            amount: exame.value,
            status: 'recebido',
            payment_method: paymentMethod,
            due_date: new Date(),
            received_date: new Date(),
            notes: `Receita gerada automaticamente ao marcar exame como pago na atualização. Obs: ${req.body.observacaoPagamento || ''}`,
          },
          { transaction: t }
        );
      }

      // Criar log
      const logDetails = [
        req.body.veterinario ? `Veterinário atualizado: ${req.body.veterinario}` : null,
        willBePaid && wasNotPaid ? `Marcado como pago: ${req.body.observacaoPagamento || 'Sem observação'}` : null,
      ].filter(Boolean).join(', ');

      await Log.create(
        {
          exame_id: exame.id,
          user_id: req.user.id,
          action: 'Editou exame',
          details: logDetails || 'Nenhum detalhe adicional',
        },
        { transaction: t }
      );

      await t.commit();

      const updatedExame = await Exame.findByPk(exame.id, {
        include: [
          { model: ExamType, attributes: ['name'] },
          { model: TipoPagamento, attributes: ['nome'], required: false },
          { model: Clinica, attributes: ['name'] },
        ],
      });
      const plainExame = updatedExame.get({ plain: true });
      plainExame.clinic_name = plainExame.Clinica ? plainExame.Clinica.name : 'N/A';
      delete plainExame.Clinica;
      delete plainExame.dataPagamento;

      res.json(plainExame);
    } catch (error) {
      await t.rollback();
      console.error('Erro no endpoint updateExame:', error);
      res.status(400).json({ error: error.message });
    }
  },
];

// Endpoint para excluir um exame (apenas Admin)
const deleteExame = [
  isAdmin,
  async (req, res) => {
    try {
      const exame = await Exame.findByPk(req.params.id);
      if (!exame) {
        return res.status(404).json({ error: 'Exame não encontrado' });
      }

      const t = await sequelize.transaction();

      try {
        await Log.destroy({
          where: { exame_id: exame.id },
          transaction: t,
        });

        await EmailLog.destroy({
          where: { exame_id: exame.id },
          transaction: t,
        });

        if (exame.pdf_path) {
          try {
            await fs.unlink(exame.pdf_path);
          } catch (fileError) {
            console.error(`Erro ao excluir arquivo PDF ${exame.pdf_path}:`, fileError.message);
          }
        }
        if (exame.image_paths && Array.isArray(exame.image_paths)) {
          for (const filePath of exame.image_paths) {
            try {
              await fs.unlink(filePath);
            } catch (fileError) {
              console.error(`Erro ao excluir arquivo de imagem ${filePath}:`, fileError.message);
            }
          }
        }

        await exame.destroy({ transaction: t });

        await t.commit();

        await Log.create({
          exame_id: null,
          user_id: req.user.id,
          action: 'Deletou exame',
          details: `Exame ID: ${exame.id}, Animal: ${exame.animal_name}, Veterinário: ${exame.veterinario || 'Nenhum'}`,
        });

        res.json({ message: 'Exame deletado com sucesso' });
      } catch (error) {
        await t.rollback();
        console.error('Erro ao excluir exame:', error);
        throw new Error(`Falha ao excluir exame: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro no endpoint deleteExame:', error);
      res.status(400).json({ error: error.message });
    }
  },
];

// Endpoint para upload de arquivos (PDF e até 20 imagens, apenas Admin)
const uploadFiles = [
  isAdmin,
  fetchAnimalName,
  upload,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const exame = await Exame.findByPk(req.params.id);
      if (!exame) {
        for (const file of req.files) {
          try {
            await fs.unlink(path.join(UPLOADS_DIR, file.filename));
          } catch (unlinkError) {
            console.error(`Erro ao remover arquivo temporário ${file.path}:`, unlinkError);
          }
        }
        return res.status(404).json({ error: 'Exame não encontrado' });
      }

      const pdfFile = req.files.find((file) => file.mimetype === 'application/pdf');
      const imageFiles = req.files.filter((file) => file.mimetype !== 'application/pdf');

      if (imageFiles.length > 20) {
        for (const file of req.files) {
          try {
            await fs.unlink(path.join(UPLOADS_DIR, file.filename));
          } catch (unlinkError) {
            console.error(`Erro ao remover arquivo temporário ${file.path}:`, unlinkError);
          }
        }
        return res.status(400).json({ error: 'Máximo de 20 imagens permitido' });
      }

      if (pdfFile) {
        if (exame.pdf_path) {
          try {
            await fs.unlink(exame.pdf_path);
          } catch (fileError) {
            console.error(`Erro ao excluir arquivo PDF antigo ${exame.pdf_path}:`, fileError.message);
          }
        }
        exame.pdf_path = path.join(UPLOADS_DIR, pdfFile.filename);
        exame.status = 'Concluído';
      }

      if (imageFiles.length > 0) {
        if (exame.image_paths && Array.isArray(exame.image_paths)) {
          for (const filePath of exame.image_paths) {
            try {
              await fs.unlink(filePath);
            } catch (fileError) {
              console.error(`Erro ao excluir arquivo de imagem antigo ${filePath}:`, fileError.message);
            }
          }
        }
        exame.image_paths = imageFiles.map((file) => path.join(UPLOADS_DIR, file.filename));
      }

      await exame.save();

      await Log.create({
        exame_id: exame.id,
        user_id: req.user.id,
        action: 'Upload de arquivos',
      });

      let emailResult = { success: true, message: 'Nenhum e-mail enviado (PDF não alterado/adicionado ou status não mudou para Concluído)' };
      if (pdfFile && exame.status === 'Concluído') {
        emailResult = await EmailService.sendExamEmail(exame.id, req.user.id);
        console.log(`Resultado do envio de e-mail automático: ${emailResult.message}`);
      }

      res.json({
        message: 'Arquivos enviados com sucesso',
        exame,
        email: emailResult,
      });
    } catch (error) {
      if (req.files) {
        for (const file of req.files) {
          try {
            await fs.unlink(path.join(UPLOADS_DIR, file.filename));
          } catch (unlinkError) {
            console.error(`Erro ao remover arquivo temporário ${file.path}:`, unlinkError);
          }
        }
      }
      console.error('Erro no endpoint uploadFiles:', error);
      res.status(400).json({ error: error.message });
    }
  },
];

// Endpoint para enviar e-mail com laudo (apenas Admin)
const sendEmail = [
  isAdmin,
  async (req, res) => {
    try {
      const result = await EmailService.sendExamEmail(req.params.id, req.user.id, req.body.text);
      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }
      res.json({ message: result.message });
    } catch (error) {
      console.error('Erro no endpoint sendEmail:', error);
      res.status(500).json({ error: `Erro ao enviar e-mail: ${error.message}` });
    }
  },
];

// Endpoint para reenviar e-mails (Admin)
const resendFailedEmail = [
  isAdmin,
  async (req, res) => {
    try {
      const emailLog = await EmailLog.findByPk(req.params.id, {
        include: [{ model: Exame }],
      });

      if (!emailLog) {
        return res.status(404).json({ error: 'Log de e-mail não encontrado' });
      }

      const exame = emailLog.Exame;
      if (!exame) {
        return res.status(404).json({ error: 'Exame associado ao log de e-mail não encontrado.' });
      }
      const result = await EmailService.sendExamEmail(
        exame.id,
        req.user.id,
        req.body.text || 'Segue em anexo o laudo do exame.',
        true
      );

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.json({ message: result.message });
    } catch (error) {
      console.error('Erro no endpoint resendFailedEmail:', error);
      res.status(500).json({ error: `Erro ao reenviar e-mail: ${error.message}` });
    }
  },
];

// Endpoint para download de PDFs (restrito à clínica logada ou Admin)
const getExamPdf = async (req, res) => {
  try {
    const exame = await Exame.findByPk(req.params.id);
    if (!exame || !exame.pdf_path) {
      return res.status(404).json({ error: 'PDF não encontrado' });
    }

    if (req.user.role !== 'Admin' && exame.clinic_id !== req.user.clinic_id) {
      return res.status(403).json({ error: 'Acesso negado ao PDF deste exame.' });
    }

    if (!(await fs.access(exame.pdf_path).then(() => true).catch(() => false))) {
      return res.status(404).json({ error: 'Arquivo PDF não encontrado no sistema' });
    }

    await Log.create({
      exame_id: exame.id,
      user_id: req.user.id,
      action: 'Acessou PDF do exame',
    });

    res.download(exame.pdf_path);
  } catch (error) {
    console.error('Erro no endpoint getExamPdf:', error);
    res.status(400).json({ error: error.message });
  }
};

// Endpoint para listar tipos de exames
const getExamTypes = async (req, res) => {
  try {
    const examTypes = await ExamType.findAll();
    res.json(examTypes);
  } catch (error) {
    console.error('Erro no endpoint getExamTypes:', error);
    res.status(400).json({ error: error.message });
  }
};

const marcarPagamento = [
  check('observacao').optional().isLength({ max: 255 }).withMessage('Observação deve ter máx. 255 caracteres'),
  check('tipo_pagamento_id').optional().isInt().withMessage('Tipo de pagamento deve ser um número inteiro'),
  isAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const exame = await Exame.findByPk(req.params.id, {
        include: [{ model: Clinica }],
      });
      if (!exame) {
        return res.status(404).json({ error: 'Exame não encontrado' });
      }
      if (exame.pago) {
        return res.status(400).json({ error: 'Exame já está marcado como pago' });
      }

      const t = await sequelize.transaction();
      try {
        exame.pago = true;
        exame.observacaoPagamento = req.body.observacao || '';

        let tipoPagamentoNome = 'Nenhum';
        let paymentMethod = 'dinheiro'; // padrão
        if (req.body.tipo_pagamento_id) {
          const tipoPagamento = await TipoPagamento.findByPk(req.body.tipo_pagamento_id, { transaction: t });
          if (!tipoPagamento || !tipoPagamento.ativo) {
            await t.rollback();
            return res.status(400).json({ error: 'Tipo de pagamento inválido ou inativo' });
          }
          exame.tipo_pagamento_id = req.body.tipo_pagamento_id;
          tipoPagamentoNome = tipoPagamento.nome;
          paymentMethod = tipoPagamento.slug || tipoPagamento.nome.toLowerCase();
        } else {
          exame.tipo_pagamento_id = null;
        }

        await exame.save({ transaction: t });

        // Criar receita vinculada ao exame pago
        if (exame.value && exame.value > 0) {
          await Revenue.create(
            {
              exame_id: exame.id,
              description: `Receita do exame ID ${exame.id}`,
              amount: exame.value,
              status: 'recebido',
              payment_method: paymentMethod,
              due_date: new Date(),
              received_date: new Date(),
              notes: `Receita gerada automaticamente ao marcar exame como pago. Obs: ${exame.observacaoPagamento || ''}`,
            },
            { transaction: t }
          );
        }

        await Log.create(
          {
            exame_id: exame.id,
            user_id: req.user.id,
            action: 'Marcou exame como pago',
            details: `Tipo: ${tipoPagamentoNome}, Observação: ${exame.observacaoPagamento || 'Nenhuma'}`,
          },
          { transaction: t }
        );

        await t.commit();

        const updatedExame = await Exame.findByPk(exame.id, {
          include: [
            { model: Clinica, attributes: ['name'] },
            { model: TipoPagamento, attributes: ['nome'], required: false },
            { model: ExamType, attributes: ['name'] },
          ],
        });
        const plainExame = updatedExame.get({ plain: true });
        plainExame.clinic_name = plainExame.Clinica ? plainExame.Clinica.name : 'N/A';
        delete plainExame.Clinica;
        delete plainExame.dataPagamento;

        res.status(200).json({ message: 'Exame marcado como pago e receita criada', exame: plainExame });
      } catch (error) {
        await t.rollback();
        console.error('Erro ao marcar pagamento:', error);
        throw new Error(`Erro ao marcar pagamento: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro no endpoint marcarPagamento:', error);
      res.status(500).json({ error: error.message });
    }
  },
];

const marcarPagamentos = [
  check('exames')
    .isArray({ min: 1 })
    .withMessage('Deve ser fornecido pelo menos um exame')
    .custom((value) =>
      value.every(
        (exame) =>
          Number.isInteger(Number(exame.id)) &&
          typeof exame.pago === 'boolean' &&
          (exame.tipo_pagamento_id === null || Number.isInteger(Number(exame.tipo_pagamento_id))) &&
          (exame.observacaoPagamento === '' || typeof exame.observacaoPagamento === 'string')
      )
    )
    .withMessage('Cada exame deve ter um ID inteiro, pago booleano, tipo_pagamento_id inteiro ou null, e observacaoPagamento string ou vazia'),
  isAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { exames } = req.body;
    const userId = req.user.id;

    const t = await sequelize.transaction();

    try {
      const exameIds = exames.map((exame) => exame.id);
      const examesDb = await Exame.findAll({
        where: { id: { [Op.in]: exameIds } },
        transaction: t,
      });

      if (examesDb.length !== exameIds.length) {
        await t.rollback();
        return res.status(404).json({ error: 'Um ou mais exames não encontrados' });
      }

      const examesJaPagos = examesDb.filter((exame) => exame.pago);
      if (examesJaPagos.length > 0) {
        await t.rollback();
        return res.status(400).json({
          error: `Os seguintes exames já estão marcados como pagos: ${examesJaPagos.map((e) => e.id).join(', ')}`,
        });
      }

      for (const exameData of exames) {
        const exame = examesDb.find((e) => e.id === exameData.id);
        let tipoPagamentoNome = 'Nenhum';
        let paymentMethod = 'dinheiro';

        if (exameData.tipo_pagamento_id) {
          const tipoPagamento = await TipoPagamento.findByPk(exameData.tipo_pagamento_id, { transaction: t });
          if (!tipoPagamento || !tipoPagamento.ativo) {
            await t.rollback();
            return res.status(400).json({ error: `Tipo de pagamento inválido ou inativo para o exame ID ${exameData.id}` });
          }
          tipoPagamentoNome = tipoPagamento.nome;
          paymentMethod = tipoPagamento.slug || tipoPagamento.nome.toLowerCase();
        }

        await Exame.update(
          {
            pago: exameData.pago,
            observacaoPagamento: exameData.observacaoPagamento || null,
            tipo_pagamento_id: exameData.tipo_pagamento_id !== null ? exameData.tipo_pagamento_id : exame.tipo_pagamento_id,
          },
          {
            where: { id: exameData.id },
            transaction: t,
          }
        );

        // Criar receita para cada exame pago, se valor válido
        if (exameData.pago && exame.value && exame.value > 0) {
          await Revenue.create(
            {
              exame_id: exame.id,
              description: `Receita do exame ID ${exameData.id}`,
              amount: exame.value,
              status: 'recebido',
              payment_method: paymentMethod,
              due_date: new Date(),
              received_date: new Date(),
              notes: `Receita gerada automaticamente ao marcar exame como pago. Obs: ${exameData.observacaoPagamento || ''}`,
            },
            { transaction: t }
          );
        }

        await Log.create(
          {
            exame_id: exameData.id,
            user_id: userId,
            action: 'Marcou exame como pago',
            details: `Tipo: ${tipoPagamentoNome}, Observação: ${exameData.observacaoPagamento || 'Nenhuma'}`,
          },
          { transaction: t }
        );
      }

      await t.commit();

      const updatedExames = await Exame.findAll({
        where: { id: { [Op.in]: exameIds } },
        include: [
          { model: Clinica, attributes: ['name'] },
          { model: TipoPagamento, attributes: ['nome'], required: false },
          { model: ExamType, attributes: ['name'] },
        ],
      });

      const examesResponse = updatedExames.map((exame) => {
        const plainExame = exame.get({ plain: true });
        plainExame.clinic_name = plainExame.Clinica ? plainExame.Clinica.name : 'N/A';
        delete plainExame.Clinica;
        delete plainExame.dataPagamento;
        return plainExame;
      });

      res.status(200).json({ message: 'Exames marcados como pagos e receitas criadas com sucesso', exames: examesResponse });
    } catch (error) {
      await t.rollback();
      console.error('Erro no endpoint marcarPagamentos:', error);
      res.status(500).json({ error: `Erro ao marcar exames como pagos: ${error.message}` });
    }
  },
];

// Endpoint para desmarcar pagamento
const desmarcarPagamento = [
  isAdmin,
  async (req, res) => {
    try {
      const exame = await Exame.findByPk(req.params.id);
      if (!exame) {
        return res.status(404).json({ error: 'Exame não encontrado' });
      }
      if (!exame.pago) {
        return res.status(400).json({ error: 'Exame não está marcado como pago' });
      }
      const t = await sequelize.transaction();
      try {
        exame.pago = false;
        exame.observacaoPagamento = null;
        exame.tipo_pagamento_id = null;
        await exame.save({ transaction: t });
        await Log.create(
          {
            exame_id: exame.id,
            user_id: req.user.id,
            action: 'Desmarcou pagamento do exame',
          },
          { transaction: t }
        );
        await t.commit();

        const updatedExame = await Exame.findByPk(exame.id, {
          include: [
            { model: Clinica, attributes: ['name'] },
            { model: TipoPagamento, attributes: ['nome'], required: false },
            { model: ExamType, attributes: ['name'] },
          ],
        });
        const plainExame = updatedExame.get({ plain: true });
        plainExame.clinic_name = plainExame.Clinica ? plainExame.Clinica.name : 'N/A';
        delete plainExame.Clinica;
        delete plainExame.dataPagamento;

        res.json({ message: 'Pagamento desmarcado', exame: plainExame });
      } catch (error) {
        await t.rollback();
        console.error('Erro ao desmarcar pagamento:', error);
        throw new Error(`Erro ao desmarcar pagamento: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro no endpoint desmarcarPagamento:', error);
      res.status(500).json({ error: error.message });
    }
  },
];

module.exports = {
  createExame,
  getExames,
  getExame,
  updateExame,
  deleteExame,
  uploadFiles,
  sendEmail,
  resendFailedEmail,
  getExamPdf,
  getExamTypes,
  marcarPagamento,
  marcarPagamentos,
  desmarcarPagamento,
};