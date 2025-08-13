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
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  IconButton,
  Skeleton,
  useMediaQuery,
  useTheme,
  Fade,
  Collapse,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  AttachMoney,
  Search,
  FilterList,
  Refresh,
  ExpandMore,
  ExpandLess,
  Visibility,
  Clear,
  TrendingUp,
  CalendarToday,
  Payment,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
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
          padding: '12px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
            boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: 'rgba(5, 150, 105, 0.04)',
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
                borderColor: '#059669',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#059669',
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.1)',
              },
            },
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 'none',
          padding: '16px',
          fontSize: '0.875rem',
          fontWeight: 400,
          '&:first-of-type': {
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
          '&:last-of-type': {
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          },
        },
        head: {
          backgroundColor: '#F0FDF4',
          color: '#374151',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          border: '1px solid #BBF7D0',
        },
        body: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #F3F4F6',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover .MuiTableCell-body': {
            backgroundColor: '#F0FDF4',
            borderColor: '#059669',
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

// Componente de skeleton para loading
const TableSkeleton = () => (
  <TableBody>
    {[...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton variant="text" width="80%" /></TableCell>
        <TableCell><Skeleton variant="text" width="70%" /></TableCell>
        <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
        <TableCell><Skeleton variant="text" width="60%" /></TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
          </Box>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

const RevenuesList = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    payment_method: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      ).toString();
      const res = await api.get(`/api/financas/revenues${params ? `?${params}` : ''}`);
      
      // Ajustar para a estrutura correta do JSON retornado
      const data = Array.isArray(res.data.items)
        ? res.data.items
        : Array.isArray(res.data)
          ? res.data
          : [];
      
      setRevenues(data);
    } catch (error) {
      console.error('Error fetching revenues:', error);
      toast.error('Erro ao carregar receitas: ' + (error.response?.data?.error || error.message));
      setRevenues([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, amount) => {
    if (!window.confirm(`Tem certeza que deseja excluir a receita de R$${amount.toFixed(2)}?`)) return;
    setLoading(true);
    try {
      await api.delete(`/api/financas/revenues/${id}`);
      setMessage('Receita excluída com sucesso!');
      fetchRevenues();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      toast.error('Erro ao excluir receita: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      payment_method: '',
      start_date: '',
      end_date: '',
    });
  };

  const applyFilters = () => {
    fetchRevenues();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Cálculos para resumo
  const totalRevenues = revenues.length;
  const totalAmount = revenues.reduce((sum, rev) => sum + parseFloat(rev.amount || 0), 0);
  const receivedRevenues = revenues.filter(rev => rev.status === 'recebido').length;
  const pendingRevenues = revenues.filter(rev => rev.status !== 'recebido').length;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'recebido':
        return 'success';
      case 'pendente':
        return 'warning';
      default:
        return 'default';
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
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
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
                      <TrendingUp sx={{ mr: 2, fontSize: '3rem' }} />
                      <Box>
                        <Typography variant="h4">
                          Receitas Financeiras
                        </Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                          Gerencie suas receitas e acompanhe o fluxo de entrada
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Atualizar lista">
                        <IconButton
                          onClick={fetchRevenues}
                          disabled={loading}
                          sx={{ 
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                          }}
                        >
                          <Refresh />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </motion.div>

            {/* Resumo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 700 }}>
                        {totalRevenues}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total de Receitas
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Valor Total
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 700 }}>
                        {receivedRevenues}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recebidas
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 700 }}>
                        {pendingRevenues}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pendentes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>

            {/* Mensagem de sucesso */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="success" 
                    icon={<Delete />} 
                    sx={{ mb: 3 }}
                    onClose={() => setMessage(null)}
                  >
                    <AlertTitle>Sucesso</AlertTitle>
                    {message}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Controles
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={() => setShowFilters(!showFilters)}
                      endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
                    >
                      Filtros
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/receitas/novo')}
                      disabled={loading}
                    >
                      Nova Receita
                    </Button>
                  </Box>
                </Box>

                {/* Filtros Colapsáveis */}
                <Collapse in={showFilters}>
                  <Card sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            disabled={loading}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Método de Pagamento"
                            name="payment_method"
                            value={filters.payment_method}
                            onChange={handleFilterChange}
                            disabled={loading}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Payment sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            type="date"
                            label="Data Início"
                            name="start_date"
                            value={filters.start_date}
                            onChange={handleFilterChange}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarToday sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            type="date"
                            label="Data Fim"
                            name="end_date"
                            value={filters.end_date}
                            onChange={handleFilterChange}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarToday sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          startIcon={<Clear />}
                          onClick={clearFilters}
                          disabled={loading || !hasActiveFilters}
                        >
                          Limpar
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Search />}
                          onClick={applyFilters}
                          disabled={loading}
                        >
                          Aplicar Filtros
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Collapse>
              </Paper>
            </motion.div>

            {/* Tabela */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper sx={{ overflow: 'hidden' }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Valor</TableCell>
                        <TableCell>Data de Vencimento</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Método de Pagamento</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    {loading ? (
                      <TableSkeleton />
                    ) : (
                      <TableBody>
                        {revenues.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                              <Box sx={{ textAlign: 'center' }}>
                                <TrendingUp sx={{ fontSize: '4rem', color: 'grey.400', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                  Nenhuma receita encontrada
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                  {hasActiveFilters 
                                    ? 'Tente ajustar os filtros ou limpar a busca'
                                    : 'Comece criando sua primeira receita'
                                  }
                                </Typography>
                                <Button
                                  variant="contained"
                                  startIcon={<Add />}
                                  onClick={() => navigate('/receitas/novo')}
                                >
                                  Nova Receita
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          revenues.map((rev, index) => (
                            <motion.tr
                              key={rev.id}
                              component={TableRow}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              sx={{ 
                                '&:hover': { 
                                  '& .MuiTableCell-body': {
                                    backgroundColor: '#F0FDF4',
                                    borderColor: '#059669',
                                  }
                                }
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AttachMoney sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                                    R$ {parseFloat(rev.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(rev.due_date).toLocaleDateString('pt-BR')}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={rev.status || 'Pendente'} 
                                  size="small" 
                                  color={getStatusColor(rev.status)}
                                  variant="filled"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {rev.payment_method || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Visualizar">
                                    <IconButton
                                      size="small"
                                      onClick={() => navigate(`/receitas/${rev.id}`)}
                                      sx={{ color: 'primary.main' }}
                                    >
                                      <Visibility />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Editar">
                                    <IconButton
                                      size="small"
                                      onClick={() => navigate(`/receitas/editar/${rev.id}`)}
                                      sx={{ color: 'warning.main' }}
                                    >
                                      <Edit />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Excluir">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDelete(rev.id, rev.amount)}
                                      disabled={loading}
                                      sx={{ color: 'error.main' }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </motion.tr>
                          ))
                        )}
                      </TableBody>
                    )}
                  </Table>
                </Box>
              </Paper>
            </motion.div>
          </Container>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default RevenuesList;

