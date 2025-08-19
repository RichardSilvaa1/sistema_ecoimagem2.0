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
  Container,
  Grid,
  Card,
  CardContent,
  Fade,
  useMediaQuery,
  useTheme,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  AttachMoney,
  Receipt,
  CalendarToday,
  Category,
  Payment,
  CheckCircle,
  Info,
  Edit,
  Add,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericFormat } from 'react-number-format';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema premium idêntico às outras páginas
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F766E',
      light: '#14B8A6',
      dark: '#134E4A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#991B1B',
    },
    success: {
      main: '#059669',
      light: '#10B981',
      dark: '#047857',
    },
    warning: {
      main: '#D97706',
      light: '#F59E0B',
      dark: '#92400E',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#991B1B',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: {
      fontWeight: 800,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 400,
      color: '#64748B',
    },
  },
  shape: {
    borderRadius: 12,
  },
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
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: '#F1F5F9',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#CBD5E1',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: '#94A3B8',
            },
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
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-2px)',
          },
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-4px)',
            borderColor: '#0F766E',
          },
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
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
          boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)',
            boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
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
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0F766E',
              },
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
        root: {
          borderRadius: 12,
          border: '1px solid',
          fontSize: '0.875rem',
        },
        standardSuccess: {
          backgroundColor: '#F0FDF4',
          borderColor: '#BBF7D0',
          color: '#166534',
        },
        standardError: {
          backgroundColor: '#FEF2F2',
          borderColor: '#FECACA',
          color: '#991B1B',
        },
        standardWarning: {
          backgroundColor: '#FFFBEB',
          borderColor: '#FED7AA',
          color: '#92400E',
        },
        standardInfo: {
          backgroundColor: '#EFF6FF',
          borderColor: '#BFDBFE',
          color: '#1E40AF',
        },
      },
    },
  },
});

// Componente para campo moeda premium
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
    inputProps={{ 'aria-label': 'Valor da despesa' }}
    InputProps={{
      startAdornment: (
        <AttachMoney sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
      ),
    }}
  />
));

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      description: '',
      amount: '',
      expense_date: '',
      due_date: '',
      paid_at: '',
      category_id: '',
      status: 'pendente',
      payment_method: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [categories, setCategories] = useState([]);

  // Opções para status e payment_method
  const statusOptions = [
    { label: 'Pago', value: 'pago', color: 'success' },
    { label: 'Pendente', value: 'pendente', color: 'warning' },
    { label: 'Atrasado', value: 'atrasado', color: 'error' },
    { label: 'Cancelado', value: 'cancelado', color: 'secondary' },
    { label: 'Parcelado', value: 'parcelado', color: 'info' },
  ];

  const paymentMethodOptions = [
    { label: 'Dinheiro', value: 'dinheiro' },
    { label: 'Cartão de Crédito', value: 'credit_card' },
    { label: 'Cartão de Débito', value: 'cartao de debito' },
    { label: 'Transferência', value: 'transferencia' },
    { label: 'PIX', value: 'pix' },
    { label: 'Boleto', value: 'boleto' },
  ];

  useEffect(() => {
    fetchCategories();
    if (id) fetchExpense();
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
      setValue('description', res.data.description || '');
      setValue('amount', res.data.amount);
      setValue('expense_date', res.data.expense_date ? new Date(res.data.expense_date).toISOString().split('T')[0] : '');
      setValue('paid_at', res.data.paid_at ? new Date(res.data.paid_at).toISOString().split('T')[0] : '');
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

  // Validação para garantir que a data de pagamento não seja no futuro
  const validatePaidAt = (value) => {
    if (!value) return true;
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected > today) return 'A data de pagamento não pode ser no futuro';
    return true;
  };

  // Validação para garantir que a data de vencimento não seja no passado se o status for pendente
  const validateDueDate = (value) => {
    const status = watch('status');
    // A validação agora é opcional, só verifica se a data está no passado se ela for fornecida
    if (value) { 
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today && status === 'pendente') {
        return 'Atenção: A data de vencimento está no passado. Considere mudar o status.';
      }
    }
    return true;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const expenseData = {
        ...data,
        amount: Number(data.amount),
        expense_date: data.expense_date || null,
        paid_at: data.paid_at || null,
        due_date: data.due_date || null, // Permite que o campo seja nulo
      };

      if (id) {
        await api.put(`/api/financas/expenses/${id}`, expenseData);
        setSaveMessage('Despesa atualizada com sucesso!');
      } else {
        await api.post('/api/financas/expenses', expenseData);
        setSaveMessage('Despesa criada com sucesso!');
      }
      setTimeout(() => {
        setSaveMessage(null);
        navigate('/despesas');
      }, 2000);
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
            bgcolor: 'background.default',
            minHeight: '100vh',
            py: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="lg">
            {/* Header Premium */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
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
                        <Typography variant="h4">
                          {id ? 'Editar Despesa' : 'Nova Despesa'}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                          {id ? 'Atualize os detalhes da despesa existente' : 'Registre uma nova despesa financeira'}
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title="Voltar para lista">
                      <IconButton
                        onClick={() => navigate('/despesas')}
                        sx={{ 
                          color: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                        }}
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle />} 
                    sx={{ mb: 3 }}
                    onClose={() => setSaveMessage(null)}
                  >
                    <AlertTitle>Sucesso</AlertTitle>
                    {saveMessage}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulário Completo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Typography variant="h5" sx={{ mb: 4, color: 'text.primary', fontWeight: 600 }}>
                    Dados da Despesa
                  </Typography>

                  <Grid container spacing={4}>
                    {/* Linha 1: Descrição */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descrição da Despesa"
                        placeholder="Ex: Gasolina, Supermercado, Conta de luz..."
                        {...register('description', { 
                          required: 'Descrição é obrigatória',
                          minLength: { value: 3, message: 'Descrição deve ter pelo menos 3 caracteres' }
                        })}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <Edit sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                          ),
                        }}
                      />
                    </Grid>

                    {/* Linha 2: Valor e Categoria */}
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="amount"
                        control={control}
                        rules={{ 
                          required: 'Valor é obrigatório', 
                          min: { value: 0.01, message: 'Valor deve ser positivo' } 
                        }}
                        render={({ field }) => (
                          <CurrencyInput
                            {...field}
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                            disabled={loading}
                          />
                        )}
                      />
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
                                helperText={errors.category_id?.message}
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <Category sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                                  ),
                                }}
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
                    </Grid>

                    {/* Linha 3: Data da Despesa e Data de Vencimento */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Data da Despesa"
                        type="date"
                        {...register('expense_date', { required: 'Data da despesa é obrigatória' })}
                        error={!!errors.expense_date}
                        helperText={errors.expense_date?.message}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ 'aria-label': 'Data em que a despesa foi feita' }}
                        InputProps={{
                          startAdornment: (
                            <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Data de Vencimento"
                        type="date"
                        {...register('due_date', { validate: validateDueDate })}
                        error={!!errors.due_date}
                        helperText={errors.due_date?.message}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ 'aria-label': 'Data de vencimento da despesa' }}
                        InputProps={{
                          startAdornment: (
                            <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                          ),
                        }}
                      />
                    </Grid>
                    
                    {/* Linha 4: Data de Pagamento, Método de Pagamento e Status */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Data de Pagamento"
                        type="date"
                        {...register('paid_at', { validate: validatePaidAt })}
                        error={!!errors.paid_at}
                        helperText={errors.paid_at?.message}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ 'aria-label': 'Data de pagamento da despesa' }}
                        InputProps={{
                          startAdornment: (
                            <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                                error={!!errors.payment_method}
                                helperText={errors.payment_method?.message}
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <Payment sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                                  ),
                                }}
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
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                                error={!!errors.status}
                                helperText={errors.status?.message}
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <Info sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                                  ),
                                }}
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
                    </Grid>
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
                      sx={{ 
                        minWidth: 140,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      {loading ? 'Salvando...' : id ? 'Atualizar Despesa' : 'Salvar Despesa'}
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