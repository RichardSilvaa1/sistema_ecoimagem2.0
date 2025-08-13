import { toast } from 'react-toastify';
import api from './api';

export default class ExameService {
  async handleFileUpload(exameId, files) {
    if (!files || files.length === 0) return false;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    try {
      await api.post(`/api/exames/${exameId}/carregar-arquivo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Laudo salvo com sucesso');
      return true;
    } catch (error) {
      toast.error('Erro ao enviar arquivos: ' + (error.response?.data?.error || error.message));
      throw error;
    }
  }

  async handleSendEmail(exameId, exame, emailText, isAutoEmail = false) {
    if (!exameId) {
      if (!isAutoEmail) {
        toast.error('Por favor, salve o exame antes de enviar o e-mail.');
      }
      return { success: false, emailLogs: [] };
    }

    if (!exame?.pdf_path) {
      if (!isAutoEmail) {
        toast.error('Nenhum PDF disponível para envio.');
      }
      return { success: false, emailLogs: [] };
    }

    try {
      // Buscar logs de e-mail primeiro
      let emailLogs = [];
      try {
        const emailLogsRes = await api.get(`/api/logs/email-logs/${exameId}`);
        emailLogs = emailLogsRes.data || [];
      } catch (logError) {
        if (logError.response?.status !== 404) {
          console.error('Erro ao carregar logs de e-mail:', logError);
          toast.error('Erro ao verificar logs de e-mail: ' + (logError.response?.data?.error || logError.message));
        }
      }

      // Verificar se há um e-mail enviado recentemente (nos últimos 5 minutos)
      if (!isAutoEmail) {
        const recentEmail = emailLogs.find((log) => {
          if (log.status !== 'Enviado') return false;
          const logDate = new Date(log.created_at);
          const now = new Date();
          const timeDiff = (now - logDate) / 1000; // Diferença em segundos
          return timeDiff < 300; // 5 minutos = 300 segundos
        });

        if (recentEmail) {
          toast.info('Um e-mail já foi enviado recentemente. Aguarde alguns minutos antes de tentar novamente.');
          return { success: false, emailLogs };
        }
      }

      

      // Atualizar os logs de e-mail
      try {
        console.log('Buscando logs de e-mail para exame ID:', exameId);
        const emailLogsRes = await api.get(`/api/logs/email-logs/${exameId}`);
        return { success: true, emailLogs: emailLogsRes.data || [] };
      } catch (logError) {
        console.error('Erro ao carregar logs de e-mail:', logError);
        if (
          logError.response?.status === 404 ||
          logError.response?.data?.error?.includes('Nenhum log de email encontrado')
        ) {
          return { success: true, emailLogs: [] };
        } else {
          toast.error('Erro ao carregar logs de e-mail: ' + (logError.response?.data?.error || logError.message));
          return { success: true, emailLogs: [] };
        }
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      toast.error('Erro ao enviar e-mail: ' + (error.response?.data?.error || error.message));
      try {
        console.log('Tentando buscar logs de e-mail após erro:', exameId);
        const emailLogsRes = await api.get(`/api/logs/email-logs/${exameId}`);
        return { success: false, emailLogs: emailLogsRes.data || [] };
      } catch (logError) {
        console.error('Erro ao carregar logs após falha no envio:', logError);
        if (
          logError.response?.status === 404 ||
          logError.response?.data?.error?.includes('Nenhum log de email encontrado')
        ) {
          return { success: false, emailLogs: [] };
        } else {
          toast.error('Erro ao carregar logs de e-mail: ' + (logError.response?.data?.error || logError.message));
          return { success: false, emailLogs: [] };
        }
      }
    }
  }

  async handleResendEmail(exameId, logId, emailText) {
    if (!exameId) {
      toast.error('Por favor, salve o exame antes de reenviar o e-mail.');
      return { success: false, emailLogs: [] };
    }
    try {
      const emailData = { text: emailText || 'Segue em anexo o laudo do exame.' };
      console.log('Reenviando e-mail para log ID:', logId);
      await api.post(`/api/exames/emails/${logId}/reenviar`, emailData);
      toast.success('E-mail reenviado com sucesso!');
      try {
        const emailLogsRes = await api.get(`/api/logs/email-logs/${exameId}`);
        return { success: true, emailLogs: emailLogsRes.data || [] };
      } catch (logError) {
        if (logError.response?.status === 404) {
          return { success: true, emailLogs: [] };
        } else {
          toast.error('Erro ao carregar logs de e-mail: ' + (logError.response?.data?.error || logError.message));
          return { success: true, emailLogs: [] };
        }
      }
    } catch (error) {
      toast.error('Erro ao reenviar e-mail: ' + (error.response?.data?.error || error.message));
      return { success: false, emailLogs: [] };
    }
  }

  async handlePagamentoChange(exameId, exame, isChecked, tipoPagamentoId, observacao, setValue, setExame) {
    // Validação: tipo_pagamento_id é obrigatório quando pago é true
    if (isChecked && !tipoPagamentoId) {
      toast.error('Tipo de pagamento é obrigatório quando o exame está marcado como pago.');
      setValue('pago', false);
      return { success: false };
    }

    // Atualizar os valores do formulário
    setValue('pago', isChecked);
    setValue('observacaoPagamento', isChecked ? (observacao || '') : '');

    // Se o exame já existe (exameId presente), atualizar no backend
    if (exameId) {
      try {
        const exameData = {
          pago: isChecked,
          observacaoPagamento: isChecked ? (observacao || '') : '',
          tipo_pagamento_id: tipoPagamentoId ? parseInt(tipoPagamentoId) : null,
        };
        await api.put(`/api/exames/${exameId}`, exameData);
        toast.success(isChecked ? 'Pagamento marcado com sucesso!' : 'Pagamento desmarcado com sucesso!');
        const exameRes = await api.get(`/api/exames/${exameId}`);
        const updatedExame = exameRes.data;
        setExame(updatedExame);
        setValue('observacaoPagamento', updatedExame.observacaoPagamento || '');
        setValue('tipo_pagamento_id', updatedExame.tipo_pagamento_id ? String(updatedExame.tipo_pagamento_id) : '');
        setValue('pago', updatedExame.pago);
        return { success: true };
      } catch (error) {
        toast.error(`Erro ao ${isChecked ? 'marcar' : 'desmarcar'} pagamento: ` + (error.response?.data?.error || error.message));
        setValue('pago', exame?.pago || false); // Reverte para o estado anterior
        setValue('observacaoPagamento', exame?.observacaoPagamento || '');
        setValue('tipo_pagamento_id', exame?.tipo_pagamento_id ? String(exame.tipo_pagamento_id) : '');
        return { success: false };
      }
    }

    // Se não há exameId, apenas retornar sucesso (os dados serão salvos no handleSubmit)
    return { success: true };
  }

  async handleDownloadPdf(exameId, exame, animalName) {
    if (!exameId || !exame?.pdf_path) {
      toast.error('Nenhum PDF disponível ou exame não salvo.');
      return { success: false };
    }
    try {
      const response = await api.get(`/api/exames/${exameId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exame_${animalName || 'exame'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF baixado com sucesso!');
      return { success: true };
    } catch (error) {
      toast.error('Erro ao baixar PDF: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  }

  async handleDeleteExame(exameId, animalName, navigate) {
    if (!exameId) {
      toast.error('Não é possível excluir um exame que ainda não foi salvo.');
      return { success: false };
    }
    try {
      await api.delete(`/api/exames/${exameId}`);
      navigate('/exames');
      return { success: true };
    } catch (error) {
      toast.error('Erro ao excluir exame: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  }

  /**
   * Cria ou atualiza um exame, envia arquivos e tenta enviar e-mail se aplicável corrigir
   * @param {...} vários parâmetros para controlar o formulário e estado.
   * @returns {object} - Resultado da submissão.
   */
  async handleSubmit(
    data,
    user,
    id,
    exame,
    fileInputRef,
    setExame,
    setValue,
    setAnimalSuggestions,
    setTutorSuggestions,
    animalSuggestions,
    tutorSuggestions,
    navigate,
    onExamCreated,
    setEmailLogs,
    emailText,
    setEmailSending,
    isEditMode
  ) {
    if (!user) {
      toast.error('Erro: Usuário não autenticado. Faça login novamente.');
      return { success: false, exameId: null, message: null };
    }

    if (this.isSubmitting) {
      console.log('Submissão em andamento, ignorando nova tentativa.');
      return { success: false, exameId: null, message: null };
    }
    this.isSubmitting = true;

    if (!data.animal_name || data.animal_name.trim() === '') {
      toast.error('Por favor, informe o nome do pet.');
      this.isSubmitting = false;
      return { success: false, exameId: null, message: null };
    }

    if (data.pago && !data.tipo_pagamento_id) {
      toast.error('Tipo de pagamento é obrigatório quando o exame está marcado como pago.');
      this.isSubmitting = false;
      return { success: false, exameId: null, message: null };
    }

    let emailSent = false;

    try {
      // Prepara dados do exame
      const exameData = {
        animal_name: data.animal_name,
        tutor: data.tutor || null,
        veterinario: data.veterinario || null,
        date: data.date,
        exam_type_id: parseInt(data.exam_type_id),
        value: parseFloat(data.value),
        clinic_id: parseInt(data.clinic_id),
        tipo_pagamento_id: data.tipo_pagamento_id ? parseInt(data.tipo_pagamento_id) : null,
        pago: data.pago || false,
        observacaoPagamento: data.pago ? (data.observacaoPagamento || '') : null,
      };

      let exameId = id;
      let updatedExame;

      if (id) {
        // Atualiza exame existente
        await api.put(`/api/exames/${id}`, exameData);
        updatedExame = (await api.get(`/api/exames/${id}`)).data;
      } else {
        // Cria novo exame
        const response = await api.post(`/api/exames`, exameData);
        exameId = response.data.id;
        updatedExame = response.data;
        if (onExamCreated) {
          onExamCreated({ exameId, files: fileInputRef.current?.files || [] });
        } else {
          navigate(`/exames/editar/${exameId}`, { replace: true });
        }
      }

      // Atualiza campos e sugestões no frontend
      setExame(updatedExame);
      setValue('observacaoPagamento', updatedExame.observacaoPagamento || '');
      setValue('tipo_pagamento_id', updatedExame.tipo_pagamento_id ? String(updatedExame.tipo_pagamento_id) : '');
      setValue('pago', updatedExame.pago);
      setAnimalSuggestions((prev) => [...new Set([...prev, data.animal_name].filter(Boolean))]);
      setTutorSuggestions((prev) => [...new Set([...prev, data.tutor].filter(Boolean))]);
      localStorage.setItem('animalSuggestions', JSON.stringify([...new Set([...animalSuggestions, data.animal_name].filter(Boolean))]));
      localStorage.setItem('tutorSuggestions', JSON.stringify([...new Set([...tutorSuggestions, data.tutor].filter(Boolean))]));

      // Se admin e arquivos foram enviados, faz upload e tenta enviar e-mail
      if (user.role === 'Admin' && fileInputRef.current && fileInputRef.current.files?.length > 0) {
        setEmailSending({ isSending: true, seconds: 0 });

        Promise.resolve().then(async () => {
          try {
            console.log('Iniciando upload de arquivos em segundo plano para exame:', exameId);
            await this.handleFileUpload(exameId, fileInputRef.current.files);

            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }

            updatedExame = (await api.get(`/api/exames/${exameId}`)).data;

            if (updatedExame.pdf_path && !emailSent) {
              console.log('Verificando logs antes de envio automático para exame:', exameId);
              const emailLogsRes = await api.get(`/api/logs/email-logs/${exameId}`);
              const emailLogs = emailLogsRes.data || [];
              const hasRecentEmail = emailLogs.some((log) => {
                if (log.status !== 'Enviado') return false;
                const logDate = new Date(log.created_at);
                const now = new Date();
                const timeDiff = (now - logDate) / 1000;
                return timeDiff < 300;
              });

              if (!hasRecentEmail) {
                console.log('Enviando e-mail em segundo plano para exame:', exameId);
                const { success, emailLogs: updatedEmailLogs } = await this.handleSendEmail(
                  exameId,
                  updatedExame,
                  emailText || 'Segue em anexo o laudo do exame.',
                  true
                );
                if (success) {
                  emailSent = true;
                  setEmailLogs(updatedEmailLogs);
                  toast.success('E-mail enviado com sucesso!');
                } else {
                  toast.error('Erro ao enviar e-mail.');
                }
              } else {
                console.log('E-mail recente encontrado, pulando envio automático para exame:', exameId);
              }
            }
          } catch (fileError) {
            console.error('Erro durante o upload de arquivos ou envio de e-mail:', fileError.message);
            toast.error('Erro ao processar arquivos ou enviar e-mail.');
          } finally {
            setEmailSending({ isSending: false, seconds: 0 });
          }
        });
      }

      return { success: true, exameId, message: id ? 'Exame atualizado com sucesso!' : 'Exame criado com sucesso!' };
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.map((err) => err.msg).join(', ')
        : error.response?.data?.error || 'Ocorreu um erro ao salvar o exame.';
      console.error('Erro ao salvar exame:', errorMessage, error);
      toast.error(`Erro ao salvar exame: ${errorMessage}`);
      return { success: false, exameId: null, message: null };
    } finally {
      this.isSubmitting = false;
    }
  }
}
