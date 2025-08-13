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
} from '@mui/material';
import { Add, Edit, Delete, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Layout from '../layout/Layout';

// MUI theme configuration (unchanged)
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

const RevenuesList = () => {
  const navigate = useNavigate();
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    payment_method: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchRevenues();
  }, [filters]);

  const fetchRevenues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/api/financas/revenues?${params}`);
      
      // Log the response to debug its structure
      console.log('API Response:', res.data);
      
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
                <AttachMoney sx={{ mr: 1, color: '#9CCC65', fontSize: '1.8rem', '&:hover': { color: '#AED581' } }} />
              </motion.div>
              <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                Lista de Receitas
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, fontSize: '0.9rem' }}>
              Gerencie suas receitas financeiras.
            </Typography>

            {message && (
              <motion.div initial={{ opacity: 0.0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Alert severity="success" icon={<Delete sx={{ color: '#9CCC65' }} />} sx={{ mb: 2 }}>
                  <AlertTitle>Sucesso</AlertTitle>
                  {message}
                </Alert>
              </motion.div>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(150px, 1fr))' }, gap: 2, mb: 3 }}>
              <TextField label="Status" name="status" value={filters.status} onChange={handleFilterChange} size="small" disabled={loading} />
              <TextField label="Método Pagamento" name="payment_method" value={filters.payment_method} onChange={handleFilterChange} size="small" disabled={loading} />
              <TextField type="date" label="Data Início" name="start_date" value={filters.start_date} onChange={handleFilterChange} InputLabelProps={{ shrink: true }} size="small" disabled={loading} />
              <TextField type="date" label="Data Fim" name="end_date" value={filters.end_date} onChange={handleFilterChange} InputLabelProps={{ shrink: true }} size="small" disabled={loading} />
            </Box>

            <Button
              variant="contained"
              startIcon={<Add sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
              onClick={() => navigate('/receitas/novo')}
              disabled={loading}
              sx={{ mb: 3 }}
            >
              Nova Receita
            </Button>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />
              </Box>
            ) : revenues.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                  Nenhuma receita encontrada.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Valor</TableCell>
                      <TableCell>Data Vencimento</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Método Pagamento</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {revenues.map((rev) => (
                      <TableRow key={rev.id} sx={{ '&:hover': { background: '#E0F2F1' } }}>
                        <TableCell>R${parseFloat(rev.amount).toFixed(2)}</TableCell>
                        <TableCell>{new Date(rev.due_date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.4,
                              borderRadius: 8,
                              bgcolor: rev.status === 'recebido' ? theme.palette.success.main : theme.palette.warning.main,
                              color: '#FFFFFF',
                              fontWeight: 500,
                              fontSize: '12px',
                              display: 'inline-flex',
                            }}
                          >
                            {rev.status || 'Pendente'}
                          </Box>
                        </TableCell>
                        <TableCell>{rev.payment_method || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            startIcon={<Edit sx={{ color: '#FF7043', fontSize: '1.1rem' }} />}
                            onClick={() => navigate(`/receitas/editar/${rev.id}`)}
                            disabled={loading}
                            size="small"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Delete sx={{ color: '#EF5350', fontSize: '1.1rem' }} />}
                            onClick={() => handleDelete(rev.id, rev.amount)}
                            disabled={loading}
                            sx={{ ml: 1, color: '#EF5350', borderColor: '#EF5350', '&:hover': { color: '#E53935', borderColor: '#E53935' } }}
                            size="small"
                          >
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default RevenuesList;