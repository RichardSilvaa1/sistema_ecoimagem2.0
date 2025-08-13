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
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Autocomplete,
} from '@mui/material';
import { Save, ArrowBack, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { NumericFormat } from 'react-number-format'; // Alterado de NumberFormat para NumericFormat
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema reutilizável (mantido inalterado)
const theme = createTheme({
  palette: {
    primary: { main: '#26A69A', dark: '#00897B', light: '#4DB6AC' },
    secondary: { main: '#FF7043', dark: '#F4511E', light: '#FF8A65' },
    success: { main: '#9CCC65', light: '#AED581' },
    warning: { main: '#FFA726', light: '#FFB300' },
    error: { main: '#EF5350', dark: '#E53935' },
    background: { default: '#ECEFF1', paper: 'rgba(255, 255, 255, 0.9)' },
    text: { primary: '#263238', secondary: '#546E7A' },
    grey: { 300: '#CFD8DC', 400: '#B0BEC5' },
  },
  typography: {
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h5: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.6rem' },
    h6: { fontWeight: 500, fontSize: '1.2rem' },
    subtitle1: { fontWeight: 400, color: '#546E7A', fontSize: '1rem' },
    caption: { color: '#546E7A', fontSize: '0.85rem' },
    body1: { fontSize: '0.95rem', fontWeight: 400 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'saturate(180%) blur(10px)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': { boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: '#F7FAFC',
          borderRadius: 12,
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover fieldset': { borderColor: '#26A69A' },
            '&.Mui-focused fieldset': { borderColor: '#26A69A', boxShadow: '0 0 0 3px #4DB6AC44' },
            '& input': { padding: '12px 14px' },
          },
          '& .MuiInputLabel-root': { fontWeight: 500, color: '#546E7A', fontSize: '1rem' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'capitalize',
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: '14px',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(0,0,0,0.15)' },
          '&:disabled': { background: '#CFD8DC', color: '#B0BEC5', boxShadow: 'none', transform: 'none' },
        },
        contained: {
          background: 'linear-gradient(45deg, #26A69A, #4DB6AC)',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(38, 166, 154, 0.6)',
          '&:hover': { background: 'linear-gradient(45deg, #4DB6AC, #26A69A)' },
        },
        outlined: {
          borderColor: '#FF7043',
          color: '#FF7043',
          '&:hover': { borderColor: '#F4511E', color: '#F4511E', background: 'rgba(255, 112, 67, 0.08)' },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.09)', fontSize: '14px', padding: '14px 20px' },
        icon: { color: 'inherit', fontSize: '22px' },
      },
    },
  },
});

// Componente para campo moeda
const CurrencyInput = React.forwardRef(({ onChange, name, value, error, helperText, disabled }, ref) => (
  <NumericFormat // Alterado de NumberFormat para NumericFormat
    getInputRef={ref}
    value={value}
    onValueChange={(values) => onChange(values.floatValue)} // Ajustado para 'values'
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={2}
    fixedDecimalScale
    prefix="R$ "
    allowNegative={false}
    disabled={disabled}
    customInput={TextField}
    fullWidth
    label="Valor"
    error={!!error}
    helperText={helperText}
    inputProps={{ 'aria-label': 'Valor da despesa' }}
    size="small"
  />
));

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: '',
      expense_date: '', // Alinhado com o backend
      due_date: '',
      category_id: '',
      status: 'pendente',
      payment_method: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [categories, setCategories] = useState([]);

  // Opções para status e payment_method baseadas no ENUM do backend
  const statusOptions = [
    { label: 'Pago', value: 'pago' },
    { label: 'Pendente', value: 'pendente' },
    { label: 'Parcelado', value: 'parcelado' },
  ];

  const paymentMethodOptions = [
    { label: 'Dinheiro', value: 'dinheiro' },
    { label: 'Cartão de Crédito', value: 'cartao de credito' },
    { label: 'Cartão de Débito', value: 'cartao de debito' },
    { label: 'Transferência', value: 'transferencia' },
    { label: 'Pix', value: 'pix' },
    { label: 'Boleto', value: 'boleto' },
  ];

  useEffect(() => {
    fetchCategories();
    if (id) fetchExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/financas/categories');
      setCategories(res.data || []);
    } catch (error) {
      toast.error('Erro ao carregar categorias: ' + (error.response?.data?.error || error.message));
    }
  };

  const fetchExpense = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/financas/expenses/${id}`);
      setValue('amount', res.data.amount);
      setValue('expense_date', res.data.expense_date ? new Date(res.data.expense_date).toISOString().split('T')[0] : '');
      setValue('due_date', res.data.due_date ? new Date(res.data.due_date).toISOString().split('T')[0] : '');
      setValue('category_id', res.data.category_id ? String(res.data.category_id) : '');
      setValue('status', res.data.status || 'pendente');
      setValue('payment_method', res.data.payment_method || '');
    } catch (error) {
      toast.error('Erro ao carregar despesa: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Validações
  const validateDueDate = (value) => {
    if (!value) return 'Data de vencimento é obrigatória';
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return 'A data de vencimento não pode ser no passado';
    return true;
  };

  const validateExpenseDate = (value) => {
    if (!value) return 'Data da despesa é obrigatória';
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected > today) return 'A data da despesa não pode ser no futuro';
    return true;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/api/financas/expenses/${id}`, data);
        setSaveMessage('Despesa atualizada com sucesso!');
      } else {
        await api.post('/api/financas/expenses', data);
        setSaveMessage('Despesa criada com sucesso!');
      }
      setTimeout(() => {
        setSaveMessage(null);
        navigate('/despesas');
      }, 1800);
    } catch (error) {
      toast.error('Erro ao salvar despesa: ' + (error.response?.data?.error || error.message));
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
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            py: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2 },
            boxSizing: 'border-box',
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <CircularProgress size={32} sx={{ color: theme.palette.primary.main }} />
            </Box>
          )}

          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            sx={{
              width: '100%',
              maxWidth: 920,
              mx: 'auto',
              p: { xs: 3, sm: 5 },
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
            elevation={6}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <AttachMoney sx={{ mr: 1, color: theme.palette.warning.main, fontSize: '2rem' }} />
              </motion.div>
              <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                {id ? 'Editar Despesa' : 'Nova Despesa'}
              </Typography>
            </Box>

            <Typography
              variant="subtitle1"
              sx={{ textAlign: 'center', mb: 4, fontSize: '1rem', color: theme.palette.text.secondary }}
            >
              {id ? 'Atualize os detalhes da despesa.' : 'Registre uma nova despesa financeira.'}
            </Typography>

            {saveMessage && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Alert severity="success" icon={<Save sx={{ color: theme.palette.success.main }} />} sx={{ mb: 3 }}>
                  <AlertTitle>Sucesso</AlertTitle>
                  {saveMessage}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }} noValidate>
              <Divider sx={{ my: 3, bgcolor: theme.palette.grey[300] }} />
              <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.primary, fontWeight: 600 }}>
                Dados da Despesa
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(250px, 1fr))' },
                  gap: 20,
                  mb: 4,
                }}
              >
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: 'Valor é obrigatório', min: { value: 0.01, message: 'Valor deve ser positivo' } }}
                  render={({ field }) => (
                    <CurrencyInput
                      {...field}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                      disabled={loading}
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label="Data da Despesa"
                  type="date"
                  {...register('expense_date', { validate: validateExpenseDate })}
                  error={!!errors.expense_date}
                  helperText={errors.expense_date?.message}
                  disabled={loading}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 'aria-label': 'Data da despesa' }}
                  sx={{
                    '& input::-webkit-calendar-picker-indicator': {
                      filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(160deg)',
                      cursor: 'pointer',
                    },
                    background: '#F7FAFC',
                    borderRadius: 12,
                  }}
                />

                <TextField
                  fullWidth
                  label="Data de Vencimento"
                  type="date"
                  {...register('due_date', { validate: validateDueDate })}
                  error={!!errors.due_date}
                  helperText={errors.due_date?.message}
                  disabled={loading}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 'aria-label': 'Data de vencimento da despesa' }}
                  sx={{
                    '& input::-webkit-calendar-picker-indicator': {
                      filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(160deg)',
                      cursor: 'pointer',
                    },
                    background: '#F7FAFC',
                    borderRadius: 12,
                  }}
                />

                <Controller
                  name="category_id"
                  control={control}
                  rules={{ required: 'Categoria é obrigatória' }}
                  render={({ field }) => (
                    <Autocomplete
                      options={categories}
                      getOptionLabel={(option) => option.name || ''}
                      loadingText="Carregando..."
                      noOptionsText="Nenhuma categoria encontrada"
                      value={categories.find((cat) => String(cat.id) === field.value) || null}
                      onChange={(_, data) => field.onChange(data ? String(data.id) : '')}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Categoria"
                          size="small"
                          error={!!errors.category_id}
                          helperText={errors.category_id?.message}
                          inputProps={{
                            ...params.inputProps,
                            'aria-label': 'Categoria da despesa',
                            placeholder: 'Selecione uma categoria',
                          }}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'Status é obrigatório' }}
                  render={({ field }) => (
                    <Autocomplete
                      options={statusOptions}
                      getOptionLabel={(option) => option.label}
                      value={statusOptions.find((opt) => opt.value === field.value) || null}
                      onChange={(_, data) => field.onChange(data ? data.value : '')}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                          size="small"
                          error={!!errors.status}
                          helperText={errors.status?.message}
                          inputProps={{
                            ...params.inputProps,
                            'aria-label': 'Status da despesa',
                            placeholder: 'Selecione um status',
                          }}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="payment_method"
                  control={control}
                  rules={{ required: 'Método de pagamento é obrigatório' }}
                  render={({ field }) => (
                    <Autocomplete
                      options={paymentMethodOptions}
                      getOptionLabel={(option) => option.label}
                      value={paymentMethodOptions.find((opt) => opt.value === field.value) || null}
                      onChange={(_, data) => field.onChange(data ? data.value : '')}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Método de Pagamento"
                          size="small"
                          error={!!errors.payment_method}
                          helperText={errors.payment_method?.message}
                          inputProps={{
                            ...params.inputProps,
                            'aria-label': 'Método de pagamento',
                            placeholder: 'Selecione um método',
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-start' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack sx={{ fontSize: '1.3rem' }} />}
                  onClick={() => navigate('/despesas')}
                  disabled={loading}
                  size="medium"
                  aria-label="Voltar para lista de despesas"
                >
                  Voltar
                </Button>

                <Button
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress size={18} sx={{ color: 'white' }} />
                    ) : (
                      <Save sx={{ color: '#FFFFFF', fontSize: '1.3rem' }} />
                    )
                  }
                  type="submit"
                  disabled={loading}
                  size="medium"
                  aria-label="Salvar despesa"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default ExpenseForm;