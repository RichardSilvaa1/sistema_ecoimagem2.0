// Importação de dependências do React e bibliotecas necessária
import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import api from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { FiDownload, FiEdit } from 'react-icons/fi';
import {
  FaPlus,
  FaTimes,
  FaPaw,
  FaUser,
  FaCalendarAlt,
  FaHospital,
  FaStethoscope,
  FaFileAlt,
  FaDollarSign,
  FaCheckCircle,
  FaCog,
  FaExclamationTriangle,
  FaMoneyCheckAlt,
  FaFilter,
  FaRedo,
  FaTrash,
} from 'react-icons/fa';
import ExameForm from './ExameForm';
import {
  Box,
  TextField,
  Select as MuiSelect,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Controller } from 'react-hook-form';

// Tema do Material-UI com ajustes apenas para telas menores
const theme = createTheme({
  palette: {
    primary: { main: '#26A69A' },
    error: { main: '#EF5350' },
    text: { primary: '#263238', secondary: '#607D8B' },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 14,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': { borderColor: '#26A69A' },
            '&.Mui-focused fieldset': { borderColor: '#26A69A' },
            '&:focus-visible': {
              outline: '2px solid #26A69A', // Foco visível para acessibilidade
            },
          },
          '@media (max-width: 768px)': {
            '& .MuiInputBase-input': {
              padding: '8px 10px',
              fontSize: '12px', // Fonte menor
            },
          },
          '@media (max-width: 320px)': {
            '& .MuiInputBase-input': {
              padding: '6px 8px',
              fontSize: '11px', // Ajuste para telas muito pequenas
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '@media (max-width: 768px)': {
            fontSize: '12px',
            '& .MuiSelect-select': {
              padding: '8px 10px', // Menor padding
            },
          },
          '@media (max-width: 320px)': {
            fontSize: '11px',
            '& .MuiSelect-select': {
              padding: '6px 8px',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          height: '40px',
          '& input': {
            padding: '10px 14px',
          },
          '@media (max-width: 768px)': {
            fontSize: '12px',
            height: '36px',
            '& input': {
              padding: '8px 12px',
            },
          },
          '@media (max-width: 320px)': {
            fontSize: '11px',
            height: '32px',
            '& input': {
              padding: '6px 10px',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          color: '#607D8B',
          '&.Mui-focused': {
            color: '#26A69A',
          },
          '@media (max-width: 768px)': {
            fontSize: '12px',
          },
          '@media (max-width: 320px)': {
            fontSize: '11px',
          },
        },
      },
    },
  },
});

// Componentes estilizados com ajustes apenas para telas menores
const PendingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1c40f;
  color: #fff;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  margin-left: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  svg {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 11px; // Fonte menor
    padding: 6px 10px;
    svg {
      font-size: 12px; // Ícone menor
    }
  }

  @media (max-width: 320px) {
    font-size: 10px;
    padding: 5px 8px;
    svg {
      font-size: 10px;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #7AC143 0%, #27ae60 100%);
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px; // Menor padding
    margin-bottom: 16px;
  }

  @media (max-width: 320px) {
    padding: 8px 10px;
    margin-bottom: 12px;
  }
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.5px;
  }

  svg {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    h1 { font-size: 20px; } // Ajustado para consistência
    svg { font-size: 16px; }
  }

  @media (max-width: 320px) {
    h1 { font-size: 18px; }
    svg { font-size: 14px; }
  }
`;

const Card = styled.div`
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    padding: 24px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        padding: 12px;
        margin-bottom: 12px;
    }

    @media (max-width: 320px) {
        padding: 10px;
        margin-bottom: 10px;
    }
`

const FilterSection = styled.div`
    margin-bottom: 24px;

    @media (max-width: 768px) {
        margin-bottom: 16px;
    }

    @media (max-width: 320px) {
        margin-bottom: 12px;
    }
`;

const FilterForm = styled.form`
     display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  align-items: end;
  padding: 16px 0;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 8px;
        padding: 12px 0;
    }

    @media (max-width: 320px) {
        gap: 6px;
        padding: 10px;
0;
    }
`;

const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media (max-width: 768px) {
        gap: 6px;
    }
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #4a5568;

    @media (max-width: 768px) {
        font-size: 11px; // Label menor
    }

    @media (max-width: 320px) {
        font-size: 10px;
    }
`;

const ActionsContainer = styled.div`
    display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e6e6e6;
  margin-top: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding-top: 10px;
    }

    @media (max-width: 320px) {
        gap: 6px;
        padding-top: 8px;
    }
`;

const Button = styled.button`
    padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.secondary ? '#6b7280' : '#7AC143')};
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;

    &:hover {
        background: ${({ secondary }) => secondary ? '#5a6268' : '#6AB03A'};
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transform: translateY(-1px);
    }

    &:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        transform: none;
    }

    &:active {
        transform: scale(0.98);
    }

    svg {
        font-size: 16px;
    }

    @media (max-width: 768px) {
        padding: 10px 12px; // Maior área de toque
        font-size: 12px;
        min-height: 44px; // Acessibilidade
        svg {
            font-size: 14px;
        }
        // Botão de filtrar destacado
        &[type="submit"] {
            background: #26A69A;
            font-size: 13px;
            padding: 12px;
            &:hover {
                background: #1e8e83;
            }
        }
    }

    @media (max-width: 320px) {
        padding: 8px 10px;
        font-size: 11px;
        svg {
            font-size: 12px;
        }
    }
`;

const EditButton = styled.button`
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;

    &:hover {
        background: #7ac143;
        color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transform: translateY(-1px);
    }

    svg {
        font-size: 18px;
        color: rgb(9, 52, 138);
    }

    @media (max-width: 768px) {
        width: 36px; // Maior para toque
        height: 36px;
        svg {
            font-size: 16px;
        }
    }

    @media (max-width: 320px) {
        width: 32px;
        height: 32px;
        svg {
            font-size: 14px;
        }
    }
`;

const DeleteButton = styled.button`
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;

    &:hover {
        background: #ef5350;
        color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    svg {
        font-size: 16px;
        color: rgb(239, 83, 80);
    }

    @media (max-width: 768px) {
        width: 36px; // Maior para toque
        height: 36px;
        svg {
            font-size: 14px;
        }
    }

    @media (max-width: 320px) {
        width: 32px;
        height: 32px;
        svg {
            font-size: 12px;
        }
    }
`;

const TableWrapper = styled.div`
    overflow-x: auto;
    width: 100%;
    -webkit-overflow-scrolling: touch;

    @media (max-width: 768px) {
        overflow-x: hidden; // Sem rolagem horizontal nos cartões
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    box-sizing: border-box;
    table-layout: auto;

    @media (max-width: 768px) {
        display: block;
        border-spacing: 0;
    }
`;

const Th = styled.th`
    padding: 12px 8px;
    background: #f2f9f4;
    color: #333;
    text-align: center;
    vertical-align: middle;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 2px solid #e6e6e6;
    white-space: nowrap;

    &:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }

    &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    &:nth-child(1) { min-width: 120px; width: 18%; }
    &:nth-child(2) { min-width: 100px; width: 14%; }
    &:nth-child(3) { min-width: 80px; width: 10%; }
    &:nth-child(4) { min-width: 100px; width: 12%; }
    &:nth-child(5) { min-width: 100px; width: 12%; }
    &:nth-child(6) { min-width: 80px; width: 10%; }
    &:nth-child(7) { min-width: 80px; width: 10%; }
    &:nth-child(8) { min-width: 60px; width: 8%; }
    &:nth-child(9) { min-width: 80px; width: 10%; }
    &:nth-child(10) { min-width: 80px; width: 6%; }

    @media (max-width: 768px) {
        display: none; // Oculta cabeçalhos nos cartões
    }
`;

const ThContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    svg {
        font-size: 16px;
        color: ${({ iconColor }) => iconColor || '#333'};
    }

    span {
        font-size: 14px;
    }

    @media (max-width: 768px) {
        display: none; // Oculta conteúdo nos cartões
    }
`;

const Tr = styled.tr`
    transition: background-color 0.2s ease;
    cursor: pointer;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

    &:hover {
        background-color: #f7fafc;
    }

    &.selected {
        background-color: #e6f4ea;
        border-left: 4px solid #7ac143;
    }

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        margin-bottom: 14px;
        padding: 12px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        width: 100%;
        min-width: 320px;
        max-width: 100%;
    }

    @media (max-width: 320px) {
        padding: 8px;
        margin-bottom: 12px;
        width: 100%;
        min-width: 300px;
        max-width: 100%;
    }
`;
const Td = styled.td`
    padding: 12px 8px;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    box-sizing: border-box;
    white-space: nowrap;
    border-bottom: none;

    &.animal-cell {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-left: 12px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;

        span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    &.action-cell {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        padding-right: 12px;
        
    }

    @media (max-width: 768px) {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        text-align: left;
        padding: 6px 0;
        font-size: 11px;
        border-bottom: 1px solid #e2e8f0; // Divisor claro
        white-space: normal; // Permite quebra de texto

        &:before {
            content: attr(data-label);
            font-weight: 600;
            color: #2d3748;
            width: 40%;
            flex-shrink: 0;
            font-size: 12px;
        }

        &:last-child {
            border-bottom: none; // Último campo sem divisor
        }

        &.animal-cell {
            padding-left: 0;
            gap: 8px;
            flex-wrap: wrap;
        }

        &.action-cell {
            justify-content: flex-start;
            padding-right: 0;
            gap: 12px; // Mais espaço entre botões
        }
    }

    @media (max-width: 320px) {
        font-size: 10px;
        padding: 4px 0;

        &:before {
            font-size: 11px;
        }

        &.animal-cell {
            gap: 6px;
        }

        &.action-cell {
            gap: 10px;
        }
    }
`;

const Pagination = styled.div`
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    @media (max-width: 768px) {
        justify-content: center; // Centralizado
        gap: 8px;
        margin-top: 12px;
        span {
            display: none; // Oculta "Página X de Y"
        }
    }

    @media (max-width: 320px) {
        gap: 6px;
        margin-top: 10px;
    }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.44);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: hidden; /* Padrão sem rolagem em telas maiores */

  @media (max-width: 768px) {
    align-items: flex-start; /* Alinha ao topo */
    padding-top: 12px;
    overflow-y: auto; /* Habilita rolagem vertical */
    -webkit-overflow-scrolling: touch; /* Melhora a rolagem em dispositivos iOS */
  }
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh; /* Limita a altura máxima */
  overflow-y: auto; /* Garante que o conteúdo interno seja rolável */
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px; /* Mais espaço */
    width: 95%;
    max-height: calc(100vh - 24px); /* Ajusta para padding-top do ModalOverlay */
    border-radius: 8px;
  }

  @media (max-width: 320px) {
    padding: 16px;
  }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #6b7280;
    border-radius: 50%;
    transition: color 0.2s ease, background 0.2s ease;

    &:hover {
        color: #1a1a1a;
        background: #f3f4f6;
    }

    svg {
        font-size: 20px;
    }

    @media (max-width: 768px) {
        top: 12px;
        right: 12px;
        padding: 10px; // Maior área de toque
        background: #f3f4f6; // Fundo fixo
        svg {
            font-size: 18px;
        }
    }

    @media (max-width: 320px) {
        padding: 8px;
        svg {
            font-size: 16px;
        }
    }
`;

const ExameFormWrapper = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        max-height: calc(100vh - 90px); // Ajuste para botão de fechar
    }
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    border: 2px solid;
    border-color: ${({ status }) =>
    status === 'Concluído' ? '#7AC143' : status === 'Pendente' ? '#f1c40f' : '#6b7280'};
    color: ${({ status }) =>
    status === 'Concluído' ? '#7AC143' : status === 'Pendente' ? '#f1c40f' : '#6b7280'};
    background-color: #fff;

    @media (max-width: 768px) {
        font-size: 10px;
        padding: 3px 8px;
    }

    @media (max-width: 320px) {
        font-size: 9px;
        padding: 2px 6px;
    }
`;

const PaymentTypeBadge = styled.span`
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    border: 2px solid;
    color: #fff;
    background-color: ${({ type }) =>
    type === 'Pix' ? '#7d269f' :
      type === 'Dinheiro' ? '#27ae60' :
        type === 'Pet Love' ? '#e91e63' :
          type === 'Cartão' ? '#2980b9' : '#6b7280'};
    border-color: ${({ type }) =>
    type === 'Pix' ? '#7d269f' :
      type === 'Dinheiro' ? '#27ae60' :
        type === 'Pet Love' ? '#e91e63' :
          type === 'Cartão' ? '#2980b9' : '#6b7280'};
    @media (max-width: 768px) {
        font-size: 10px;
        padding: 3px 8px;
    }

    @media (max-width: 320px) {
        font-size: 9px;
        padding: 2px 6px;
    }
`;

// Componente principal (lógica inalterada, renderização ajustada)
const ExamesList = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [exames, setExames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tiposPagamento, setTiposPagamento] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExame, setSelectedExame] = useState(null);

  useEffect(() => {
    if (isModalOpen || isEditModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, isEditModalOpen]);

  useEffect(() => {
    if (!isModalOpen && !isEditModalOpen && !formLoading) {
      console.log('Modal fechado, atualizando lista e contador com filtros:', activeFilters);
      setPage(1);
      fetchExames({ ...activeFilters, page: 1 });
      fetchPendingCount(activeFilters);
    }
  }, [isModalOpen, isEditModalOpen, formLoading, activeFilters]);

  useEffect(() => {
    fetchExames(activeFilters);
    fetchPendingCount(activeFilters);
    if (user?.role === 'Admin') {
      api
        .get('/api/tipos-pagamento')
        .then((response) => {
          setTiposPagamento(Array.isArray(response.data) ? response.data : []);
        })
        .catch((err) => {
          setTiposPagamento([]);
          console.error('Erro ao carregar tipos de pagamento:', err);
        });
    }
  }, [page, user, activeFilters]);

  const fetchPendingCount = async (filters = {}) => {
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries({ ...filters, status: 'Pendente' }).filter(([_, value]) => value !== undefined)
      );
      console.log('Buscando contagem de pendentes com filtros:', cleanedFilters);
      const response = await api.get('/api/exames', {
        params: { ...cleanedFilters, page: 1, limit: 1 },
      });
      console.log('Resposta da API (pendingCount):', response.data);
      const count = response.data.totalCount || 0;
      setPendingCount(count);
    } catch (err) {
      console.error('Erro ao carregar contagem de laudos pendentes:', err);
      setPendingCount(0);
      toast.error('Erro ao carregar contagem de laudos pendentes.');
    }
  };

  const fetchExames = async (filters = {}) => {
    try {
      setLoading(true);
      const cleanedFilters = Object.fromEntries(
        Object.entries({ page, limit: 10, ...filters }).filter(([_, value]) => value !== undefined)
      );
      console.log('Buscando exames com filtros:', cleanedFilters);
      const response = await api.get('/api/exames', { params: cleanedFilters });
      console.log('Resposta da API (exames):', response.data);
      if (response.data && Array.isArray(response.data.exames)) {
        setExames(response.data.exames);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setExames([]);
        setTotalPages(1);
        toast.warn('Nenhum exame retornado pela API.');
      }
    } catch (err) {
      console.error('Erro ao carregar exames:', err.response?.data || err.message);
      setError('Erro ao carregar a lista de exames.');
      setExames([]);
      setTotalPages(1);
      toast.error('Falha ao buscar exames. Verifique a conexão ou o backend.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    const startDate = data.dataInicio ? new Date(data.dataInicio) : null;
    const endDate = data.dataFim ? new Date(data.dataFim) : null;

    if (startDate && endDate && endDate < startDate) {
      toast.error('A data de fim não pode ser anterior à data de início.');
      return;
    }

    const filters = {
      startDate: data.dataInicio || undefined,
      endDate: data.dataFim || undefined,
      animal_name: data.animal || undefined,
      tutor: data.tutor || undefined,
      clinic_name: data.clinic ? data.clinic.trim() : undefined,
      status: data.status !== '' ? data.status : undefined,
    };
    setPage(1);
    setActiveFilters(filters);
    console.log('Filtros aplicados:', filters);
  };

  const handleDownloadPdf = async (id) => {
    try {
      const response = await api.get(`/api/exames/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exame_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      toast.error('Erro ao baixar PDF.');
    }
  };

  const handleDeleteExam = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este exame?')) {
      try {
        await api.delete(`/api/exames/${id}`);
        toast.success('Exame excluído com sucesso!');
        setPage(1);
        fetchExames({ ...activeFilters, page: 1 });
        fetchPendingCount(activeFilters);
      } catch (error) {
        console.error('Erro ao excluir exame:', error);
        toast.error('Erro ao excluir exame.');
      }
    }
  };

  const handleRefresh = () => {
    reset();
    setPage(1);
    setActiveFilters({});
    fetchExames({});
    fetchPendingCount({});
    toast.info('Filtros limpos e lista atualizada!');
  };

  const handleSelectExam = (id) => {
    setSelectedExamId(id === selectedExamId ? null : id);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectExam(id);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Fechando modal, formLoading:', formLoading);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedExame(null);
  };

  const openEditModal = async (exameId) => {
    try {
      setFormLoading(true);
      console.log('Buscando exame com ID:', exameId);
      const response = await api.get(`/api/exames/${exameId}`);
      console.log('Resposta da API (exame):', response.data);
      setSelectedExame(response.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar exame:', error);
      toast.error('Erro ao carregar dados do exame para edição.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleExamCreated = ({ exameId, files }) => {
    console.log('Exame criado, atualizando lista e contador...');
    setPage(1);
    fetchExames({ ...activeFilters, page: 1 });
    fetchPendingCount(activeFilters);
    toast.success('Exame criado com sucesso!');
  };

  const handleExamUpdated = () => {
    console.log('Exame atualizado, atualizando lista e contador...');
    setPage(1);
    fetchExames({ ...activeFilters, page: 1 });
    fetchPendingCount(activeFilters);
    toast.success('Exame atualizado com sucesso!', { duration: 2000 });
  };

  const handleExamDeleted = () => {
    console.log('Exame excluído, atualizando lista e contador...');
    setPage(1);
    fetchExames({ ...activeFilters, page: 1 });
    fetchPendingCount(activeFilters);
    toast.success('Exame excluído com sucesso!');
    closeModal();
  };

  const handleFormLoading = (isLoading) => {
    console.log('Atualizando formLoading:', isLoading);
    setFormLoading(isLoading);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTipoPagamentoNome = (exame) => {
    if (exame.TipoPagamento?.nome) {
      return exame.TipoPagamento.nome;
    }
    if (exame.tipo_pagamento_id && tiposPagamento.length > 0) {
      const tipo = tiposPagamento.find((tp) => tp.id === exame.tipo_pagamento_id);
      return tipo?.nome || 'N/A';
    }
    return 'N/A';
  };

  // Dados para rótulos dos cartões em telas menores
  const cellLabels = {
    animal: 'Nome do Pet',
    tutor: 'Tutor',
    date: 'Data',
    clinic: 'Clínica',
    examType: 'Exame',
    status: 'Laudo Enviado',
    value: 'Valor',
    pago: 'Pago',
    paymentType: 'Forma de Pagamento',
    actions: 'Ações',
  };

  if (loading) {
    return (
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaStethoscope />
            <h1>Exames</h1>
          </TitleContent>
          <PendingBadge aria-label={`Existem ${pendingCount} laudos pendentes`}>
            <FaExclamationTriangle />
            <span>Laudos pendentes: {pendingCount}</span>
          </PendingBadge>
        </TitleContainer>
        <p>Carregando...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaStethoscope />
            <h1>Exames</h1>
          </TitleContent>
          <PendingBadge aria-label={`Existem ${pendingCount} laudos pendentes`}>
            <FaExclamationTriangle />
            <span>Laudos pendentes: {pendingCount}</span>
          </PendingBadge>
        </TitleContainer>
        <p>{error}</p>
      </Layout>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaStethoscope />
            <h1>Exames</h1>
          </TitleContent>
          <PendingBadge aria-label={`Existem ${pendingCount} laudos pendentes`}>
            <FaExclamationTriangle />
            <span>Laudos pendentes: {pendingCount}</span>
          </PendingBadge>
        </TitleContainer>
        <Card>
          <FilterSection>
            <FilterForm onSubmit={handleSubmit(onSubmit)}>
              <FilterGroup>
                <Label htmlFor="dataInicio">Data Início</Label>
                <TextField
                  id="dataInicio"
                  {...register('dataInicio')}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      '& input::-webkit-calendar-picker-indicator': {
                        filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(160deg)',
                        cursor: 'pointer',
                      },
                    },
                  }}
                  error={!!errors.dataInicio}
                  helperText={errors.dataInicio?.message}
                  disabled={loading}
                  fullWidth
                  aria-label="Data de início"
                  title="Selecione a data de início"
                />
              </FilterGroup>
              <FilterGroup>
                <Label htmlFor="dataFim">Data Fim</Label>
                <TextField
                  id="dataFim"
                  {...register('dataFim')}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      '& input::-webkit-calendar-picker-indicator': {
                        filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(160deg)',
                        cursor: 'pointer',
                      },
                    },
                  }}
                  error={!!errors.dataFim}
                  helperText={errors.dataFim?.message}
                  disabled={loading}
                  fullWidth
                  aria-label="Data de fim"
                  title="Selecione a data de fim"
                />
              </FilterGroup>
              <FilterGroup>
                <Label htmlFor="animal">Nome do Paciente</Label>
                <TextField
                  id="animal"
                  {...register('animal')}
                  placeholder="Nome do pet"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaPaw style={{ color: '#9CCC65', fontSize: '1.4rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.animal}
                  helperText={errors.animal?.message}
                  disabled={loading}
                  fullWidth
                  aria-label="Filtrar por nome do pet"
                  title="Digite o nome do pet"
                />
              </FilterGroup>
              <FilterGroup>
                <Label htmlFor="tutor">Tutor</Label>
                <TextField
                  id="tutor"
                  {...register('tutor')}
                  placeholder="Nome do tutor"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaUser style={{ color: '#3498db', fontSize: '1.4rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.tutor}
                  helperText={errors.tutor?.message}
                  disabled={loading}
                  fullWidth
                  aria-label="Filtrar por tutor"
                  title="Digite o nome do tutor"
                />
              </FilterGroup>
              {user?.role === 'Admin' && (
                <FilterGroup>
                  <Label htmlFor="clinic">Clínica</Label>
                  <TextField
                    id="clinic"
                    {...register('clinic')}
                    placeholder="Nome da clínica"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaHospital style={{ color: '#26A69A', fontSize: '1.4rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.clinic}
                    helperText={errors.clinic?.message}
                    disabled={loading}
                    fullWidth
                    aria-label="Filtrar por clínica"
                    title="Digite o nome da clínica"
                  />
                </FilterGroup>
              )}
              <FilterGroup>
                <Label htmlFor="status">Status do Laudo</Label>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status do Laudo</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <MuiSelect
                        labelId="status-label"
                        id="status"
                        {...field}
                        label="Status do Laudo"
                        disabled={loading}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <FaFileAlt style={{ color: '#FF7043', fontSize: '1.4rem' }} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">Todos os Status</MenuItem>
                        <MenuItem value="Concluído">Concluído</MenuItem>
                        <MenuItem value="Pendente">Pendente</MenuItem>
                      </MuiSelect>
                    )}
                  />
                </FormControl>
              </FilterGroup>
            </FilterForm>
            <ActionsContainer>
              <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={loading} title="Aplicar filtros" aria-label="Aplicar filtros">
                <FaFilter /> Filtrar
              </Button>
              <Button secondary onClick={handleRefresh} disabled={loading} title="Limpar todos os filtros" aria-label="Limpar filtros">
                <FaRedo /> Limpar
              </Button>
              {user?.role === 'Admin' && (
                <Button type="button" onClick={openModal} disabled={loading} title="Adicionar novo exame" aria-label="Adicionar novo exame">
                  <FaPlus /> Adicionar Exame
                </Button>
              )}
            </ActionsContainer>
          </FilterSection>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th><ThContent iconColor="#7AC143"><FaPaw /><span>Nome do Pet</span></ThContent></Th>
                  <Th><ThContent iconColor="#3498db"><FaUser /><span>Tutor</span></ThContent></Th>
                  <Th><ThContent iconColor="#8e44ad"><FaCalendarAlt /><span>Data</span></ThContent></Th>
                  <Th><ThContent iconColor="#2c3e50"><FaHospital /><span>Clínica</span></ThContent></Th>
                  <Th><ThContent iconColor="#e74c3c"><FaStethoscope /><span>Exame</span></ThContent></Th>
                  <Th><ThContent iconColor="#FF7043"><FaFileAlt /><span>Laudo enviado</span></ThContent></Th>
                  <Th><ThContent iconColor="#27ae60"><FaDollarSign /><span>Valor</span></ThContent></Th>
                  <Th><ThContent iconColor="#2ecc71"><FaCheckCircle /><span>Pago</span></ThContent></Th>
                  <Th><ThContent iconColor="#2980b9"><FaMoneyCheckAlt /><span>Forma de Pagamento</span></ThContent></Th>
                  <Th><ThContent iconColor="#6b7280"><FaCog /><span>Ações</span></ThContent></Th>
                </tr>
              </thead>
              <tbody>
                {exames.length > 0 ? (
                  exames.map((exame, index) => (
                    <Tr
                      key={exame.id}
                      className={selectedExamId === exame.id ? 'selected' : ''}
                      onClick={() => handleSelectExam(exame.id)}
                      onKeyDown={(e) => handleKeyDown(e, exame.id)}
                      tabIndex={0}
                      aria-selected={selectedExamId === exame.id}
                      role="row" // Corrigido de "banner" para "row"
                      aria-label={`Exame ${index + 1}: ${exame.animal_name || 'N/A'}`}
                    >
                      <Td className="animal-cell" data-label={cellLabels.animal}>
                        {user?.role === 'Admin' && (
                          <EditButton
                            as="a"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(exame.id);
                            }}
                            title="Editar exame"
                            aria-label="Editar exame"
                          >
                            <FiEdit />
                          </EditButton>
                        )}
                        <span>{exame.animal_name || 'N/A'}</span>
                      </Td>
                      <Td data-label={cellLabels.tutor}>{exame.tutor || 'N/A'}</Td>
                      <Td data-label={cellLabels.date}>{formatDate(exame.date)}</Td>
                      <Td data-label={cellLabels.clinic}>{exame.clinic_name || 'N/A'}</Td>
                      <Td data-label={cellLabels.examType}>{exame.ExamType?.name || 'N/A'}</Td>
                      <Td data-label={cellLabels.status}>
                        <StatusBadge status={exame.status}>
                          {exame.status || 'N/A'}
                        </StatusBadge>
                      </Td>
                      <Td data-label={cellLabels.value}>
                        R$ {typeof exame.value === 'number' ? exame.value.toFixed(2) : '0.00'}
                      </Td>
                      <Td data-label={cellLabels.pago} style={{ color: exame.pago ? '#7AC143' : '#e74c3c' }}>
                        {exame.pago ? 'Sim' : 'Não'}
                      </Td>
                      <Td data-label={cellLabels.paymentType}>
                        <PaymentTypeBadge type={getTipoPagamentoNome(exame)}>
                          {getTipoPagamentoNome(exame)}
                        </PaymentTypeBadge>
                      </Td>
                      <Td className="action-cell" data-label={cellLabels.actions}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPdf(exame.id);
                          }}
                          title="Baixar laudo em PDF"
                          aria-label="Baixar laudo em PDF"
                        >
                          <FiDownload /> LAUDO
                        </Button>
                        {user?.role === 'Admin' && (
                          <DeleteButton
                            as="a"
                            onClick={(e) => handleDeleteExam(exame.id, e)}
                            title="Excluir exame"
                            aria-label="Excluir exame"
                          >
                            <FaTrash />
                          </DeleteButton>
                        )}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="10">
                      {activeFilters.clinic_name
                        ? 'Nenhum exame encontrado para a clínica especificada.'
                        : 'Nenhum exame encontrado.'}
                    </Td>
                  </Tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
          <Pagination>
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              aria-label="Página anterior"
            >
              Anterior
            </Button>
            <span>{`Página ${page} de ${totalPages}`}</span>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              aria-label="Próxima página"
            >
              Próximo
            </Button>
          </Pagination>
        </Card>

        {(isModalOpen || isEditModalOpen) && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={closeModal} title="Fechar" aria-label="Fechar modal">
                <FaTimes />
              </CloseButton>
              <ExameFormWrapper>
                <ExameForm
                  onExamCreated={handleExamCreated}
                  onExamUpdated={handleExamUpdated}
                  onExamDeleted={handleExamDeleted}
                  noLayout={true}
                  onClose={closeModal}
                  onFormLoading={handleFormLoading}
                  exame={isEditModalOpen ? selectedExame : null}
                  isEditMode={isEditModalOpen}
                />
              </ExameFormWrapper>
            </ModalContent>
          </ModalOverlay>
        )}
      </Layout>
    </ThemeProvider>
  );
};

export default ExamesList;
