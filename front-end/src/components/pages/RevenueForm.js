import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import { Save, ArrowBack, AttachMoney } from '@mui/icons-material';
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

const RevenueForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      amount: '',
      due_date: '',
      status: 'Pendente',
      payment_method: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    if (id) fetchRevenue();
  }, [id]);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/financas/revenues/${id}`);
      setValue('amount', res.data.amount);
      setValue('due_date', res.data.due_date ? new Date(res.data.due_date).toISOString().split('T')[0] : '');
      setValue('status', res.data.status || 'Pendente');
      setValue('payment_method', res.data.payment_method || '');
    } catch (error) {
      toast.error('Erro ao carregar receita: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/api/financas/revenues/${id}`, data);
        setSaveMessage('Receita atualizada com sucesso!');
      } else {
        await api.post('/api/financas/revenues', data);
        setSaveMessage('Receita criada com sucesso!');
      }
      setTimeout(() => {
        setSaveMessage(null);
        navigate('/receitas');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao salvar receita: ' + (error.response?.data?.error || error.message));
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
                <AttachMoney sx={{ mr: 1, color: '#9CCC65', fontSize: '1.8rem', '&:hover': { color: '#AED581' } }} />
              </motion.div>
              <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                {id ? 'Editar Receita' : 'Nova Receita'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, fontSize: '0.9rem' }}>
              {id ? 'Atualize os detalhes da receita.' : 'Registre uma nova receita financeira.'}
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
                Dados da Receita
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(200px, 1fr))' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="Valor"
                  type="number"
                  {...register('amount', { required: 'Valor é obrigatório', min: { value: 0, message: 'Valor deve ser positivo' } })}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  disabled={loading}
                  size="small"
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ color: '#9CCC65', fontSize: '1.2rem', '&:hover': { color: '#AED581' } }} />,
                    inputProps: { step: '0.01' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Data de Vencimento"
                  type="date"
                  {...register('due_date', { required: 'Data é obrigatória' })}
                  error={!!errors.due_date}
                  helperText={errors.due_date?.message}
                  disabled={loading}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& input::-webkit-calendar-picker-indicator': { filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(160deg)', cursor: 'pointer' } }}
                />
                <TextField
                  fullWidth
                  label="Status"
                  {...register('status')}
                  disabled={loading}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Método de Pagamento"
                  {...register('payment_method')}
                  disabled={loading}
                  size="small"
                />
              </Box>

              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-start' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack sx={{ color: '#FF7043', fontSize: '1.1rem' }} />}
                  onClick={() => navigate('/receitas')}
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

export default RevenueForm;
