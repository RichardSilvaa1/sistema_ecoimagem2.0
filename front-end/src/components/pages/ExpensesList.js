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
} from '@mui/material';
import { Add, Edit, Delete, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema completo (mantido inalterado)
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

const ExpensesList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: '',
    status: '',
    payment_method: '',
    start_date: '',
    end_date: '',
    expense_start_date: '', // Novo filtro para expense_date
    expense_end_date: '', // Novo filtro para expense_date
  });

  // Opções para os campos status e payment_method baseadas no ENUM do backend
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
    fetchExpenses();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/financas/categories'); // Rota ajustada
      setCategories(res.data || []);
    } catch (error) {
      toast.error('Erro ao carregar categorias: ' + (error.response?.data?.error || error.message));
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await api.get(`/api/financas/expenses?${params.toString()}`); // Rota ajustada
      setExpenses(res.data.data || res.data);
    } catch (error) {
      toast.error('Erro ao carregar despesas: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, amount) => {
    if (!window.confirm(`Tem certeza que deseja excluir a despesa de R$${parseFloat(amount).toFixed(2)}?`)) return;
    setLoading(true);
    try {
      await api.delete(`/api/financas/expenses/${id}`); // Rota ajustada
      setMessage('Despesa excluída com sucesso!');
      fetchExpenses();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      toast.error('Erro ao excluir despesa: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
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
                <AttachMoney sx={{ mr: 1, color: '#FFA726', fontSize: '1.8rem', '&:hover': { color: '#FFB300' } }} />
              </motion.div>
              <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                Lista de Despesas
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, fontSize: '0.9rem' }}>
              Gerencie suas despesas financeiras.
            </Typography>

            {message && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Alert severity="success" icon={<Delete sx={{ color: '#9CCC65' }} />} sx={{ mb: 2 }}>
                  <AlertTitle>Sucesso</AlertTitle>
                  {message}
                </Alert>
              </motion.div>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(150px, 1fr))' }, gap: 2, mb: 3 }}>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name || ''}
                value={categories.find((cat) => String(cat.id) === filters.category_id) || null}
                onChange={(_, value) => handleFilterChange('category_id', value ? String(value.id) : '')}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categoria"
                    size="small"
                    inputProps={{ ...params.inputProps, 'aria-label': 'Filtro por categoria' }}
                  />
                )}
              />
              <Autocomplete
                options={statusOptions}
                getOptionLabel={(option) => option.label}
                value={statusOptions.find((opt) => opt.value === filters.status) || null}
                onChange={(_, value) => handleFilterChange('status', value ? value.value : '')}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    size="small"
                    inputProps={{ ...params.inputProps, 'aria-label': 'Filtro por status' }}
                  />
                )}
              />
              <Autocomplete
                options={paymentMethodOptions}
                getOptionLabel={(option) => option.label}
                value={paymentMethodOptions.find((opt) => opt.value === filters.payment_method) || null}
                onChange={(_, value) => handleFilterChange('payment_method', value ? value.value : '')}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Método de Pagamento"
                    size="small"
                    inputProps={{ ...params.inputProps, 'aria-label': 'Filtro por método de pagamento' }}
                  />
                )}
              />
              <TextField
                type="date"
                label="Data de Vencimento Início"
                name="start_date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                disabled={loading}
                inputProps={{ 'aria-label': 'Filtro por data de vencimento inicial' }}
              />
              <TextField
                type="date"
                label="Data de Vencimento Fim"
                name="end_date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                disabled={loading}
                inputProps={{ 'aria-label': 'Filtro por data de vencimento final' }}
              />
              <TextField
                type="date"
                label="Data da Despesa Início"
                name="expense_start_date"
                value={filters.expense_start_date}
                onChange={(e) => handleFilterChange('expense_start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                disabled={loading}
                inputProps={{ 'aria-label': 'Filtro por data da despesa inicial' }}
              />
              <TextField
                type="date"
                label="Data da Despesa Fim"
                name="expense_end_date"
                value={filters.expense_end_date}
                onChange={(e) => handleFilterChange('expense_end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                disabled={loading}
                inputProps={{ 'aria-label': 'Filtro por data da despesa final' }}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<Add sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
              onClick={() => navigate('/despesas/novo')} // Navegação mantida
              disabled={loading}
              sx={{ mb: 3 }}
            >
              Nova Despesa
            </Button>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Valor</TableCell>
                      <TableCell>Data da Despesa</TableCell> {/* Nova coluna */}
                      <TableCell>Data de Vencimento</TableCell>
                      <TableCell>Categoria</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Método de Pagamento</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((exp) => (
                      <TableRow key={exp.id} sx={{ '&:hover': { background: '#E0F2F1' } }}>
                        <TableCell>R${parseFloat(exp.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          {exp.expense_date ? new Date(exp.expense_date).toLocaleDateString('pt-BR') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {exp.due_date ? new Date(exp.due_date).toLocaleDateString('pt-BR') : 'N/A'}
                        </TableCell>
                        <TableCell>{exp.FinancialCategory?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.4,
                              borderRadius: 8,
                              bgcolor:
                                exp.status === 'pago'
                                  ? theme.palette.success.main
                                  : exp.status === 'pendente'
                                  ? theme.palette.warning.main
                                  : theme.palette.secondary.main,
                              color: '#FFFFFF',
                              fontWeight: 500,
                              fontSize: '12px',
                              display: 'inline-flex',
                            }}
                          >
                            {exp.status ? statusOptions.find((opt) => opt.value === exp.status)?.label || exp.status : 'Pendente'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {exp.payment_method
                            ? paymentMethodOptions.find((opt) => opt.value === exp.payment_method)?.label || exp.payment_method
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            startIcon={<Edit sx={{ color: '#FF7043', fontSize: '1.1rem' }} />}
                            onClick={() => navigate(`/despesas/editar/${exp.id}`)} // Navegação mantida
                            disabled={loading}
                            size="small"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Delete sx={{ color: '#EF5350', fontSize: '1.1rem' }} />}
                            onClick={() => handleDelete(exp.id, exp.amount)}
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

export default ExpensesList;