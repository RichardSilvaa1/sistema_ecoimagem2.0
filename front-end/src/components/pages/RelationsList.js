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
import { Add, Edit, Delete, Link as LinkIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Layout from '../layout/Layout';

// Tema completo (copiado do ExameForm)
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

const formatarData = (dataString) => {
  if (!dataString) return 'Sem data';
  const data = new Date(dataString);
  return isNaN(data.getTime())
    ? 'Data inválida'
    : data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const RelationsList = () => {
  const navigate = useNavigate();
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [filters, setFilters] = useState({
    expense_id: '',
    related_type: '',
    related_id: '',
  });

  useEffect(() => {
    fetchRelations();
  }, [filters]);

  const fetchRelations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/api/financas/relations?${params}`);
      setRelations(res.data.data || res.data);
    } catch (error) {
      toast.error('Erro ao carregar relações: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta relação?')) return;
    setLoading(true);
    try {
      await api.delete(`/api/financas/relations/${id}`);
      setMessage('Relação excluída com sucesso!');
      fetchRelations();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      toast.error('Erro ao excluir relação: ' + (error.response?.data?.error || error.message));
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
                <LinkIcon sx={{ mr: 1, color: '#26A69A', fontSize: '1.8rem', '&:hover': { color: '#4DB6AC' } }} />
              </motion.div>
              <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                Lista de Relações
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, fontSize: '0.9rem' }}>
              Gerencie as relações entre despesas e outros registros.
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
              <TextField label="Despesa ID" name="expense_id" value={filters.expense_id} onChange={handleFilterChange} size="small" disabled={loading} />
              <TextField label="Tipo Relacionado" name="related_type" value={filters.related_type} onChange={handleFilterChange} size="small" disabled={loading} />
              <TextField label="ID Relacionado" name="related_id" value={filters.related_id} onChange={handleFilterChange} size="small" disabled={loading} />
            </Box>

            <Button
              variant="contained"
              startIcon={<Add sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />}
              onClick={() => navigate('/relacoes/novo')}
              disabled={loading}
              sx={{ mb: 3 }}
            >
              Nova Relação
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
                      <TableCell>Despesa ID</TableCell>
                      <TableCell>Tipo Relacionado</TableCell>
                      <TableCell>ID Relacionado</TableCell>
                      <TableCell>Data Criação</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {relations.map((rel) => (
                      <TableRow key={rel.id} sx={{ '&:hover': { background: '#E0F2F1' } }}>
                        <TableCell>{rel.expense_id}</TableCell>
                        <TableCell>{rel.related_type}</TableCell>
                        <TableCell>{rel.related_id}</TableCell>
                        <TableCell>{formatarData(rel.created_at)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            startIcon={<Edit sx={{ color: '#FF7043', fontSize: '1.1rem' }} />}
                            onClick={() => navigate('/relacoes/editar/${rel.id}')}
                            disabled={loading}
                            size="small"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Delete sx={{ color: '#EF5350', fontSize: '1.1rem' }} />}
                            onClick={() => handleDelete(rel.id)}
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

export default RelationsList;