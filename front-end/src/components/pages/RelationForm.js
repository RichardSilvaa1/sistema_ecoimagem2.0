import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import { Save, ArrowBack, Link as LinkIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema completo (copiado do ExameForm)
const theme = createTheme({
  palette: {
    primary: { main: '#26A69A', dark: '#00897B', light: '#4DB6AC' },
    secondary: { main: '#FF7043', dark: '#F4511E', light: '#FF8A65' },
    success: { main: '#9CCC65', light: '#AED581' },
    warning: { main: '#FFA726', light: '#FFB300' },
    error: { main: '#EF5350', dark: '#E53935' },
    background: { default: '#ECEFF1', paper: '#FFFFFF' },
    text: { primary: '#263238', secondary: '#546E7A' },
    grey: { 300: '#CFD8DC', 400: '#B0BEC5' },
  },
  typography: {
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h5: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.5rem' },
    h6: { fontWeight: 500, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 400, color: '#546E7A', fontSize: '0.95rem' },
    caption: { color: '#546E7A', fontSize: '0.8rem' },
    body1: { fontSize: '0.9rem', fontWeight: 400 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.06)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
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
            '&:hover fieldset': { borderColor: '#26A69A' },
            '&.Mui-focused fieldset': { borderColor: '#26A69A', boxShadow: '0 0 0 2px #4DB6AC22' },
            '& input': { padding: '10px 12px' },
          },
          '& .MuiInputLabel-root': { fontWeight: 400, color: '#546E7A', fontSize: '0.9rem' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: '#F7FAFC',
          borderRadius: 10,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CFD8DC' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#26A69A' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#26A69A', boxShadow: '0 0 0 2px rgba(38, 166, 154, 0.15)' },
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
          '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' },
          '&:disabled': { background: '#CFD8DC', color: '#B0BEC5' },
        },
        contained: {
          background: 'linear-gradient(45deg, #26A69A, #4DB6AC)',
          color: '#FFFFFF',
          '&:hover': { background: 'linear-gradient(45deg, #4DB6AC, #26A69A)' },
        },
        outlined: {
          borderColor: '#FF7043',
          color: '#FF7043',
          '&:hover': { borderColor: '#F4511E', color: '#F4511E', background: 'rgba(255, 112, 67, 0.05)' },
        },
      },
    },
    MuiTable: {
      styleOverrides: { root: { borderCollapse: 'separate', borderSpacing: '0 6px' } },
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
          '&:first-child': { borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' },
          '&:last-child': { borderTopRightRadius: '10px', borderBottomRightRadius: '10px' },
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
          '&.Mui-checked': { color: '#26A69A' },
          '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4DB6AC' },
        },
        track: { backgroundColor: '#B0BEC5' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)', fontSize: '13px', padding: '10px 16px' },
        icon: { color: 'inherit', fontSize: '20px' },
      },
    },
  },
});

const RelationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      expense_id: '',
      related_type: '',
      related_id: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
    if (id) fetchRelation();
  }, [id]);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.data || res.data);
    } catch (error) {
      toast.error('Erro ao carregar despesas: ' + (error.response?.data?.error || error.message));
    }
  };

  const fetchRelation = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/relations/${id}`);
      setValue('expense_id', res.data.expense_id ? String(res.data.expense_id) : '');
      setValue('related_type', res.data.related_type || '');
      setValue('related_id', res.data.related_id || '');
    } catch (error) {
      toast.error('Erro ao carregar relação: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/relations/${id}`, data);
        setSaveMessage('Relação atualizada com sucesso!');
      } else {
        await api.post('/relations', data);
        setSaveMessage('Relação criada com sucesso!');
      }
      setTimeout(() => {
        setSaveMessage(null);
        navigate('/relacoes');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao salvar relação: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            py: { xs: 2, sm: 3 },
            boxSizing: 'border-box',
            '@media (max-width: 768px)': { py: 1.5 },
            '@media (max-width: 320px)': { py: 1 },
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
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxSizing: 'border-box',
              '@media (max-width: 768px)': { p: 2, maxWidth: '95%', overflow: 'visible' },
              '@media (max-width: 320px)': { p: 1.5, maxWidth: '98%' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                <LinkIcon sx={{ mr: 1, color: '#26A69A', fontSize: '1.8rem', '&:hover': { color: '#4DB6AC' } }} />
              </motion.div>
              <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                {id ? 'Editar Relação' : 'Nova Relação'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, fontSize: '0.9rem' }}>
              {id ? 'Atualize os detalhes da relação.' : 'Crie uma nova relação financeira.'}
            </Typography>

            {saveMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Alert severity="success" icon={<Save sx={{ color: '#9CCC65' }} />} sx={{ mb: 2 }}>
                  <AlertTitle>Sucesso</AlertTitle>
                  {saveMessage}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Divider sx={{ my: 2, bgcolor: 'rgba(207, 216, 220, 0.3)' }} />
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                Dados da Relação
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(200px, 1fr))' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <FormControl fullWidth error={!!errors.expense_id} size="small">
                  <InputLabel>Despesa</InputLabel>
                  <Controller
                    name="expense_id"
                    control={control}
                    rules={{ required: 'Despesa é obrigatória' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        disabled={loading}
                        label="Despesa"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="">Selecione uma despesa</MenuItem>
                        {expenses.map((exp) => (
                          <MenuItem key={exp.id} value={String(exp.id)}>
                            R${parseFloat(exp.amount).toFixed(2)} - {new Date(exp.due_date).toLocaleDateString('pt-BR')}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.expense_id && (
                    <Typography variant="caption" color="error">
                      {errors.expense_id.message}
                    </Typography>
                  )}
                </FormControl>
                <TextField
                  fullWidth
                  label="Tipo Relacionado"
                  {...register('related_type', { required: 'Tipo é obrigatório' })}
                  error={!!errors.related_type}
                  helperText={errors.related_type?.message}
                  disabled={loading}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="ID Relacionado"
                  {...register('related_id', { required: 'ID é obrigatório' })}
                  error={!!errors.related_id}
                  helperText={errors.related_id?.message}
                  disabled={loading}
                  size="small"
                />
              </Box>

              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-start' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack sx={{ color: '#FF7043', fontSize: '1.1rem' }} />}
                  onClick={() => navigate('/relacoes')}
                  disabled={loading}
                  size="small"
                >
                  Voltar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
                  type="submit"
                  disabled={loading}
                  size="small"
                >
                  Salvar
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default RelationForm;