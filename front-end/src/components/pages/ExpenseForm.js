import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  Autocomplete,
  Container,
  Grid,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  AttachMoney,
  CalendarToday,
  Category,
  Payment,
  CheckCircle,
  Info,
  Edit,
  FormatListNumbered,
  ErrorOutline,
  MonetizationOn,
  CreditCard,
  Pix,
  AccountBalance,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericFormat } from 'react-number-format';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema (mantido igual ao original)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0F766E', light: '#14B8A6', dark: '#134E4A', contrastText: '#FFFFFF' },
    secondary: { main: '#DC2626', light: '#EF4444', dark: '#991B1B' },
    success: { main: '#059669', light: '#10B981', dark: '#047857' },
    warning: { main: '#D97706', light: '#F59E0B', dark: '#92400E' },
    error: { main: '#DC2626', light: '#EF4444', dark: '#991B1B' },
    info: { main: '#1E40AF', light: '#3B82F6', dark: '#1E3A8A' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#475569' },
    grey: {
      50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
      400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
      800: '#1E293B', 900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: { fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.025em' },
    h4: { fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.3, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.4, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    subtitle1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.5 },
    subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.5 },
    body1: { fontSize: '0.875rem', lineHeight: 1.6, fontWeight: 400 },
    body2: { fontSize: '0.75rem', lineHeight: 1.5, fontWeight: 400 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4, fontWeight: 400, color: '#64748B' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { background: '#F1F5F9' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#CBD5E1',
            borderRadius: 4,
            '&:hover': { backgroundColor: '#94A3B8' },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          },
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '12px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { transform: 'translateY(-1px)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
          boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)',
            boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.4)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: 'rgba(15, 118, 110, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F8FAFC',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#F1F5F9',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' },
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0F766E',
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(15, 118, 110, 0.1)',
              },
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, border: '1px solid', fontSize: '0.875rem' },
        standardSuccess: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', color: '#166534' },
        standardError: { backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' },
        standardWarning: { backgroundColor: '#FFFBEB', borderColor: '#FED7AA', color: '#92400E' },
        standardInfo: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E40AF' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { transform: 'translateY(-1px)', cursor: 'pointer' },
        },
      },
    },
  },
});

// Componente para campo moeda
const CurrencyInput = React.forwardRef(({ onChange, name, value, error, helperText, disabled }, ref) => (
  <NumericFormat
    getInputRef={ref}
    value={value}
    onValueChange={(values) => onChange(values.floatValue)}
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={2}
    fixedDecimalScale
    prefix="R$ "
    allowNegative={false}
    disabled={disabled}
    customInput={TextField}
    fullWidth
    label="Valor da Despesa"
    error={!!error}
    helperText={helperText}
    inputProps={{ 'aria-label': 'Valor da despesa', 'aria-describedby': 'amount-error' }}
    InputProps={{
      startAdornment: <AttachMoney sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />,
    }}
  />
));

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expenseState, setExpenseState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      description: '',
      amount: '',
      due_date: '',
      paid_at: '',
      category_id: '',
      status: 'pendente',
      payment_method: '',
      installments: '',
    },
  });

  const status = watch('status');
  const due_date = watch('due_date');
  const paid_at = watch('paid_at');
  const isEditing = !!id;

  // Memorizar opções para performance
  const statusOptions = useMemo(
    () => [
      { label: 'Pago', value: 'pago', color: 'success', description: 'Despesa já quitada' },
      { label: 'Pendente', value: 'pendente', color: 'warning', description: 'Aguardando pagamento' },
      { label: 'Atrasado', value: 'atrasado', color: 'error', description: 'Vencida e não paga' },
      { label: 'Cancelado', value: 'cancelado', color: 'secondary', description: 'Despesa anulada' },
      { label: 'Parcelado', value: 'parcelado', color: 'info', description: 'Dividida em parcelas' },
    ],
    []
  );

  const paymentMethodOptions = useMemo(
    () => [
      { label: 'Dinheiro', value: 'dinheiro', icon: <MonetizationOn />, description: 'Pagamento em espécie' },
      { label: 'Cartão de Crédito', value: 'cartao de credito', icon: <CreditCard />, description: 'Pagamento com cartão de crédito' },
      { label: 'Cartão de Débito', value: 'cartao de debito', icon: <CreditCard />, description: 'Pagamento com cartão de débito' },
      { label: 'Transferência', value: 'transferencia', icon: <AccountBalance />, description: 'Transferência bancária' },
      { label: 'PIX', value: 'pix', icon: <Pix />, description: 'Pagamento instantâneo via PIX' },
      { label: 'Boleto', value: 'boleto', icon: <AccountBalance />, description: 'Pagamento via boleto bancário' },
    ],
    []
  );

  // Carregar categorias e dados da despesa
  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchExpense();
    } else {
      reset();
    }
  }, [id, reset]);

  // Sincronizar formulário com expenseState
  useEffect(() => {
    if (expenseState) {
      setValue('status', expenseState.status || 'pendente');
      setValue('paid_at', expenseState.paid_at ? new Date(expenseState.paid_at).toISOString().split('T')[0] : '');
      setValue('description', expenseState.description || '');
      setValue('amount', expenseState.amount || '');
      setValue('due_date', expenseState.due_date ? new Date(expenseState.due_date).toISOString().split('T')[0] : '');
      setValue('category_id', expenseState.category_id ? String(expenseState.category_id) : '');
      setValue('payment_method', expenseState.payment_method || '');
      setValue('installments', expenseState.installments || '');
    }
  }, [expenseState, setValue]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/financas/categories');
      setCategories(res.data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias: ' + (error.response?.data?.error || error.message));
    }
  };

  const fetchExpense = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/financas/expenses/${id}`);
      console.log('Dados recebidos do back-end:', res.data); // Log para depuração
      setExpenseState(res.data);
      setValue('description', res.data.description || '');
      setValue('amount', res.data.amount || '');
      setValue('due_date', res.data.due_date ? new Date(res.data.due_date).toISOString().split('T')[0] : '');
      setValue('paid_at', res.data.paid_at ? new Date(res.data.paid_at).toISOString().split('T')[0] : '');
      setValue('category_id', res.data.category_id ? String(res.data.category_id) : '');
      setValue('status', res.data.status || 'pendente');
      setValue('payment_method', res.data.payment_method || '');
      setValue('installments', res.data.installments || '');
    } catch (error) {
      console.error('Erro ao carregar despesa:', error);
      toast.error('Erro ao carregar despesa: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!isValid) {
      toast.error('Por favor, corrija os erros no formulário antes de salvar.');
      return;
    }

    console.log('Dados do formulário antes de limpeza:', data); // Log para depuração

    const cleanedData = { ...data };
    if (cleanedData.status === 'pago') {
      delete cleanedData.installments;
    } else if (cleanedData.status === 'parcelado') {
      delete cleanedData.paid_at;
    } else {
      // Para pendente, atrasado e cancelado
      delete cleanedData.installments;
      delete cleanedData.paid_at;
    }

    const expenseData = {
      ...cleanedData,
      amount: Number(cleanedData.amount),
      due_date: cleanedData.due_date || null,
      paid_at: cleanedData.paid_at || null,
      payment_method: cleanedData.payment_method || null,
    };
    if (expenseData.status === 'parcelado' && expenseData.installments) {
      expenseData.installments = Number(expenseData.installments);
    }

    console.log('Dados enviados ao back-end:', expenseData); // Log para depuração

    setLoading(true);
    try {
      let response;
      if (id) {
        response = await api.put(`/api/financas/expenses/${id}`, expenseData);
        setSaveMessage('Despesa atualizada com sucesso!');
      } else {
        response = await api.post('/api/financas/expenses', expenseData);
        setSaveMessage('Despesa(s) criada(s) com sucesso!');
      }

      console.log('Resposta do back-end:', response.data); // Log para depuração

      setExpenseState(response.data);
      setValue('status', response.data.status || 'pendente');
      setValue('paid_at', response.data.paid_at ? new Date(response.data.paid_at).toISOString().split('T')[0] : '');
      setValue('description', response.data.description || '');
      setValue('amount', response.data.amount || '');
      setValue('due_date', response.data.due_date ? new Date(response.data.due_date).toISOString().split('T')[0] : '');
      setValue('category_id', response.data.category_id ? String(response.data.category_id) : '');
      setValue('payment_method', response.data.payment_method || '');
      setValue('installments', response.data.installments || '');

      setTimeout(() => {
        setSaveMessage(null);
        navigate('/despesas');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar despesa:', error.response?.data || error.message); // Log detalhado do erro
      toast.error('Erro ao salvar despesa: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const validatePaymentDate = (value) => {
    if (status === 'pago' && !value) {
      return 'Data de pagamento é obrigatória para despesas pagas.';
    }
    if (value) {
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected > today) return 'A data de pagamento não pode ser no futuro.';
      if (due_date && new Date(value) > new Date(due_date)) {
        return 'A data de pagamento não pode ser posterior à data de vencimento.';
      }
    }
    return true;
  };

  const validatePaymentMethod = (value) => {
    if (!value) {
      return 'Método de pagamento é obrigatório para todas as despesas.';
    }
    return true;
  };

  const validateInstallments = (value) => {
    if (status === 'parcelado') {
      const numValue = parseInt(value, 10);
      if (!value || isNaN(numValue) || numValue < 2) {
        return 'Número de parcelas deve ser maior que 1.';
      }
    }
    return true;
  };

  const validateStatus = (value) => {
    if (value === 'atrasado' && !due_date) {
      return 'O status "Atrasado" requer uma data de vencimento.';
    }
    return true;
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
          <Container maxWidth="lg">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Paper
                sx={{
                  p: 4,
                  mb: 4,
                  background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    transform: 'translate(50px, -50px)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney sx={{ mr: 2, fontSize: '3rem' }} />
                      <Box>
                        <Typography variant="h4">{isEditing ? 'Editar Despesa' : 'Nova Despesa'}</Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                          {isEditing ? 'Atualize os detalhes da despesa existente' : 'Registre uma nova despesa financeira'}
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title="Voltar para lista">
                      <IconButton
                        onClick={() => navigate('/despesas')}
                        sx={{ color: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}
                      >
                        <ArrowBack />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </motion.div>

            {/* Mensagem de sucesso */}
            <AnimatePresence>
              {saveMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3 }} onClose={() => setSaveMessage(null)}>
                    <AlertTitle>Sucesso</AlertTitle>
                    {saveMessage}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulário */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Paper sx={{ p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Typography variant="h5" sx={{ mb: 4, color: 'text.primary', fontWeight: 600 }}>
                    Dados da Despesa
                  </Typography>

                  <Grid container spacing={{ xs: 2, md: 4 }}>
                    {/* Linha 1: Descrição */}
                    <Grid item xs={12}>
                      <Tooltip title="Descreva claramente a despesa para fácil identificação">
                        <TextField
                          fullWidth
                          label="Descrição da Despesa"
                          placeholder="Ex: Gasolina, Supermercado, Conta de luz..."
                          {...register('description', {
                            required: 'Descrição é obrigatória',
                            minLength: { value: 3, message: 'Descrição deve ter pelo menos 3 caracteres' },
                          })}
                          error={!!errors.description}
                          helperText={
                            errors.description && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ErrorOutline sx={{ fontSize: '1rem' }} />
                                {errors.description.message}
                              </Box>
                            )
                          }
                          disabled={loading}
                          inputProps={{ 'aria-label': 'Descrição da despesa', 'aria-describedby': 'description-error' }}
                          InputProps={{
                            startAdornment: <Edit sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />,
                          }}
                        />
                      </Tooltip>
                    </Grid>

                    {/* Linha 2: Valor e Categoria */}
                    <Grid item xs={12} md={6}>
                      <Tooltip title="Informe o valor total da despesa">
                        <Controller
                          name="amount"
                          control={control}
                          rules={{ required: 'Valor é obrigatório', min: { value: 0.01, message: 'Valor deve ser positivo' } }}
                          render={({ field }) => (
                            <CurrencyInput
                              {...field}
                              error={!!errors.amount}
                              helperText={
                                errors.amount && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ErrorOutline sx={{ fontSize: '1rem' }} />
                                    {errors.amount.message}
                                  </Box>
                                )
                              }
                              disabled={loading}
                            />
                          )}
                        />
                      </Tooltip>
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                                error={!!errors.category_id}
                                helperText={
                                  errors.category_id && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <ErrorOutline sx={{ fontSize: '1rem' }} />
                                      {errors.category_id.message}
                                    </Box>
                                  )
                                }
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: <Category sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />,
                                }}
                                inputProps={{
                                  ...params.inputProps,
                                  'aria-label': 'Categoria da despesa',
                                  'aria-describedby': 'category-id-error',
                                  placeholder: 'Selecione uma categoria',
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>

                    {/* Linha 3: Status e Vencimento */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Status
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {(isEditing ? statusOptions : statusOptions.filter((opt) => ['pago', 'pendente', 'parcelado'].includes(opt.value))).map((option) => (
                          <Tooltip key={option.value} title={option.description}>
                            <Chip
                              label={option.label}
                              icon={<Info />}
                              color={option.color}
                              onClick={() => {
                                setValue('status', option.value, { shouldValidate: true });
                                if (option.value !== 'pago') {
                                  setValue('paid_at', '', { shouldValidate: true });
                                }
                                if (option.value !== 'parcelado') {
                                  setValue('installments', '', { shouldValidate: true });
                                }
                              }}
                              variant={watch('status') === option.value ? 'filled' : 'outlined'}
                              sx={{ minWidth: 100 }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                      {errors.status && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'error.main' }}>
                          <ErrorOutline sx={{ fontSize: '1rem' }} />
                          <Typography variant="caption">{errors.status.message}</Typography>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Tooltip title="Data de vencimento da despesa">
                        <TextField
                          fullWidth
                          label="Data"
                          type="date"
                          {...register('due_date', { validate: () => validateStatus(status) })}
                          error={!!errors.due_date || !!errors.status}
                          helperText={
                            (errors.due_date || errors.status) ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ErrorOutline sx={{ fontSize: '1rem' }} />
                                {errors.due_date?.message || errors.status?.message}
                              </Box>
                            ) : (
                              'Data de vencimento da despesa'
                            )
                          }
                          disabled={loading}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ 'aria-label': 'Data de vencimento da despesa', 'aria-describedby': 'due-date-error' }}
                          InputProps={{
                            startAdornment: <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />,
                          }}
                        />
                      </Tooltip>
                    </Grid>

                    {/* Condicional para o campo de parcelas */}
                    <AnimatePresence>
                      {status === 'parcelado' && (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          component={motion.div}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Paper sx={{ p: 2, border: '2px solid #0F766E', boxShadow: 3 }}>
                            <Tooltip title="O número de parcelas deve ser maior que 1 para despesas parceladas">
                              <TextField
                                fullWidth
                                label="Número de Parcelas"
                                type="number"
                                {...register('installments', { validate: validateInstallments })}
                                error={!!errors.installments}
                                helperText={
                                  errors.installments ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <ErrorOutline sx={{ fontSize: '1rem' }} />
                                      {errors.installments.message}
                                    </Box>
                                  ) : (
                                    'Informe o número de parcelas (mínimo 2)'
                                  )
                                }
                                disabled={loading}
                                inputProps={{ 'aria-label': 'Número de parcelas', 'aria-describedby': 'installments-error' }}
                                InputProps={{
                                  startAdornment: <FormatListNumbered sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />,
                                }}
                              />
                            </Tooltip>
                          </Paper>
                        </Grid>
                      )}
                    </AnimatePresence>

                    {/* Campos de pagamento */}
                    <Grid item xs={12} md={6}>
                      <Tooltip title="Data em que a despesa foi paga, se aplicável">
                        <TextField
                          fullWidth
                          label="Data de Pagamento"
                          type="date"
                          {...register('paid_at', { validate: validatePaymentDate })}
                          error={!!errors.paid_at}
                          helperText={
                            errors.paid_at ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ErrorOutline sx={{ fontSize: '1rem' }} />
                                {errors.paid_at.message}
                              </Box>
                            ) : (
                              'Preencha se a despesa já foi paga'
                            )
                          }
                          disabled={loading || status !== 'pago'}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ 'aria-label': 'Data de pagamento da despesa', 'aria-describedby': 'paid-at-error' }}
                          InputProps={{
                            startAdornment: <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />,
                          }}
                        />
                      </Tooltip>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="payment_method"
                        control={control}
                        rules={{ validate: validatePaymentMethod }}
                        render={({ field }) => (
                          <Autocomplete
                            options={paymentMethodOptions}
                            getOptionLabel={(option) => option.label}
                            value={paymentMethodOptions.find((opt) => opt.value === field.value) || null}
                            onChange={(_, data) => field.onChange(data ? data.value : '')}
                            disabled={loading}
                            renderOption={(props, option) => (
                              <li {...props}>
                                {option.icon}
                                <Box sx={{ ml: 1 }}>
                                  <Typography>{option.label}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {option.description}
                                  </Typography>
                                </Box>
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Método de Pagamento"
                                error={!!errors.payment_method}
                                helperText={
                                  errors.payment_method ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <ErrorOutline sx={{ fontSize: '1rem' }} />
                                      {errors.payment_method.message}
                                    </Box>
                                  ) : (
                                    'Selecione o método de pagamento (obrigatório)'
                                  )
                                }
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: <Payment sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />,
                                }}
                                inputProps={{
                                  ...params.inputProps,
                                  'aria-label': 'Método de pagamento',
                                  'aria-describedby': 'payment-method-error',
                                  placeholder: 'Selecione um método',
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>

                    {/* Mensagem condicional para status */}
                    <AnimatePresence>
                      <Grid
                        item
                        xs={12}
                        component={motion.div}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert severity="info" sx={{ mt: 2 }}>
                          {status === 'pago'
                            ? 'A data de pagamento e o método de pagamento são obrigatórios para despesas com status "Pago".'
                            : 'O método de pagamento é obrigatório para todas as despesas.'}
                        </Alert>
                      </Grid>
                    </AnimatePresence>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  {/* Botões de Ação */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => navigate('/despesas')}
                      disabled={loading}
                      sx={{ minWidth: 120 }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      disabled={loading || !isValid}
                      sx={{ minWidth: 140, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                    >
                      {loading ? 'Salvando...' : isEditing ? 'Atualizar Despesa' : 'Salvar Despesa'}
                    </Button>
                  </Box>
                </form>
              </Paper>
            </motion.div>
          </Container>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default ExpenseForm;