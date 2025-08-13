const Exame = require('../models/exame.model');
const ExamType = require('../models/examType.model');
const TipoPagamento = require('../models/tipoPagamento.model');
const Clinica = require('../models/clinica.model');
const Log = require('../models/log.model');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const generateFinancialReport = async (req, res) => {
  const { clinic_id, startDate, endDate, exam_type_id, pago, tipo_pagamento_id, month, format } = req.query;
  const where = {};

  // Aplica filtro de clínica
  if (req.user.role === 'Clínica') {
    where.clinic_id = req.user.clinic_id;
  } else if (clinic_id) {
    const clinica = await Clinica.findByPk(clinic_id);
    if (!clinica) {
      return res.status(404).json({ error: 'Clínica não encontrada' });
    }
    where.clinic_id = clinic_id;
  }

  // Aplica filtro de intervalo de datas
  if (startDate && endDate) {
    where.date = { [Op.between]: [startDate, endDate] };
  }
  // Aplica filtro de tipo de exame
  if (exam_type_id) {
    where.exam_type_id = exam_type_id;
  }
  // Aplica filtro de status de pagamento
  if (pago) {
    where.pago = pago === 'true';
  }
  // Aplica filtro de tipo de pagamento
  if (tipo_pagamento_id) {
    where.tipo_pagamento_id = tipo_pagamento_id;
  }
  // Aplica filtro por mês
  if (month && month !== 'all') {
    const [year, monthNum] = month.split('-').map(Number);
    const currentYear = new Date().getFullYear();
    if (
      isNaN(year) ||
      isNaN(monthNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      year < currentYear - 10 ||
      year > currentYear + 1
    ) {
      return res.status(400).json({
        error: 'Formato de mês inválido. Use YYYY-MM (ex.: 2025-03). Ano deve estar entre ' + (currentYear - 10) + ' e ' + (currentYear + 1),
      });
    }
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);
    where.date = { [Op.between]: [startOfMonth, endOfMonth] };
  }

  try {
    // Busca exames com detalhes associados
    const exames = await Exame.findAll({
      where,
      include: [
        { model: ExamType, attributes: ['name'], required: false },
        { model: TipoPagamento, attributes: ['nome'], required: false },
        { model: Clinica, attributes: ['name'], required: true },
      ],
    });

    // Busca exames dos últimos 30 dias (respeitando filtro de clínica, mas não de mês)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const examesUltimos30Dias = await Exame.findAll({
      where: {
        date: { [Op.gte]: thirtyDaysAgo },
        ...(clinic_id && { clinic_id }),
      },
      include: [
        { model: Clinica, attributes: ['name'], required: true },
      ],
    });

    // Inicializa o objeto de relatório
    const report = {
      total_exames: exames.length,
      total_value: exames.reduce((sum, exame) => sum + exame.value, 0),
      exames_pagos: exames.filter(e => e.pago).length,
      exames_pendentes: exames.filter(e => !e.pago).length,
      valor_pago: exames.filter(e => e.pago).reduce((sum, e) => sum + e.value, 0),
      valor_pendente: exames.filter(e => !e.pago).reduce((sum, e) => sum + e.value, 0),
      exames_ultimos_30_dias: examesUltimos30Dias.length,
      valor_ultimos_30_dias: examesUltimos30Dias.reduce((sum, exame) => sum + exame.value, 0),
      by_type: exames.reduce((acc, exame) => {
        const typeName = exame.ExamType?.name || 'Tipo Não Informado';
        acc[typeName] = (acc[typeName] || 0) + 1;
        return acc;
      }, {}),
      by_payment_type: exames.reduce((acc, exame) => {
        const tipoNome = exame.TipoPagamento?.nome || 'Desconhecido';
        if (!acc[tipoNome]) {
          acc[tipoNome] = { count: 0, value: 0, paid_value: 0, pending_value: 0 };
        }
        acc[tipoNome].count += 1;
        acc[tipoNome].value += exame.value;
        if (exame.pago) {
          acc[tipoNome].paid_value += exame.value;
        } else {
          acc[tipoNome].pending_value += exame.value;
        }
        return acc;
      }, {}),
      by_clinic: exames.reduce((acc, exame) => {
        const clinicName = exame.Clinica?.name || 'Clínica Não Informada/Desconhecida';
        if (!exame.Clinica) {
          Log.create({
            user_id: req.user.id,
            action: `Exame ID ${exame.id} sem clínica associada (clinic_id: ${exame.clinic_id})`,
          });
        }
        if (!acc[clinicName]) {
          acc[clinicName] = {
            total_value: 0,
            valor_pago: 0,
            valor_pendente: 0,
            by_payment_type: {},
          };
        }
        acc[clinicName].total_value += exame.value;
        if (exame.pago) {
          acc[clinicName].valor_pago += exame.value;
        } else {
          acc[clinicName].valor_pendente += exame.value;
        }
        const tipoPagamentoNome = exame.TipoPagamento?.nome || 'Desconhecido';
        if (!acc[clinicName].by_payment_type[tipoPagamentoNome]) {
          acc[clinicName].by_payment_type[tipoPagamentoNome] = {
            count: 0,
            value: 0,
            paid_value: 0,
            pending_value: 0,
          };
        }
        acc[clinicName].by_payment_type[tipoPagamentoNome].count += 1;
        acc[clinicName].by_payment_type[tipoPagamentoNome].value += exame.value;
        if (exame.pago) {
          acc[clinicName].by_payment_type[tipoPagamentoNome].paid_value += exame.value;
        } else {
          acc[clinicName].by_payment_type[tipoPagamentoNome].pending_value += exame.value;
        }
        return acc;
      }, {}),
    };

    // Registra a ação de geração de relatório
    await Log.create({
      user_id: req.user.id,
      action: `Gerou relatório financeiro (formato: ${format || 'JSON'}, mês: ${month || 'todos'})`,
    });

    // Exportação para PDF
    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
      doc.pipe(res);
      doc.fontSize(16).text('Relatório Financeiro', { align: 'center' });
      if (month && month !== 'all') {
        const [year, monthNum] = month.split('-');
        const monthName = new Date(year, monthNum - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        doc.fontSize(12).text(`Período: ${monthName}`, { align: 'center' });
      } else {
        doc.fontSize(12).text('Período: Todos os Meses', { align: 'center' });
      }
      doc.moveDown();
      doc.fontSize(12).text(`Total de Exames: ${report.total_exames}`);
      doc.text(`Exames Pagos: ${report.exames_pagos}`);
      doc.text(`Exames Pendentes: ${report.exames_pendentes}`);
      doc.text(`Valor Total: R$${report.total_value.toFixed(2)}`);
      doc.text(`Valor Pago: R$${report.valor_pago.toFixed(2)}`);
      doc.text(`Valor Pendente: R$${report.valor_pendente.toFixed(2)}`);
      doc.moveDown();
      doc.text('Exames por Tipo:');
      Object.entries(report.by_type).forEach(([type, count]) => {
        doc.text(`- ${type}: ${count}`);
      });
      doc.moveDown();
      doc.text('Pagamentos por Tipo:');
      Object.entries(report.by_payment_type).forEach(([tipo, data]) => {
        doc.text(`- ${tipo}: ${data.count} exames, R$${data.value.toFixed(2)} (Pendente: R$${data.pending_value.toFixed(2)})`);
      });
      doc.moveDown();
      doc.fontSize(14).text('Detalhamento Financeiro por Clínica:', { underline: true });
      doc.moveDown();
      Object.entries(report.by_clinic).forEach(([clinicName, clinicData]) => {
        doc.fontSize(12).text(`Clínica: ${clinicName}`);
        doc.text(`  Valor Total: R$${clinicData.total_value.toFixed(2)}`);
        doc.text(`  Valor Pago: R$${clinicData.valor_pago.toFixed(2)}`);
        doc.text(`  Valor Pendente: R$${clinicData.valor_pendente.toFixed(2)}`);
        doc.text('  Pagamentos por Tipo (Nesta Clínica):');
        Object.entries(clinicData.by_payment_type).forEach(([paymentType, paymentData]) => {
          doc.text(`    - ${paymentType}: ${paymentData.count} exames, Total: R$${paymentData.value.toFixed(2)}, Pago: R$${paymentData.paid_value.toFixed(2)}, Pendente: R$${paymentData.pending_value.toFixed(2)}`);
        });
        doc.moveDown();
      });
      doc.end();
    } else if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Relatório Financeiro');
      worksheet.columns = [
        { header: 'Métrica', key: 'metric', width: 35 },
        { header: 'Valor', key: 'value', width: 25 },
      ];
      if (month && month !== 'all') {
        const [year, monthNum] = month.split('-');
        const monthName = new Date(year, monthNum - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        worksheet.addRow({ metric: `Período`, value: monthName });
      } else {
        worksheet.addRow({ metric: `Período`, value: 'Todos os Meses' });
      }
      worksheet.addRow({ metric: 'Total de Exames', value: report.total_exames });
      worksheet.addRow({ metric: 'Exames Pagos', value: report.exames_pagos });
      worksheet.addRow({ metric: 'Exames Pendentes', value: report.exames_pendentes });
      worksheet.addRow({ metric: 'Valor Total', value: report.total_value.toFixed(2) });
      worksheet.addRow({ metric: 'Valor Pago', value: report.valor_pago.toFixed(2) });
      worksheet.addRow({ metric: 'Valor Pendente', value: report.valor_pendente.toFixed(2) });
      worksheet.addRow({ metric: 'Exames Últimos 30 Dias', value: report.exames_ultimos_30_dias });
      worksheet.addRow({ metric: 'Faturamento Últimos 30 Dias', value: report.valor_ultimos_30_dias.toFixed(2) });
      worksheet.addRow({});
      worksheet.addRow({ metric: 'Exames por Tipo', value: '' });
      Object.entries(report.by_type).forEach(([type, count]) => {
        worksheet.addRow({ metric: `  ${type}`, value: count });
      });
      worksheet.addRow({});
      worksheet.addRow({ metric: 'Pagamentos por Tipo (Geral)', value: '' });
      Object.entries(report.by_payment_type).forEach(([tipo, data]) => {
        worksheet.addRow({ metric: `  ${tipo} (exames)`, value: data.count });
        worksheet.addRow({ metric: `  ${tipo} (valor)`, value: data.value.toFixed(2) });
        worksheet.addRow({ metric: `  ${tipo} (pendente)`, value: data.pending_value.toFixed(2) });
      });
      worksheet.addRow({});
      worksheet.addRow({ metric: 'Detalhamento Financeiro por Clínica', value: '' });
      Object.entries(report.by_clinic).forEach(([clinicName, clinicData]) => {
        worksheet.addRow({ metric: `Clínica: ${clinicName}`, value: '' });
        worksheet.addRow({ metric: '  Valor Total da Clínica', value: clinicData.total_value.toFixed(2) });
        worksheet.addRow({ metric: '  Valor Pago da Clínica', value: clinicData.valor_pago.toFixed(2) });
        worksheet.addRow({ metric: '  Valor Pendente da Clínica', value: clinicData.valor_pendente.toFixed(2) });
        worksheet.addRow({ metric: '  Pagamentos por Tipo (Nesta Clínica)', value: '' });
        Object.entries(clinicData.by_payment_type).forEach(([paymentType, paymentData]) => {
          worksheet.addRow({ metric: `    ${paymentType} (exames)`, value: paymentData.count });
          worksheet.addRow({ metric: `    ${paymentType} (total)`, value: paymentData.value.toFixed(2) });
          worksheet.addRow({ metric: `    ${paymentType} (pago)`, value: paymentData.paid_value.toFixed(2) });
          worksheet.addRow({ metric: `    ${paymentType} (pendente)`, value: paymentData.pending_value.toFixed(2) });
        });
        worksheet.addRow({});
      });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');
      await workbook.xlsx.write(res);
    } else {
      res.json(report);
    }
  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { generateFinancialReport };