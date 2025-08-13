import React, { useState } from 'react';
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
    Divider,
    Alert,
    AlertTitle,
} from '@mui/material';
import { Download, Assessment as AssessmentIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema completo
const theme = createTheme({
    // ... (código do tema completo)
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
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)', fontSize: '13px', padding: '10px 16px' },
        icon: { color: 'inherit', fontSize: '20px' },
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

const FinancialReports = () => {
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
            
            // Correção: Garante que a resposta é um array
            const data = res.data.data || res.data;
            if (Array.isArray(data)) {
                setCategoryData(data);
            } else {
                setCategoryData([]);
                toast.error('Formato de dados por categoria inesperado.');
            }

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

    const handleExport = async (format) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ start_date: filters.start_date, end_date: filters.end_date, format }).toString();
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
                                <AssessmentIcon sx={{ mr: 1, color: '#26A69A', fontSize: '1.8rem', '&:hover': { color: '#4DB6AC' } }} />
                            </motion.div>
                            <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                                Relatórios Financeiros
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, fontSize: '0.9rem' }}>
                            Visualize e exporte relatórios financeiros detalhados.
                        </Typography>

                        {message && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <Alert severity="success" icon={<Download sx={{ color: '#9CCC65' }} />} sx={{ mb: 2 }}>
                                    <AlertTitle>Sucesso</AlertTitle>
                                    {message}
                                </Alert>
                            </motion.div>
                        )}

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(150px, 1fr))' }, gap: 2, mb: 3 }}>
                            <TextField
                                type="date"
                                label="Data Início"
                                name="start_date"
                                value={filters.start_date}
                                onChange={handleFilterChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                disabled={loading}
                            />
                            <TextField
                                type="date"
                                label="Data Fim"
                                name="end_date"
                                value={filters.end_date}
                                onChange={handleFilterChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                disabled={loading}
                            />
                            <TextField
                                label="Ano (Mensal)"
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                size="small"
                                disabled={loading}
                            />
                            <Button variant="contained" onClick={handleFetchAll} disabled={loading} size="small">
                                Atualizar Relatórios
                            </Button>
                        </Box>

                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />
                            </Box>
                        )}

                        <Divider sx={{ my: 2, bgcolor: 'rgba(207, 216, 220, 0.3)' }} />
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                            Sumário
                        </Typography>
                        {summaryData && (
                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                    Despesas Totais: R${parseFloat(summaryData.totalExpenses || 0).toFixed(2)}
                                </Typography>
                                <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                    Receitas Totais: R${parseFloat(summaryData.totalRevenues || 0).toFixed(2)}
                                </Typography>
                                <Typography sx={{ fontWeight: 500, color: summaryData.profit >= 0 ? '#9CCC65' : '#EF5350' }}>
                                    Lucro: R${parseFloat(summaryData.profit || 0).toFixed(2)}
                                </Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 2, bgcolor: 'rgba(207, 216, 220, 0.3)' }} />
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                            Por Categoria
                        </Typography>
                        <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Categoria</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categoryData.map((item, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { background: '#E0F2F1' } }}>
                                            <TableCell>{item.FinancialCategory?.name || 'N/A'}</TableCell>
                                            <TableCell>R${parseFloat(item.total || 0).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>

                        <Divider sx={{ my: 2, bgcolor: 'rgba(207, 216, 220, 0.3)' }} />
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                            Mensal
                        </Typography>
                        <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mês</TableCell>
                                        <TableCell>Despesas</TableCell>
                                        <TableCell>Receitas</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {monthlyData.expenses.map((exp, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { background: '#E0F2F1' } }}>
                                            <TableCell>{formatarData(exp.month)}</TableCell>
                                            <TableCell>R${parseFloat(exp.total || 0).toFixed(2)}</TableCell>
                                            <TableCell>R${parseFloat(monthlyData.revenues[index]?.total || 0).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>

                        <Divider sx={{ my: 2, bgcolor: 'rgba(207, 216, 220, 0.3)' }} />
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                            Exportar Relatório
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<Download sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
                                onClick={() => handleExport('xlsx')}
                                disabled={loading}
                                size="small"
                            >
                                XLSX
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Download sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
                                onClick={() => handleExport('pdf')}
                                disabled={loading}
                                size="small"
                            >
                                PDF
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Layout>
        </ThemeProvider>
    );
};

export default FinancialReports;