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
} from '@mui/material';
import { Download, Assessment as AssessmentIcon, TrendingUp, TrendingDown, Category, DateRange } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema aprimorado com design premium
const theme = createTheme({
  palette: {
    primary: { 
      main: '#1976d2', 
      dark: '#115293', 
      light: '#42a5f5' 
    },
    secondary: { 
      main: '#dc004e', 
      dark: '#9a0036', 
      light: '#e91e63' 
    },
    success: { 
      main: '#2e7d32', 
      light: '#4caf50' 
    },
    warning: { 
      main: '#ed6c02', 
      light: '#ff9800' 
    },
    error: { 
      main: '#d32f2f', 
      dark: '#c62828' 
    },
    background: { 
      default: '#f8fafc', 
      paper: '#ffffff' 
    },
    text: { 
      primary: '#1a202c', 
      secondary: '#4a5568' 
    },
    grey: { 
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923'
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { 
      fontWeight: 700, 
      letterSpacing: '-0.025em',
      fontSize: '2rem',
      '@media (max-width:768px)': {
        fontSize: '1.5rem'
      }
    },
    h5: { 
      fontWeight: 600, 
      letterSpacing: '-0.01em', 
      fontSize: '1.5rem',
      '@media (max-width:768px)': {
        fontSize: '1.25rem'
      }
    },
    h6: { 
      fontWeight: 600, 
      fontSize: '1.25rem',
      '@media (max-width:768px)': {
        fontSize: '1.1rem'
      }
    },
    subtitle1: { 
      fontWeight: 400, 
      color: '#4a5568', 
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body1: { 
      fontSize: '0.95rem', 
      fontWeight: 400,
      lineHeight: 1.6
    },
    body2: { 
      fontSize: '0.875rem', 
      fontWeight: 400,
      color: '#4a5568'
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)'
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-2px)'
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#f7fafc',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#edf2f7',
              '& fieldset': { borderColor: '#1976d2' }
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              '& fieldset': { 
                borderColor: '#1976d2', 
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
              }
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { 
            transform: 'translateY(-1px)', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': { 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' 
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
          padding: '16px',
          fontSize: '0.875rem',
        },
        head: {
          backgroundColor: '#f7fafc',
          fontWeight: 600,
          color: '#2d3748',
          borderBottom: '2px solid #cbd5e0',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { 
          borderRadius: 12,
          border: '1px solid',
          fontSize: '0.875rem'
        },
        standardSuccess: {
          backgroundColor: '#f0fff4',
          borderColor: '#9ae6b4',
          color: '#22543d'
        }
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

const StatCard = ({ title, value, icon, color = 'primary', trend = null }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: `${color}.main` }}>
                {value}
              </Typography>
              {trend && (
                <Chip
                  size="small"
                  icon={trend >= 0 ? <TrendingUp /> : <TrendingDown />}
                  label={`${trend >= 0 ? '+' : ''}${trend}%`}
                  color={trend >= 0 ? 'success' : 'error'}
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: `${color}.main`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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
      const params = new URLSearchParams({ start_date: filters.start_date, end_date: filters.end_date }).toString();
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
      const params = new URLSearchParams({ start_date: filters.start_date, end_date: filters.end_date }).toString();
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
            py: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Container maxWidth="xl">
            {/* Header */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ mr: 2, color: 'primary.main', fontSize: '2rem' }} />
                  <Typography variant="h4" color="text.primary">
                    Relatórios Financeiros
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ maxWidth: 600 }}>
                  Visualize e exporte relatórios financeiros detalhados com análises abrangentes do seu desempenho financeiro.
                </Typography>
              </motion.div>
            </Box>

            {/* Mensagem de sucesso */}
            {message && (
              <Fade in={!!message}>
                <Alert 
                  severity="success" 
                  icon={<Download />} 
                  sx={{ mb: 3 }}
                  onClose={() => setMessage(null)}
                >
                  <AlertTitle>Exportação Concluída</AlertTitle>
                  {message}
                </Alert>
              </Fade>
            )}

            {/* Filtros */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <DateRange sx={{ mr: 1 }} />
                Filtros de Pesquisa
              </Typography>
              
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
                    sx={{ py: 1.5 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Atualizar Relatórios'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Cards de Resumo */}
            {summaryData && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard
                    title="Despesas Totais"
                    value={`R$ ${parseFloat(summaryData.totalExpenses || 0).toFixed(2)}`}
                    icon={<TrendingDown />}
                    color="error"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard
                    title="Receitas Totais"
                    value={`R$ ${parseFloat(summaryData.totalRevenues || 0).toFixed(2)}`}
                    icon={<TrendingUp />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <StatCard
                    title="Resultado"
                    value={`R$ ${parseFloat(summaryData.profit || 0).toFixed(2)}`}
                    icon={summaryData.profit >= 0 ? <TrendingUp /> : <TrendingDown />}
                    color={summaryData.profit >= 0 ? 'success' : 'error'}
                  />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={4}>
              {/* Relatório por Categoria */}
              <Grid item xs={12} lg={6}>
                <Paper sx={{ p: 3, height: 'fit-content' }}>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Category sx={{ mr: 1 }} />
                    Despesas por Categoria
                  </Typography>
                  
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Categoria</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                              <CircularProgress size={32} />
                            </TableCell>
                          </TableRow>
                        ) : categoryData.length > 0 ? (
                          categoryData.map((item, index) => (
                            <TableRow 
                              key={index} 
                              sx={{ 
                                '&:hover': { bgcolor: 'grey.50' },
                                '&:last-child td': { border: 0 }
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {item.FinancialCategory?.name || 'Categoria não definida'}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 600, 
                                    color: 'error.main' 
                                  }}
                                >
                                  R$ {parseFloat(item.total || 0).toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                Nenhum dado por categoria disponível
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Relatório Mensal */}
              <Grid item xs={12} lg={6}>
                <Paper sx={{ p: 3, height: 'fit-content' }}>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <DateRange sx={{ mr: 1 }} />
                    Relatório Mensal - {filters.year}
                  </Typography>
                  
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mês</TableCell>
                          <TableCell align="right">Despesas</TableCell>
                          <TableCell align="right">Receitas</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                              <CircularProgress size={32} />
                            </TableCell>
                          </TableRow>
                        ) : monthlyDataCombined.length > 0 ? (
                          monthlyDataCombined.map((item, index) => (
                            <TableRow 
                              key={index} 
                              sx={{ 
                                '&:hover': { bgcolor: 'grey.50' },
                                '&:last-child td': { border: 0 }
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {formatarData(item.month)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 600, 
                                    color: 'error.main' 
                                  }}
                                >
                                  R$ {parseFloat(item.expenses).toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 600, 
                                    color: 'success.main' 
                                  }}
                                >
                                  R$ {parseFloat(item.revenues).toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                Nenhum dado mensal disponível para {filters.year}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Exportar Relatório */}
            <Paper sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Download sx={{ mr: 1 }} />
                Exportar Relatórios
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => handleExport('xlsx')}
                    disabled={loading}
                    color="primary"
                  >
                    Exportar XLSX
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => handleExport('pdf')}
                    disabled={loading}
                    color="primary"
                  >
                    Exportar PDF
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