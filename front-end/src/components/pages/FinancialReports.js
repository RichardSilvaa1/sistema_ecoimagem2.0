import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  AlertTitle,
  Grid,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  useMediaQuery,
  useTheme,
  TableContainer,
  Divider,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  Download,
  Assessment as AssessmentIcon,
  TrendingUp,
  TrendingDown,
  Category,
  DateRange,
  Refresh,
  FileDownload,
  PictureAsPdf,
  TableChart,
  BarChart,
  AccountBalance,
  MonetizationOn,
  Receipt,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema premium idêntico ao da página de despesas
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
        colorError: {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          '& .MuiChip-icon': {
            color: '#991B1B',
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

const formatarData = (dataString) => {
  if (!dataString) return 'Sem data';
  const data = new Date(dataString);
  return isNaN(data.getTime())
    ? 'Data inválida'
    : data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};

// Componente de Card de Estatística Premium
const StatCard = ({ title, value, icon, color = 'primary', trend = null, isLoading = false }) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
    success: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    error: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
    warning: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: gradients[color],
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
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
        <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            {React.cloneElement(icon, { sx: { fontSize: 32, opacity: 0.9 } })}
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {title}
            </Typography>
          </Box>
          
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
          )}
          
          {trend !== null && !isLoading && (
            <Chip
              size="small"
              icon={trend >= 0 ? <TrendingUp /> : <TrendingDown />}
              label={`${trend >= 0 ? '+' : ''}${trend}%`}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente de Loading para Tabelas
const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Table>
    <TableHead>
      <TableRow>
        {[...Array(columns)].map((_, index) => (
          <TableCell key={index}>
            <Skeleton variant="text" width="80%" />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {[...Array(rows)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(columns)].map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton variant="text" width="60%" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const FinancialReports = () => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState({ expenses: [], revenues: [] });
  const [message, setMessage] = useState(null);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    year: new Date().getFullYear().toString(),
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        start_date: filters.start_date, 
        end_date: filters.end_date 
      }).toString();
      const res = await api.get(`/api/financas/reports/summary?${params}`);
      setSummaryData(res.data);
    } catch (error) {
      toast.error('Erro ao carregar sumário: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        start_date: filters.start_date, 
        end_date: filters.end_date 
      }).toString();
      const res = await api.get(`/api/financas/reports/by-category?${params}`);
      setCategoryData(res.data);
    } catch (error) {
      toast.error('Erro ao carregar relatório por categoria: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthly = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/financas/reports/monthly?year=${filters.year}`);
      setMonthlyData(res.data);
    } catch (error) {
      toast.error('Erro ao carregar relatório mensal: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAll = () => {
    fetchSummary();
    fetchByCategory();
    fetchMonthly();
  };

  useEffect(() => {
    handleFetchAll();
  }, []);

  const handleExport = async (format) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        start_date: filters.start_date,
        end_date: filters.end_date,
        format,
      }).toString();
      const res = await api.get(`/api/financas/reports/export?${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_financeiro.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage(`Relatório exportado como ${format.toUpperCase()} com sucesso!`);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      toast.error('Erro ao exportar relatório: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const monthlyDataCombined = React.useMemo(() => {
    const months = new Set([
      ...monthlyData.expenses.map(item => item.month),
      ...monthlyData.revenues.map(item => item.month)
    ]);
    
    return Array.from(months)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(month => {
        const expense = monthlyData.expenses.find(item => item.month === month);
        const revenue = monthlyData.revenues.find(item => item.month === month);
        return {
          month,
          expenses: expense?.total || 0,
          revenues: revenue?.total || 0
        };
      });
  }, [monthlyData]);

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
                    <AssessmentIcon sx={{ mr: 2, fontSize: '3rem' }} />
                    <Typography variant="h3" sx={{ textAlign: 'center' }}>
                      Relatórios Financeiros
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ textAlign: 'center', opacity: 0.9, mb: 2 }}>
                    Análises detalhadas e insights inteligentes do seu desempenho financeiro
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 600 }}>
                    Visualize tendências, exporte dados e tome decisões informadas
                  </Typography>
                </Box>
              </Paper>
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
                    icon={<FileDownload />} 
                    sx={{ mb: 3 }}
                    onClose={() => setMessage(null)}
                  >
                    <AlertTitle>Exportação Concluída</AlertTitle>
                    {message}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filtros Premium */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', fontWeight: 600 }}>
                  <DateRange sx={{ mr: 1 }} />
                  Filtros e Controles
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Atualizar relatórios">
                    <IconButton onClick={handleFetchAll} disabled={loading}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Exportar PDF">
                    <IconButton onClick={() => handleExport('pdf')} disabled={loading}>
                      <PictureAsPdf />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Exportar Excel">
                    <IconButton onClick={() => handleExport('xlsx')} disabled={loading}>
                      <TableChart />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Grid container spacing={3} alignItems="end">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Data Início"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Data Fim"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Ano (Relatório Mensal)"
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleFetchAll}
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                  >
                    {loading ? 'Carregando...' : 'Atualizar'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Cards de Resumo Premium */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Despesas Totais"
                  value={formatCurrency(summaryData?.totalExpenses)}
                  icon={<Receipt />}
                  color="error"
                  isLoading={loading && !summaryData}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Receitas Totais"
                  value={formatCurrency(summaryData?.totalRevenues)}
                  icon={<MonetizationOn />}
                  color="success"
                  isLoading={loading && !summaryData}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <StatCard
                  title="Resultado Líquido"
                  value={formatCurrency(summaryData?.profit)}
                  icon={summaryData?.profit >= 0 ? <TrendingUp /> : <TrendingDown />}
                  color={summaryData?.profit >= 0 ? 'success' : 'error'}
                  isLoading={loading && !summaryData}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              {/* Relatório por Categoria */}
              <Grid item xs={12} lg={6}>
                <Paper sx={{ p: 3, height: 'fit-content' }}>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <Category sx={{ mr: 1 }} />
                    Despesas por Categoria
                  </Typography>
                  
                  <TableContainer sx={{ maxHeight: 400 }}>
                    {loading ? (
                      <TableSkeleton rows={5} columns={3} />
                    ) : (
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Categoria</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Participação</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {categoryData.length > 0 ? (
                            categoryData.map((item, index) => {
                              const total = categoryData.reduce((sum, cat) => sum + parseFloat(cat.total || 0), 0);
                              const percentage = total > 0 ? ((parseFloat(item.total || 0) / total) * 100).toFixed(1) : 0;
                              
                              return (
                                <motion.tr
                                  key={item.category || index}
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
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {item.category || 'Sem categoria'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                                      {formatCurrency(item.total)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      size="small"
                                      label={`${percentage}%`}
                                      color="primary"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                </motion.tr>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                  Nenhum dado encontrado para o período selecionado
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Relatório Mensal */}
              <Grid item xs={12} lg={6}>
                <Paper sx={{ p: 3, height: 'fit-content' }}>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <BarChart sx={{ mr: 1 }} />
                    Relatório Mensal - {filters.year}
                  </Typography>
                  
                  <TableContainer sx={{ maxHeight: 400 }}>
                    {loading ? (
                      <TableSkeleton rows={6} columns={4} />
                    ) : (
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Mês</TableCell>
                            <TableCell align="right">Despesas</TableCell>
                            <TableCell align="right">Receitas</TableCell>
                            <TableCell align="right">Resultado</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {monthlyDataCombined.length > 0 ? (
                            monthlyDataCombined.map((item, index) => {
                              const resultado = parseFloat(item.revenues || 0) - parseFloat(item.expenses || 0);
                              
                              return (
                                <motion.tr
                                  key={item.month}
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
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {formatarData(item.month)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                                      {formatCurrency(item.expenses)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                      {formatCurrency(item.revenues)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Chip
                                      size="small"
                                      label={formatCurrency(resultado)}
                                      color={resultado >= 0 ? 'success' : 'error'}
                                      icon={resultado >= 0 ? <TrendingUp /> : <TrendingDown />}
                                    />
                                  </TableCell>
                                </motion.tr>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                  Nenhum dado encontrado para o ano {filters.year}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Botões de Exportação */}
            <Paper sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Exportar Relatórios
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PictureAsPdf />}
                    onClick={() => handleExport('pdf')}
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    Exportar PDF
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TableChart />}
                    onClick={() => handleExport('xlsx')}
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    Exportar Excel
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => handleExport('csv')}
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    Exportar CSV
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<FileDownload />}
                    onClick={() => handleExport('json')}
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    Exportar JSON
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default FinancialReports;

