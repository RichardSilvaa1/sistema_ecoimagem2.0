const transporter = require('../config/mailer');
const EmailLog = require('../models/emailLog.model');
const Log = require('../models/log.model');
const Exame = require('../models/exame.model');
const Clinica = require('../models/clinica.model');

// Mapa de tradução de mensagens de erro
const errorTranslations = {
  'No recipients defined': 'Nenhum destinatário definido',
  'Invalid login': 'Login inválido',
  'Authentication failed': 'Falha na autenticação',
  'Connection refused': 'Conexão recusada',
  'Message size exceeds limit': 'Tamanho da mensagem excede o limite',
  'Invalid address': 'Endereço de e-mail inválido',
  // Adicione outros erros comuns conforme necessário
};

class EmailService {
  /**
   * Sends an email with the exam report attached.
   * @param {number} exameId - The ID of the exam.
   * @param {number} userId - The ID of the user sending the email.
   * @param {string} [text='Segue em anexo o laudo do exame.'] - The email body text (ignored, using HTML template).
   * @param {boolean} [isResend=false] - Indicates if this is a resend attempt.
   * @returns {Promise<{success: boolean, message: string}>} - Result of the email sending operation.
   */
  static async sendExamEmail(exameId, userId, text = 'Segue em anexo o laudo do exame.', isResend = false) {
    try {
      const exame = await Exame.findByPk(exameId, {
        include: [{ model: Clinica, as: 'Clinica' }],
      });
      if (!exame || !exame.pdf_path) {
        throw new Error('Exame ou PDF não encontrado');
      }

      const clinica = exame.Clinica;
      if (!clinica.email) {
        throw new Error('No recipients defined'); // Garante que o erro seja capturado se não houver e-mail
      }

      // Corpo do e-mail em HTML
      const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #2a7ae2;">Olá!</h2>
          <p>Agradecemos pela confiança em nossos serviços.</p>
          <p>
            Segue em anexo o laudo referente ao exame realizado no dia 
            <strong>${exame.date.toLocaleDateString('pt-BR')}</strong> 
            para o(a) paciente 
            <strong>${exame.animal_name}</strong>.
          </p>
          <p>
            Caso tenha qualquer dúvida ou precise de esclarecimentos adicionais, 
            nossa equipe está sempre à disposição para ajudar.
          </p>
          <p style="margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe Eco Imagem</strong>
          </p>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: clinica.email,
        subject: `Laudo Nome do Pet: ${exame.animal_name} - Data do Exame: ${exame.date.toLocaleDateString('pt-BR')}${isResend ? ' (Reenvio)' : ''}`,
        html: emailBody,
        attachments: [{ path: exame.pdf_path }],
      };

      const info = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) reject(error);
          else resolve(info);
        });
      });

      await EmailLogService.logEmailSuccess(exame.id, clinica.email, userId, isResend);

      return { success: true, message: isResend ? 'E-mail reenviado com sucesso' : 'E-mail enviado com sucesso' };
    } catch (error) {
      const translatedError = errorTranslations[error.message] || `Erro desconhecido: ${error.message}`;
      await EmailLogService.logEmailFailure(exameId, userId, translatedError, isResend);
      return { success: false, message: `Erro ao ${isResend ? 'reenviar' : 'enviar'} e-mail: ${translatedError}` };
    }
  }
}

class EmailLogService {
  /**
   * Logs a successful email sending operation.
   * @param {number} exameId - The ID of the exam.
   * @param {string} sentTo - The recipient email address.
   * @param {number} userId - The ID of the user sending the email.
   * @param {boolean} isResend - Indicates if this is a resend attempt.
   */
  static async logEmailSuccess(exameId, sentTo, userId, isResend) {
    await EmailLog.create({
      exame_id: exameId,
      sent_to: sentTo,
      status: 'Enviado',
      error_message: null,
      sent_at: new Date(),
    });

    await Log.create({
      exame_id: exameId,
      user_id: userId,
      action: isResend ? 'Reenviou e-mail' : 'Enviou e-mail (automático)',
    });
  }

  /**
   * Logs a failed email sending operation.
   * @param {number} exameId - The ID of the exam.
   * @param {number} userId - The ID of the user sending the email.
   * @param {string} errorMessage - The error message from the failure.
   * @param {boolean} isResend - Indicates if this is a resend attempt.
   */
  static async logEmailFailure(exameId, userId, errorMessage, isResend) {
    await EmailLog.create({
      exame_id: exameId,
      sent_to: 'N/A',
      status: 'Falhou',
      error_message: errorMessage,
      sent_at: new Date(),
    });

    await Log.create({
      exame_id: exameId,
      user_id: userId,
      action: `Falha ao ${isResend ? 'reenviar' : 'enviar'} e-mail: ${errorMessage}`,
    });
  }
}

module.exports = { EmailService, EmailLogService };
