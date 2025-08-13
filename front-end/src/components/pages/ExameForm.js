import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  Alert,
  AlertTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
} from '@mui/material';
import {
  LocalHospital as LocalHospital,
  Pets,
  Person as PersonIcon,
  AttachMoney,
  Save,
  Email,
  Download,
  ArrowBack,
  Delete,
  Send,
} from '@mui/icons-material';
import { blue, green } from '@mui/material/colors'; // Importa cores padrão do Material-UI
import { motion } from 'framer-motion';
import api from '../../services/api';
import ExameService from '../../services/ExameService';
import Layout from '../layout/Layout';

// Estilização para o input de arquivo
const FileInput = styled('input')(({ theme }) => ({
  padding: '8px',
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: '10px',
  background: '#F7FAFC',
  fontSize: '14px',
  fontFamily: theme.typography.fontFamily,
  width: '100%',
  transition: 'all 0.3s ease',
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}22`,
    outline: 'none',
  },
  '&::file-selector-button': {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: '#FFFFFF',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '13px',
    transition: 'all 0.3s ease',
    marginRight: '8px',
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
      transform: 'scale(1.03)',
    },
  },
}));

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#26A69A',
      dark: '#00897B',
      light: '#4DB6AC',
    },
    secondary: {
      main: '#FF7043',
      dark: '#F4511E',
      light: '#FF8A65',
    },
    success: {
      main: '#9CCC65',
      light: '#AED581',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB300',
    },
    error: {
      main: '#EF5350',
      dark: '#E53935',
    },
    background: {
      default: '#ECEFF1',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#263238',
      secondary: '#546E7A',
    },
    grey: {
      300: '#CFD8DC',
      400: '#B0BEC5',
    },
  },
  typography: {
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    subtitle1: {
      fontWeight: 400,
      color: '#546E7A',
      fontSize: '0.95rem',
    },
    caption: {
      color: '#546E7A',
      fontSize: '0.8rem',
    },
    body1: {
      fontSize: '0.9rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.06)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: '#F7FAFC',
          borderRadius: 10,
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
              borderColor: '#26A69A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#26A69A',
              boxShadow: '0 0 0 2px #4DB6AC22',
            },
            '& input': {
              padding: '10px 12px',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 400,
            color: '#546E7A',
            fontSize: '0.9rem',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: '#F7FAFC',
          borderRadius: 10,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CFD8DC',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#26A69A',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#26A69A',
            boxShadow: '0 0 0 2px rgba(38, 166, 154, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'capitalize',
          padding: '8px 20px',
          fontWeight: 500,
          fontSize: '13px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          },
          '&:disabled': {
            background: '#CFD8DC',
            color: '#B0BEC5',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #26A69A, #4DB6AC)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(45deg, #4DB6AC, #26A69A)',
          },
        },
        outlined: {
          borderColor: '#FF7043',
          color: '#FF7043',
          '&:hover': {
            borderColor: '#F4511E',
            color: '#F4511E',
            background: 'rgba(255, 112, 67, 0.05)',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: '0 6px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 'none',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: 400,
          background: '#FFFFFF',
          borderRadius: '8px',
          '&:first-child': {
            borderTopLeftRadius: '10px',
            borderBottomLeftRadius: '10px',
          },
          '&:last-child': {
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '10px',
          },
        },
        head: {
          background: 'linear-gradient(45deg, #E0F2F1, #B2DFDB)',
          color: '#263238',
          fontWeight: 600,
          fontSize: '14px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#CFD8DC',
          '&.Mui-checked': {
            color: '#26A69A',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#4DB6AC',
          },
        },
        track: {
          backgroundColor: '#B0BEC5',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          fontSize: '13px',
          padding: '10px 16px',
        },
        icon: {
          color: 'inherit',
          fontSize: '20px',
        },
      },
    },
  },
});

// Função auxiliar para formatar data
const formatarData = (dataString) => {
  if (!dataString) return 'Sem data';
  const data = new Date(dataString);
  return isNaN(data.getTime())
    ? 'Data inválida'
    : data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
};

const ExameForm = ({ noLayout = false, onExamCreated, onExamUpdated, onExamDeleted, onClose, onFormLoading, exame, isEditMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exameService = new ExameService();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      animal_name: '',
      tutor: '',
      veterinario: '',
      date: '',
      exam_type_id: '',
      clinic_id: '',
      value: '',
      observacaoPagamento: '',
      tipo_pagamento_id: '',
      emailText: '',
      pago: false,
      status: 'Pendente',
    },
  });

  const [examTypes, setExamTypes] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [tipoPagamentos, setTipoPagamentos] = useState([]);
  const [user, setUser] = useState(null);
  const [exameState, setExameState] = useState(null);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [emailSending, setEmailSending] = useState({ isSending: false, seconds: 0 });
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const animalName = watch('animal_name');
  const tipoPagamentoId = watch('tipo_pagamento_id');
  const pago = watch('pago');
  const status = watch('status');

  // Autocomplete suggestions
  const [animalSuggestions, setAnimalSuggestions] = useState(
    JSON.parse(localStorage.getItem('animalSuggestions')) || []
  );
  const [tutorSuggestions, setTutorSuggestions] = useState(
    JSON.parse(localStorage.getItem('tutorSuggestions')) || []
  );

  // Definir o tipo de exame padrão como "US Abdominal"
  useEffect(() => {
    if (!id && !isEditMode && examTypes.length > 0) {
      const usAbdominal = examTypes.find(type => type.name.toLowerCase() === 'us abdominal');
      if (usAbdominal) {
        setValue('exam_type_id', String(usAbdominal.id));
      } else {
        toast.warn('Tipo de exame "US Abdominal" não encontrado na lista.');
      }
    }
  }, [examTypes, setValue, id, isEditMode]);

  // Notify parent component about loading state
  useEffect(() => {
    onFormLoading?.(loading || emailSending.isSending);
  }, [loading, emailSending.isSending, onFormLoading]);

  // Preencher formulário com dados de exame quando em modo de edição via modal
  useEffect(() => {
    if (isEditMode && exame && !id) {
      setExameState(exame);
      setValue('animal_name', exame.animal_name || '');
      setValue('tutor', exame.tutor || '');
      setValue('veterinario', exame.veterinario || '');
      setValue('date', exame.date ? new Date(exame.date).toISOString().split('T')[0] : '');
      setValue('exam_type_id', exame.exam_type_id ? String(exame.exam_type_id) : '');
      setValue('clinic_id', exame.clinic_id ? String(exame.clinic_id) : '');
      setValue('value', exame.value ? String(exame.value) : '');
      setValue('tipo_pagamento_id', exame.tipo_pagamento_id ? String(exame.tipo_pagamento_id) : '');
      setValue('observacaoPagamento', exame.observacaoPagamento || '');
      setValue('pago', exame.pago || false);
      setValue('status', exame.status || 'Pendente');
    }
  }, [exame, isEditMode, setValue, id]);

  // Carregamento de todos os dados em paralelo
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const promises = [
          api.get('/api/exames/tipos'),
          api.get('/api/clinicas'),
          api.get('/api/tipos-pagamento'),
          api.get('/api/auth/me'),
        ];

        if (id && !isEditMode) {
          promises.push(api.get(`/api/exames/${id}`));
          promises.push(
            api.get(`/api/logs/exame/${id}`).catch((error) => {
              if (error.response?.status === 404) {
                return { data: [] };
              }
              throw error;
            })
          );
        }

        const [
          examTypesRes,
          clinicasRes,
          tiposPagamentoRes,
          userRes,
          exameRes,
          emailLogsRes,
        ] = await Promise.all(promises);

        setExamTypes(examTypesRes.data || []);
        setClinicas(
          clinicasRes.data
            ? [...clinicasRes.data].sort((a, b) => a.name.localeCompare(b.name))
            : []
        );
        setTipoPagamentos(
          tiposPagamentoRes.data
            ? [...tiposPagamentoRes.data].sort((a, b) => a.nome.localeCompare(b.nome))
            : []
        );
        setUser(userRes.data);

        if (id && exameRes && !isEditMode) {
          const fetchedExame = exameRes.data;
          setExameState(fetchedExame);
          setValue('animal_name', fetchedExame.animal_name || '');
          setValue('tutor', fetchedExame.tutor || '');
          setValue('veterinario', fetchedExame.veterinario || '');
          setValue('date', fetchedExame.date ? new Date(fetchedExame.date).toISOString().split('T')[0] : '');
          setValue('exam_type_id', fetchedExame.exam_type_id ? String(fetchedExame.exam_type_id) : '');
          setValue('clinic_id', fetchedExame.clinic_id ? String(fetchedExame.clinic_id) : '');
          setValue('value', fetchedExame.value ? String(fetchedExame.value) : '');
          setValue('tipo_pagamento_id', fetchedExame.tipo_pagamento_id ? String(fetchedExame.tipo_pagamento_id) : '');
          setValue('observacaoPagamento', fetchedExame.observacaoPagamento || '');
          setValue('pago', fetchedExame.pago || false);
          setValue('status', fetchedExame.status || 'Pendente');
          if (emailLogsRes) {
            setEmailLogs(emailLogsRes.data || []);
          }
        }
      } catch (error) {
        toast.error('Erro ao carregar dados: ' + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue, isEditMode]);

  // Timer para envio de e-mail
  useEffect(() => {
    let emailTimerRef;
    if (emailSending.isSending) {
      emailTimerRef = setInterval(() => {
        setEmailSending((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(emailTimerRef);
  }, [emailSending.isSending]);

  // Manipulação de arquivos
  const handleFileChange = useCallback(() => {
    const files = fileInputRef.current?.files;
    if (files) {
      const previews = Array.from(files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setFilePreviews(previews);
    }
  }, []);

  // Envio de e-mail
  const handleSendEmail = useCallback(
    async (isAutoEmail = false) => {
      setEmailSending({ isSending: true, seconds: 0 });
      const { success, emailLogs: updatedEmailLogs } = await exameService.handleSendEmail(id || exame?.id, exameState, watch('emailText'), isAutoEmail);
      if (success) {
        setEmailLogs(updatedEmailLogs);
      }
      setEmailSending({ isSending: false, seconds: 0 });
    },
    [id, exame, exameState, watch, exameService]
  );

  // Reenvio de e-mail
  const handleResendEmail = async (logId) => {
    setEmailSending({ isSending: true, seconds: 0 });
    const { success, emailLogs: updatedEmailLogs } = await exameService.handleResendEmail(id || exame?.id, logId, watch('emailText'));
    if (success) {
      setEmailLogs(updatedEmailLogs);
    }
    setEmailSending({ isSending: false, seconds: 0 });
  };

  // Manipulação de pagamento
  const handlePagamentoChange = async (e) => {
    const isChecked = e.target.checked;
    setLoading(true);
    const result = await exameService.handlePagamentoChange(
      id || exame?.id,
      exameState,
      isChecked,
      tipoPagamentoId,
      watch('observacaoPagamento'),
      setValue,
      setExameState
    );
    if (!result.success) {
      setValue('pago', exameState?.pago || false);
    }
    setLoading(false);
  };

  // Manipulação de status
  const handleStatusChange = async (e) => {
    const isChecked = e.target.checked;
    const newStatus = isChecked ? 'Concluído' : 'Pendente';
    setValue('status', newStatus);
    if (id || exame?.id) {
      setLoading(true);
      try {
        const response = await api.put(`/api/exames/${id || exame?.id}`, {
          ...exameState,
          status: newStatus,
        });
        setExameState(response.data);
        toast.success(`Status atualizado para ${newStatus}`);
      } catch (error) {
        toast.error('Erro ao atualizar status: ' + (error.response?.data?.error || error.message));
        setValue('status', exameState?.status || 'Pendente');
      } finally {
        setLoading(false);
      }
    } else {
      toast.info(`Status definido como ${newStatus}. Será salvo ao criar o exame.`);
    }
  };

  // Download de PDF
  const handleDownloadPdf = async () => {
    setLoading(true);
    await exameService.handleDownloadPdf(id || exame?.id, exameState, animalName);
    setLoading(false);
  };

  // Exclusão de exame
  const handleDeleteExame = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir o exame de ${animalName || 'este pet'}?`)) {
      return;
    }
    setLoading(true);
    try {
      const result = await exameService.handleDeleteExame(id || exame?.id, animalName, navigate);
      if (result.success) {
        onExamDeleted?.();
      } else {
        throw new Error(result.error || 'Falha ao excluir exame');
      }
    } catch (error) {
      toast.error('Erro ao excluir exame: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Submissão do formulário
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const files = fileInputRef.current?.files;
      const result = await exameService.handleSubmit(
        data,
        user,
        id || exame?.id,
        exameState,
        fileInputRef,
        setExameState,
        setValue,
        setAnimalSuggestions,
        setTutorSuggestions,
        animalSuggestions,
        tutorSuggestions,
        navigate,
        isEditMode ? onExamUpdated : onExamCreated,
        setEmailLogs,
        watch('emailText'),
        setEmailSending,
        isEditMode
      );
      if (result.success) {
        setSaveMessage(result.message);
        setValue('animal_name', '');
        setValue('tutor', '');
        setValue('veterinario', '');
        setValue('date', '');
        setValue('exam_type_id', '');
        setValue('clinic_id', '');
        setValue('value', '');
        setValue('tipo_pagamento_id', '');
        setValue('observacaoPagamento', '');
        setValue('pago', false);
        setValue('status', 'Pendente');
        setValue('emailText', '');
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        setFilePreviews([]);
        setTimeout(() => {
          setSaveMessage(null);
          if (isEditMode && onClose) {
            onClose();
          }
        }, 2000);
      } else {
        throw new Error(result.error || 'Falha ao salvar exame');
      }
    } catch (error) {
      toast.error('Erro ao salvar exame: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: noLayout ? 'transparent' : theme.palette.background.default,
          height: noLayout ? 'auto' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflow: noLayout ? 'visible' : 'hidden',
          py: noLayout ? 0 : { xs: 2, sm: 3 },
          boxSizing: 'border-box',
          '@media (max-width: 768px)': {
            overflow: noLayout ? 'visible' : 'hidden',
            py: noLayout ? 0 : 1.5,
          },
          '@media (max-width: 320px)': {
            py: noLayout ? 0 : 1,
          },
        }}
      >
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />
          </Box>
        )}
        <Paper
          sx={{
            width: '100%',
            maxWidth: { xs: '95%', sm: '90%', md: 900 },
            mx: 'auto',
            p: { xs: 2, sm: 3 },
            borderRadius: 12,
            flex: noLayout ? '0 0 auto' : 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: noLayout ? 'visible' : 'hidden',
            boxSizing: 'border-box',
            '@media (max-width: 768px)': {
              p: 2,
              maxWidth: '95%',
              overflow: 'visible',
            },
            '@media (max-width: 320px)': {
              p: 1.5,
              maxWidth: '98%',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              <LocalHospital
                sx={{
                  mr: 1,
                  color: '#26A69A',
                  fontSize: '1.8rem',
                  transition: 'color 0.3s ease',
                  '&:hover': { color: '#4DB6AC' },
                }}
              />
            </motion.div>
            <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
              {id || isEditMode ? 'Editar Exame' : 'Novo Exame'}
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: 'center', mb: 3, fontSize: '0.9rem' }}
          >
            {id || isEditMode ? 'Atualize os detalhes do exame.' : 'Registre um novo exame veterinário.'}
          </Typography>

          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                severity="success"
                icon={<Save sx={{ color: '#9CCC65' }} />}
                sx={{ mb: 2 }}
              >
                <AlertTitle>Sucesso</AlertTitle>
                {saveMessage}
              </Alert>
            </motion.div>
          )}
          {emailSending.isSending && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                severity="info"
                icon={<Email sx={{ color: '#FF7043' }} />}
                sx={{ mb: 2 }}
              >
                <AlertTitle>Enviando</AlertTitle>
                Enviando e-mail... ({emailSending.seconds}s)
              </Alert>
            </motion.div>
          )}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: theme.palette.text.primary }}
            >
              Status:{' '}
              <Box
                component="span"
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 8,
                  bgcolor:
                    status === 'Concluído'
                      ? theme.palette.success.main
                      : status === 'Pendente'
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontSize: '13px',
                }}
              >
                {status}
              </Box>
            </Typography>
          </Box>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
              Dados do Paciente
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(auto-fit, minmax(200px, 1fr))',
                },
                gap: 2,
                mb: 3,
              }}
            >
              <Autocomplete
                freeSolo
                options={animalSuggestions}
                inputValue={animalName || ''}
                onInputChange={(e, value) => setValue('animal_name', value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...register('animal_name', { required: 'Nome do pet é obrigatório' })}
                    label="Nome do Pet"
                    error={!!errors.animal_name}
                    helperText={errors.animal_name?.message}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Pets
                            sx={{
                              color: '#9CCC65',
                              fontSize: '1.2rem',
                              transition: 'color 0.3s ease',
                              '&:hover': { color: '#AED581' },
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                    size="small"
                  />
                )}
              />
              <Autocomplete
                freeSolo
                options={tutorSuggestions}
                value={watch('tutor') || ''}
                onChange={(e, value) => setValue('tutor', value || '')}
                onInputChange={(e, value) => setValue('tutor', value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...register('tutor')}
                    label="Tutor"
                    error={!!errors.tutor}
                    helperText={errors.tutor?.message}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{
                              color: '#FF7043',
                              fontSize: '1.2rem',
                              transition: 'color 0.3s ease',
                              '&:hover': { color: '#FF8A65' },
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                    size="small"
                  />
                )}
              />
              <TextField
                fullWidth
                label="Veterinário (opcional)"
                {...register('veterinario')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{
                          color: '#FF7043',
                          fontSize: '1.2rem',
                          transition: 'color 0.3s ease',
                          '&:hover': { color: '#FF8A65' },
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
                size="small"
              />
              <TextField
                fullWidth
                label="Data do Exame"
                {...register('date', { required: 'Data é obrigatória' })}
                type="date"
                InputLabelProps={{ shrink: true }}
                disabled={loading}
                error={!!errors.date}
                helperText={errors.date?.message}
                sx={{
                  '& input::-webkit-calendar-picker-indicator': {
                    filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(160deg)',
                    cursor: 'pointer',
                  },
                }}
                size="small"
              />
              <FormControl fullWidth error={!!errors.clinic_id} size="small">
                <InputLabel>Clínica</InputLabel>
                <Controller
                  name="clinic_id"
                  control={control}
                  rules={{ required: 'Clínica é obrigatória' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={loading}
                      label="Clínica"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <MenuItem value="">Selecione uma clínica</MenuItem>
                      {clinicas.map((clinica) => (
                        <MenuItem key={clinica.id} value={String(clinica.id)}>
                          {clinica.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.clinic_id && (
                  <Typography variant="caption" color="error">
                    {errors.clinic_id.message}
                  </Typography>
                )}
              </FormControl>
              <FormControl fullWidth error={!!errors.exam_type_id} size="small">
                <InputLabel>Tipo de Exame</InputLabel>
                <Controller
                  name="exam_type_id"
                  control={control}
                  rules={{ required: 'Tipo de exame é obrigatório' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={loading}
                      label="Tipo de Exame"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <MenuItem value="">Selecione um exame</MenuItem>
                      {examTypes.map((type) => (
                        <MenuItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.exam_type_id && (
                  <Typography variant="caption" color="error">
                    {errors.exam_type_id.message}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {user?.role === 'Admin' && (
  <>
    <Divider sx={{ my: 2, bgcolor: 'rgba(207, 216, 220, 0.3)' }} />
    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
      Arquivos e Pagamento
    </Typography>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr', // Uma coluna em telas pequenas
          sm: 'repeat(auto-fit, minmax(200px, 1fr))', // Colunas adaptáveis para outros campos
        },
        gap: 2,
        mb: 3,
      }}
    >
      <TextField
        fullWidth
        label="Valor do Exame"
        {...register('value', {
          required: 'Valor é obrigatório',
          min: { value: 0, message: 'Valor deve ser positivo' },
        })}
        type="number"
        inputProps={{ step: '0.01' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AttachMoney
                sx={{
                  color: '#FFA726',
                  fontSize: '1.2rem',
                  transition: 'color 0.3s ease',
                  '&:hover': { color: '#FFB300' },
                }}
              />
            </InputAdornment>
          ),
        }}
        disabled={loading}
        error={!!errors.value}
        helperText={errors.value?.message}
        size="small"
      />
      <FormControl fullWidth error={!!errors.tipo_pagamento_id} size="small">
        <InputLabel>Forma de Pagamento</InputLabel>
        <Controller
          name="tipo_pagamento_id"
          control={control}
          rules={{
            required: pago ? 'Forma de pagamento é obrigatória' : false,
          }}
          render={({ field }) => (
            <Select
              {...field}
              disabled={loading}
              label="Forma de Pagamento"
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
            >
              <MenuItem value="">Nenhuma</MenuItem>
              {tipoPagamentos.map((tipo) => (
                <MenuItem key={tipo.id} value={String(tipo.id)}>
                  {tipo.nome}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.tipo_pagamento_id && (
          <Typography variant="caption" color="error">
            {errors.tipo_pagamento_id.message}
          </Typography>
        )}
      </FormControl>
      <TextField
        fullWidth
        label="Observação de Pagamento"
        {...register('observacaoPagamento')}
        disabled={loading || !pago}
        size="small"
      />
      {/* Novo contêiner para FileInput e FormControlLabel */}
      <Box
        sx={{
          gridColumn: { sm: '1 / -1' }, // Ocupa toda a linha em sm ou maiores
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr', // Uma coluna em telas pequenas
            sm: '350px 350px', // Duas colunas de 310px para FileInput e Checkboxes
          },
          gap: 2,
          width: '100%',
        }}
      >
       <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            p: 2,
            bgcolor: '#E3F2FD',
            borderRadius: '10px',
            border: `1px solid ${blue[200]}`, // Corrigido com blue[200]
            width: '100%',
            maxWidth: '350px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          </Box>
          <FileInput
            type="file"
            accept=".pdf,image/jpeg,image/png"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={loading}
            id="file-input"
            sx={{
              bgcolor: '#BBDEFB',
              borderRadius: '8px',
              padding: '4px',
              '&:hover': { bgcolor: '#90CAF9' },
            }}
          />
          {filePreviews.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {filePreviews.map((preview, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{ display: 'block', mb: 0.3 }}
                >
                  <a
                    href={preview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1E88E5', textDecoration: 'none' }}
                  >
                    {preview.name}
                  </a>
                </Typography>
              ))}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            alignItems: 'center',
            p: 3,
            bgcolor: '#F1F8E9',
            borderRadius: '10px',
            border: `1px solid ${green[200]}`, // Corrigido com green[200]
            width: '100%',
            maxWidth: '350px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1, sm: 0 } }}>
           
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={pago}
                onChange={handlePagamentoChange}
                disabled={loading || emailSending.isSending}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#689F38',
                  },
                  '& .MuiSwitch-track': {
                    bgcolor: pago ? '#DCEDC8' : '#B0BEC5',
                  },
                }}
              />
            }
            label="Exame Pago"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontWeight: 400,
                color: theme.palette.text.primary,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                margin: 0,
              },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={status === 'Concluído'}
                onChange={handleStatusChange}
                disabled={loading || emailSending.isSending}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#689F38',
                  },
                  '& .MuiSwitch-track': {
                    bgcolor: status === 'Concluído' ? '#DCEDC8' : '#B0BEC5',
                  },
                }}
              />
            }
            label="Exame Concluído"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontWeight: 400,
                color: theme.palette.text.primary,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                margin: 0,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  </>
)}

            <Box
              sx={{
                mt: 3,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: 'flex-start',
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack sx={{ color: '#FF7043', fontSize: '1.1rem' }} />}
                onClick={() => (onClose ? onClose() : navigate('/exames'))}
                disabled={loading || emailSending.isSending}
                size="small"
              >
                {onClose ? 'Fechar' : 'Voltar'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Save sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
                type="submit"
                disabled={loading || emailSending.isSending}
                size="small"
              >
                Salvar
              </Button>
              {user?.role === 'Admin' && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Email sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
                    onClick={() => handleSendEmail(false)}
                    disabled={loading || emailSending.isSending || ((id || exame?.id) && !exameState?.pdf_path)}
                    size="small"
                  >
                    Enviar E-mail
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
                    onClick={handleDownloadPdf}
                    disabled={loading || emailSending.isSending || ((id || exame?.id) && !exameState?.pdf_path)}
                    size="small"
                  >
                    Baixar PDF
                  </Button>
                  {(id || exame?.id) && (
                    <Button
                      variant="contained"
                      startIcon={<Delete sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
                      onClick={handleDeleteExame}
                      disabled={loading || emailSending.isSending}
                      sx={{
                        bgcolor: theme.palette.error.main,
                        '&:hover': { bgcolor: theme.palette.error.dark },
                      }}
                      size="small"
                    >
                      Excluir
                    </Button>
                  )}
                </>
              )}
            </Box>
          </form>

          {(id || exame?.id) && user?.role === 'Admin' && emailLogs.length > 0 && (
            <Box
              sx={{
                mt: 3,
                maxHeight: '150px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#F7FAFC',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#80DEEA',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#4DD0E1',
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                Logs de E-mails
              </Typography>
              <Table sx={{ minWidth: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Destinatário</TableCell>
                    <TableCell>Erro</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emailLogs.map((log, index) => (
                    <TableRow key={log.id} sx={{ '&:hover': { background: '#E0F2F1' } }}>
                      <TableCell>{formatarData(log.createdAt)}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.4,
                            borderRadius: 8,
                            bgcolor:
                              log.status === 'Concluído'
                                ? theme.palette.success.main
                                : log.status === 'Pendente'
                                  ? theme.palette.warning.main
                                  : theme.palette.error.main,
                            color: '#FFFFFF',
                            fontWeight: 500,
                            fontSize: '12px',
                            display: 'inline-flex',
                          }}
                        >
                          {log.status}
                        </Box>
                      </TableCell>
                      <TableCell>{log.sent_to}</TableCell>
                      <TableCell>{log.error_message || '-'}</TableCell>
                      <TableCell>
                        {log.status === 'Falhou' && (
                          <Button
                            variant="outlined"
                            startIcon={<Send sx={{ color: '#FF7043', fontSize: '1.1rem' }} />}
                            onClick={() => handleResendEmail(log.id)}
                            disabled={loading || emailSending.isSending}
                            size="small"
                          >
                            Reenviar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );

  return noLayout ? formContent : <Layout>{formContent}</Layout>;
};

export default React.memo(ExameForm);
