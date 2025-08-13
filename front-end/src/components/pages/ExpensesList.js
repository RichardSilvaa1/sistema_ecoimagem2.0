import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  TextField,
  Alert,
  AlertTitle,
  Autocomplete,
  Chip,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Skeleton,
  Container,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  AttachMoney,
  Receipt,
  CreditCard,
  CalendarToday,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  FilterList,
  Refresh,
  Download,
  Visibility,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema premium aprimorado
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
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
          padding: '10px 20px',
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
        colorSuccess: {
          backgroundColor: '#DCFCE7',
          color: '#166534',
          '& .MuiChip-icon': {
            color: '#166534',
          },
        },
        colorWarning: {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          '& .MuiChip-icon': {
            color: '#92400E',
          },
        },
        colorInfo: {
          backgroundColor: '#DBEAFE',
          color: '#1E40AF',
          '& .MuiChip-icon': {
            color: '#1E40AF',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E2E8F0',
          padding: '16px',
        },
        head: {
          backgroundColor: '#F8FAFC',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#374151',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(15, 118, 110, 0.02)',
          },
        },
      },
    },
  },
});

// Componente de Resumo Financeiro
const FinancialSummary = ({ expenses }) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const paidAmount = expenses
    .filter(expense => expense.status === 'pago')
    .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const pendingAmount = expenses
    .filter(expense => expense.status === 'pendente')
    .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const summaryCards = [
    {
      title: 'Total de Despesas',
      value: formatCurrency(totalAmount),
      icon: AccountBalance,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
    },
    {
      title: 'Despesas Pagas',
      value: formatCurrency(paidAmount),
      icon: TrendingDown,
      color: 'success',
      gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    },
    {
      title: 'Despesas Pendentes',
      value: formatCurrency(pendingAmount),
      icon: TrendingUp,
      color: 'warning',
      gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {summaryCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              sx={{
                background: card.gradient,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)',
                },
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <card.icon sx={{ fontSize: 32, opacity: 0.9 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {expenses.filter(e => 
                    card.title.includes('Pagas') ? e.status === 'pago' :
                    card.title.includes('Pendentes') ? e.status === 'pendente' :
                    true
                  ).length} despesa{expenses.length !== 1 ? 's' : ''}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

const ExpensesList = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category_id: '',
    status: '',
    payment_method: '',
    start_date: '',
    end_date: '',
    expense_start_date: '',
    expense_end_date: '',
  });

  const statusOptions = [
    { label: 'Pago', value: 'pago' },
    { label: 'Pendente', value: 'pendente' },
    { label: 'Parcelado', value: 'parcelado' },
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
    fetchExpenses();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/financas/categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('Erro ao carregar categorias: ' + (error.response?.data?.error || error.message));
      setCategories([]);
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const res = await api.get(`/api/financas/expenses?${params.toString()}`);
      
      // CORREÇÃO PRINCIPAL: Acessar res.data.items ao invés de res.data.data
      const expensesData = res.data?.items || [];
      const total = res.data?.totalItems || 0;
      
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setTotalItems(total);
      
      if (expensesData.length === 0 && Object.values(filters).some(v => v)) {
        toast.info('Nenhuma despesa encontrada para os filtros aplicados.');
      }
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      toast.error('Erro ao carregar despesas: ' + (error.response?.data?.error || error.message));
      setExpenses([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, amount) => {
    if (!window.confirm(`Tem certeza que deseja excluir a despesa de ${formatCurrency(amount)}?`)) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/financas/expenses/${id}`);
      toast.success('Despesa excluída com sucesso!');
      fetchExpenses();
    } catch (error) {
      toast.error('Erro ao excluir despesa: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      category_id: '',
      status: '',
      payment_method: '',
      start_date: '',
      end_date: '',
      expense_start_date: '',
      expense_end_date: '',
    });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'pago': { color: 'success', label: 'Pago' },
      'pendente': { color: 'warning', label: 'Pendente' },
      'parcelado': { color: 'info', label: 'Parcelado' },
    };
    
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip size="small" color={config.color} label={config.label} />;
  };

  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      'credit_card': 'Cartão de Crédito',
      'cartao de credito': 'Cartão de Crédito',
      'dinheiro': 'Dinheiro',
      'pix': 'PIX',
      'boleto': 'Boleto',
      'transferencia': 'Transferência',
    };
    return methodMap[method] || method;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Componente para exibição mobile (cards premium)
  const MobileExpenseCard = ({ expense, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card sx={{ mb: 2, position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: expense.status === 'pago' 
              ? 'linear-gradient(90deg, #059669, #10B981)'
              : expense.status === 'pendente'
              ? 'linear-gradient(90deg, #D97706, #F59E0B)'
              : 'linear-gradient(90deg, #3B82F6, #60A5FA)',
          }}
        />
        <CardContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5 }}>
                {formatCurrency(expense.amount)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: expense.description ? 'normal' : 'italic' }}>
                {expense.description || 'Sem descrição'}
              </Typography>
            </Box>
            {getStatusChip(expense.status)}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Receipt sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    Categoria
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {expense.FinancialCategory?.name || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <CreditCard sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    Pagamento
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {getPaymentMethodLabel(expense.payment_method)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    Vencimento
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(expense.due_date)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => navigate(`/despesas/${expense.id}`)}
              sx={{ flex: 1 }}
            >
              Ver
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate(`/despesas/editar/${expense.id}`)}
              sx={{ flex: 1 }}
            >
              Editar
            </Button>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(expense.id, expense.amount)}
              sx={{ 
                border: '1px solid',
                borderColor: 'error.main',
                '&:hover': { backgroundColor: 'error.main', color: 'white' }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

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
          <Container maxWidth="xl">
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <AttachMoney sx={{ mr: 2, fontSize: '3rem' }} />
                    <Typography variant="h3" sx={{ textAlign: 'center' }}>
                      Gestão Financeira
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ textAlign: 'center', opacity: 0.9, mb: 2 }}>
                    Controle inteligente das suas despesas pessoais
                  </Typography>
                  {totalItems > 0 && (
                    <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 600 }}>
                      {totalItems} despesa{totalItems !== 1 ? 's' : ''} registrada{totalItems !== 1 ? 's' : ''}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </motion.div>

            {/* Resumo Financeiro */}
            {expenses.length > 0 && <FinancialSummary expenses={expenses} />}

            {/* Mensagem de sucesso */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <AlertTitle>Sucesso</AlertTitle>
                    {message}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controles e Filtros */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Controles
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Atualizar lista">
                    <IconButton onClick={fetchExpenses} disabled={loading}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}>
                    <IconButton onClick={() => setShowFilters(!showFilters)}>
                      <FilterList />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: showFilters ? 3 : 0, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => navigate('/despesas/novo')}
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  Nova Despesa
                </Button>
                {Object.values(filters).some(v => v) && (
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    disabled={loading}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </Box>

              <Fade in={showFilters}>
                <Box sx={{ display: showFilters ? 'block' : 'none' }}>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                    FILTROS AVANÇADOS
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.name || ''}
                        value={categories.find((cat) => String(cat.id) === filters.category_id) || null}
                        onChange={(_, value) => handleFilterChange('category_id', value ? String(value.id) : '')}
                        disabled={loading}
                        renderInput={(params) => (
                          <TextField {...params} label="Categoria" size="small" fullWidth />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Autocomplete
                        options={statusOptions}
                        getOptionLabel={(option) => option.label}
                        value={statusOptions.find((opt) => opt.value === filters.status) || null}
                        onChange={(_, value) => handleFilterChange('status', value ? value.value : '')}
                        disabled={loading}
                        renderInput={(params) => (
                          <TextField {...params} label="Status" size="small" fullWidth />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Autocomplete
                        options={paymentMethodOptions}
                        getOptionLabel={(option) => option.label}
                        value={paymentMethodOptions.find((opt) => opt.value === filters.payment_method) || null}
                        onChange={(_, value) => handleFilterChange('payment_method', value ? value.value : '')}
                        disabled={loading}
                        renderInput={(params) => (
                          <TextField {...params} label="Método de Pagamento" size="small" fullWidth />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        type="date"
                        label="Data Vencimento (Início)"
                        value={filters.start_date}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        fullWidth
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        type="date"
                        label="Data Vencimento (Fim)"
                        value={filters.end_date}
                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        fullWidth
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        type="date"
                        label="Data Despesa (Início)"
                        value={filters.expense_start_date}
                        onChange={(e) => handleFilterChange('expense_start_date', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        fullWidth
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        type="date"
                        label="Data Despesa (Fim)"
                        value={filters.expense_end_date}
                        onChange={(e) => handleFilterChange('expense_end_date', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        fullWidth
                        disabled={loading}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Paper>

            {/* Lista de Despesas */}
            <Paper sx={{ overflow: 'hidden', minHeight: 400 }}>
              {loading ? (
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <CircularProgress size={40} />
                  </Box>
                  {/* Skeleton loading */}
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                    </Box>
                  ))}
                </Box>
              ) : expenses.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 6 }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AttachMoney sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>
                      Nenhuma despesa encontrada
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                      {Object.values(filters).some(v => v) 
                        ? 'Tente ajustar os filtros para encontrar suas despesas'
                        : 'Comece adicionando sua primeira despesa'
                      }
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      onClick={() => navigate('/despesas/novo')}
                      sx={{ px: 4 }}
                    >
                      Adicionar Primeira Despesa
                    </Button>
                  </motion.div>
                </Box>
              ) : isMobile ? (
                // Exibição mobile (cards premium)
                <Box sx={{ p: 2 }}>
                  {expenses.map((expense, index) => (
                    <MobileExpenseCard key={expense.id} expense={expense} index={index} />
                  ))}
                </Box>
              ) : (
                // Exibição desktop (tabela premium)
                <Box sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Valor</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Data Vencimento</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Método Pagamento</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expenses.map((expense, index) => (
                        <motion.tr
                          key={expense.id}
                          component={TableRow}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'rgba(15, 118, 110, 0.04)',
                              transform: 'scale(1.01)',
                              transition: 'all 0.2s ease-in-out'
                            } 
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {formatCurrency(expense.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontStyle: expense.description ? 'normal' : 'italic',
                                color: expense.description ? 'text.primary' : 'text.secondary'
                              }}
                            >
                              {expense.description || 'Sem descrição'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(expense.due_date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {expense.FinancialCategory?.name || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(expense.status)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {getPaymentMethodLabel(expense.payment_method)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <Tooltip title="Visualizar">
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/despesas/${expense.id}`)}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/despesas/editar/${expense.id}`)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(expense.id, expense.amount)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default ExpensesList;

