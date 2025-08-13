import React, { useEffect, useState, useContext, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';
import api from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaChartBar, FaFilter, FaPaw, FaUser, FaCalendarAlt, FaHospital, FaStethoscope, FaDollarSign, FaCheckCircle, FaMoneyCheckAlt, FaDownload, FaRedo, FaTimes } from 'react-icons/fa';
import { MonetizationOn, AssignmentTurnedIn, Warning, ListAlt } from '@mui/icons-material';

// Lazy load heavy libraries
const jsPDF = lazy(() => import('jspdf'));
const html2canvas = lazy(() => import('html2canvas'));
// Constants (memoized to prevent recreation)
const COLORS = {
  primaryRoyalBlue: '#2D5BFF',
  primaryAquaGreen: '#00C49A',
  secondaryGoldenYellow: '#A66DD4',
  secondaryOrange: '#FF7043',
  secondaryPurple: '#A66DD4',
  backgroundOffWhite: '#F8F8FF',
  textSoftBlack: '#1A1A1A',
  textWhite: '#FFFFFF',
  cardBackground: '#FFFFFF',
  gray: '#6B7280',
};

const STYLES = {
  cardBorderRadius: '12px',
  cardBoxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
  buttonBorderRadius: '8px',
};

const FONTS = {
  title: 'Montserrat, sans-serif',
  subtitle: 'Montserrat, sans-serif',
  bitwise: 'Inter, Roboto Mono, monospace',
  body: 'Inter, sans-serif',
};

// Styled Components (memoized to prevent recreation)
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.cardBackground};
  border-radius: ${STYLES.cardBorderRadius};
  box-shadow: ${STYLES.cardBoxShadow};
  padding: 16px;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  h1 {
    font-family: ${FONTS.title};
    font-size: 24px;
    font-weight: 600;
    color: ${COLORS.textSoftBlack};
    margin: 0;
  }

  svg {
    font-size: 24px;
    color: ${COLORS.primaryRoyalBlue};
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 18px;
    }
    svg {
      font-size: 20px;
    }
  }
`;

const Card = styled.div`
  background-color: ${COLORS.cardBackground};
  border-radius: ${STYLES.cardBorderRadius};
  box-shadow: ${STYLES.cardBoxShadow};
  padding: ${(props) => (props.tight ? '12px' : '16px')};
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: ${(props) => (props.tight ? '8px' : '12px')};
    margin-bottom: 12px;
  }
`;

const FilterSection = styled.div`
  padding: 0;
  margin-bottom: 0;
`;

const FilterForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  align-items: end;
  padding: 12px 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 8px 0;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-family: ${FONTS.body};
  font-size: 13px;
  font-weight: 500;
  color: ${COLORS.textSoftBlack};
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${STYLES.buttonBorderRadius};
  font-family: ${FONTS.body};
  font-size: 13px;
  outline: none;
  width: 100%;
  background-color: ${COLORS.backgroundOffWhite};
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${COLORS.primaryRoyalBlue};
    box-shadow: 0 0 0 2px rgba(45, 91, 255, 0.2);
  }

  &[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.5) sepia(1) saturate(5) hue-rotate(200deg);
  }

  &[type="checkbox"] {
    width: auto;
    height: 16px;
    cursor: pointer;
    accent-color: ${COLORS.primaryRoyalBlue};
  }
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${STYLES.buttonBorderRadius};
  font-family: ${FONTS.body};
  font-size: 13px;
  outline: none;
  width: 100%;
  background-color: ${COLORS.backgroundOffWhite};
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${COLORS.primaryRoyalBlue};
    box-shadow: 0 0 0 2px rgba(45, 91, 255, 0.2);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 12px;
  margin-top: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Button = styled.button`
  padding: 6px 16px;
  border: ${(props) => (props.secondary ? `1px solid ${COLORS.primaryRoyalBlue}` : 'none')};
  border-radius: ${STYLES.buttonBorderRadius};
  cursor: pointer;
  background: ${(props) =>
    props.danger
      ? COLORS.secondaryOrange
      : props.secondary
        ? 'transparent'
        : COLORS.primaryRoyalBlue};
  color: ${(props) => (props.secondary ? COLORS.primaryRoyalBlue : COLORS.textWhite)};
  font-family: ${FONTS.subtitle};
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${(props) =>
    props.danger
      ? '#E55A32'
      : props.secondary
        ? 'rgba(45, 91, 255, 0.04)'
        : '#254EDA'};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #d1d5db;
    color: ${COLORS.textWhite};
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 14px;
  }

  @media (max-width: 600px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const StatContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const StatCard = styled.div`
  background-color: ${(props) =>
    props.type === 'total_exames'
      ? COLORS.secondaryGoldenYellow
      : props.type === 'total_value'
        ? COLORS.primaryRoyalBlue
        : props.type === 'exames_pagos'
          ? COLORS.primaryAquaGreen
          : COLORS.secondaryOrange};
  color: ${COLORS.textWhite};
  border-radius: 10px;
  box-shadow: ${STYLES.cardBoxShadow};
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StatTitle = styled.h3`
  font-family: ${FONTS.subtitle};
  font-size: 14px;
  font-weight: 500;
  color: ${COLORS.textWhite};
  margin-bottom: 6px;
  opacity: 0.9;
`;

const StatValue = styled.p`
  font-family: ${FONTS.bitwise};
  font-size: 20px;
  font-weight: bold;
  color: ${COLORS.textWhite};
  margin: 0;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  box-sizing: border-box;
  table-layout: auto;
`;

const Th = styled.th`
  padding: 12px 8px;
  background: #f2f9f4;
  color: #333;
  text-align: center;
  vertical-align: middle;
  font-family: ${FONTS.subtitle};
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
  &:nth-child(7) { min-width: 60px; width: 8%; }
  &:nth-child(8) { min-width: 80px; width: 10%; }
  &:nth-child(9) { min-width: 50px; width: 5%; }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 4px;
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
    svg {
      font-size: 14px;
    }
    span {
      font-size: 12px;
    }
  }
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  cursor: pointer;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f7fafc;
  }

  &.selected {
    background-color: #e6f4ea;
    border-left: 4px solid ${COLORS.primaryAquaGreen};
  }
`;

const Td = styled.td`
  padding: 12px 8px;
  text-align: center;
  vertical-align: middle;
  font-family: ${FONTS.body};
  font-size: 14px;
  box-sizing: border-box;
  white-space: nowrap;
  border-bottom: none;

  &.animal-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 4px;
  }
`;

const PaymentTypeBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-family: ${FONTS.body};
  font-size: 12px;
  font-weight: 500;
  border: 2px solid;
  color: #fff;
  background-color: ${({ type }) =>
    type === 'PIX' ? '#f1c40f' :
      type === 'Dinheiro' ? '#27ae60' :
        type === 'Pet Love' ? '#e91e63' :
          type === 'Cartão' ? '#2980b9' : '#6b7280'};
  border-color: ${({ type }) =>
    type === 'PIX' ? '#f1c40f' :
      type === 'Dinheiro' ? '#27ae60' :
        type === 'Pet Love' ? '#e91e63' :
          type === 'Cartão' ? '#2980b9' : '#6b7280'};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.44);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${COLORS.cardBackground};
  border-radius: ${STYLES.cardBorderRadius};
  padding: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${STYLES.cardBoxShadow};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: ${COLORS.textSoftBlack};
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  svg {
    font-size: 18px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ModalTitle = styled.h2`
  font-family: ${FONTS.title};
  font-size: 18px;
  color: ${COLORS.textSoftBlack};
  margin-bottom: 8px;
`;

const ModalText = styled.p`
  font-family: ${FONTS.body};
  font-size: 14px;
  color: ${COLORS.textSoftBlack};
  margin-bottom: 16px;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${STYLES.buttonBorderRadius};
  font-family: ${FONTS.body};
  font-size: 13px;
  outline: none;
  width: 100%;
  background-color: ${COLORS.backgroundOffWhite};
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${COLORS.primaryRoyalBlue};
    box-shadow: 0 0 0 2px rgba(45, 91, 255, 0.2);
  }
`;

const ErrorMessage = styled.span`
  font-family: ${FONTS.body};
  font-size: 12px;
  color: ${COLORS.secondaryOrange};
  margin-top: 4px;
`;

const HiddenTableWrapper = styled.div`
  position: fixed;
  left: -9999px;
  top: 0;
  width: 100%;
  max-width: 1000px;
  overflow: hidden;
  box-sizing: border-box;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

const LoadingMessage = styled.p`
  font-family: ${FONTS.body};
  color: ${COLORS.textSoftBlack};
  text-align: center;
  margin: 16px 0;
`;

// Helper functions (without hooks - moved outside component)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

const formatDateForAPI = (dateString, isEndDate = false) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  if (isEndDate) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date.toISOString();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const getDefaultDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const formatForInput = (date) => date.toISOString().split('T')[0];
  return {
    start_date: formatForInput(firstDayOfMonth),
    end_date: formatForInput(today),
  };
};

// Client-side filter for date and clinic
const filterExamsByDateAndClinic = (exams, startDate, endDate, clinicName) => {
  if (!Array.isArray(exams)) {
    console.warn('[filterExamsByDateAndClinic] Exames não é um array:', exams);
    return [];
  }

  let filteredExams = exams;

  if (startDate || endDate) {
    filteredExams = filteredExams.filter((exame) => {
      const examDate = new Date(exame.date);
      if (isNaN(examDate.getTime())) return false;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      return (!start || examDate >= start) && (!end || examDate <= end);
    });
  }

  if (clinicName) {
    filteredExams = filteredExams.filter((exame) =>
      exame.clinic_name?.toLowerCase() === clinicName.toLowerCase()
    );
  }

  return filteredExams;
};

// Client-side stats calculation
const calculateStatsFromExams = (exams) => {
  if (!Array.isArray(exams)) {
    console.warn('[calculateStatsFromExams] Exames não é um array:', exams);
    return {
      total_exames: 0,
      total_value: 0,
      exames_pagos: 0,
      exames_pendentes: 0,
      valor_pago: 0,
      valor_pendente: 0,
      exames_ultimos_30_dias: 0,
      valor_ultimos_30_dias: 0,
      by_type: {},
      by_payment_type: {},
      by_clinic: {},
    };
  }

  const stats = {
    total_exames: exams.length,
    total_value: 0,
    exames_pagos: 0,
    exames_pendentes: 0,
    valor_pago: 0,
    valor_pendente: 0,
    exames_ultimos_30_dias: 0,
    valor_ultimos_30_dias: 0,
    by_type: {},
    by_payment_type: {},
    by_clinic: {},
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  exams.forEach((exame) => {
    const value = Number(exame.value) || 0;
    stats.total_value += value;

    if (exame.pago) {
      stats.exames_pagos += 1;
      stats.valor_pago += value;
    } else {
      stats.exames_pendentes += 1;
      stats.valor_pendente += value;
    }

    const examDate = new Date(exame.date);
    if (examDate >= thirtyDaysAgo) {
      stats.exames_ultimos_30_dias += 1;
      stats.valor_ultimos_30_dias += value;
    }

    const examType = exame.ExamType?.name || exame.exame_nome || 'N/A';
    stats.by_type[examType] = (stats.by_type[examType] || 0) + 1;

    const paymentType = exame.TipoPagamento?.nome || 'Nenhum';
    stats.by_payment_type[paymentType] = (stats.by_payment_type[paymentType] || 0) + 1;

    const clinic = exame.clinic_name || 'N/A';
    stats.by_clinic[clinic] = (stats.by_clinic[clinic] || 0) + 1;
  });

  return stats;
};

// Memoized PaymentModal component
const PaymentModal = React.memo(({ open, onClose, onConfirm, loading, selectedCount }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = useCallback((data) => {
    onConfirm(data);
  }, [onConfirm]);

  return (
    <ModalOverlay style={{ display: open ? 'flex' : 'none' }}>
      <ModalContent>
        <CloseButton onClick={onClose} title="Fechar" disabled={loading}>
          <FaTimes />
        </CloseButton>
        <ModalTitle>Marcar Exames como Pagos</ModalTitle>
        <ModalText>Você está prestes a marcar {selectedCount} exame(s) como pago(s). Confirme os detalhes abaixo:</ModalText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FilterGroup>
            <Label htmlFor="observacao">Observação</Label>
            <TextArea
              id="observacao"
              {...register('observacao', { maxLength: { value: 255, message: 'Observação deve ter no máximo 255 caracteres' } })}
              placeholder="Observação (opcional)"
              disabled={loading}
              aria-label="Digite uma observação"
            />
            {errors.observacao && <ErrorMessage>{errors.observacao.message}</ErrorMessage>}
          </FilterGroup>
          <ActionsContainer>
            <Button type="button" secondary onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processando...' : 'Confirmar'}
            </Button>
          </ActionsContainer>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
});

const Relatorios = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();

  // Optimized state management
  const [stats, setStats] = useState({
    total_exames: 0,
    total_value: 0,
    exames_pagos: 0,
    exames_pendentes: 0,
    valor_pago: 0,
    valor_pendente: 0,
    exames_ultimos_30_dias: 0,
    valor_ultimos_30_dias: 0,
    by_type: {},
    by_payment_type: {},
    by_clinic: {},
  });

  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tiposPagamento, setTiposPagamento] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedExams, setSelectedExams] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // ALTERAÇÃO: Novo estado para clínicas e controle de carregamento
  const [clinics, setClinics] = useState([]);
  const [clinicsLoaded, setClinicsLoaded] = useState(false);

  const itemsPerPage = 10;
  const tableRef = useRef(null);
  const pdfTableRef = useRef(null);
  const statContainerRef = useRef(null);
  const selectAllRef = useRef(null);

  // Memoized derived values
  // ALTERAÇÃO: Remover clinics derivado de stats.by_clinic, pois agora usamos o estado clinics
  // const clinics = useMemo(() => {
  //   return Object.keys(stats.by_clinic).sort();
  // }, [stats.by_clinic]);

  const currentExams = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return exames.slice(startIndex, endIndex);
  }, [exames, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(exames.length / itemsPerPage);
  }, [exames.length, itemsPerPage]);

  // ALTERAÇÃO: Função para buscar clínicas
  const fetchClinicas = useCallback(async () => {
    if (clinicsLoaded) return; // Evitar chamadas duplicadas
    try {
      setLoading(true);
      const response = await api.get('/api/clinicas'); // Ajuste o endpoint conforme necessário
      if (Array.isArray(response.data)) {
        setClinics(response.data.map(clinic => clinic.name || clinic.nome)); // Ajuste conforme a estrutura da resposta
        setClinicsLoaded(true);
      } else {
        setClinics([]);
        toast.warn('Nenhuma clínica encontrada.');
      }
    } catch (err) {
      console.error('[fetchClinicas] Erro ao buscar clínicas:', err);
      setClinics([]);
      toast.error('Erro ao carregar clínicas.');
    } finally {
      setLoading(false);
    }
  }, [clinicsLoaded]);

  // Optimized data fetching
  const fetchTiposPagamento = useCallback(async () => {
    try {
      const response = await api.get('/api/tipos-pagamento');
      setTiposPagamento(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setTiposPagamento([]);
      toast.error('Erro ao carregar tipos de pagamento.');
    }
  }, []);

  const fetchAllExames = useCallback(async (filters = {}) => {
    try {
      console.log('[fetchAllExames] Iniciando busca de exames com filtros:', filters);

      const formattedFilters = {
        ...filters,
        start_date: filters.start_date ? formatDateForAPI(filters.start_date, false) : undefined,
        end_date: filters.end_date ? formatDateForAPI(filters.end_date, true) : undefined,
        clinic_name: filters.clinic_name || undefined,
      };

      // ALTERAÇÃO: Aumentar o limite por página para 100 para reduzir requisições
      const firstResponse = await api.get('/api/exames', {
        params: { ...formattedFilters, page: 1, limit: 100 }
      });

      if (!firstResponse.data || !Array.isArray(firstResponse.data.exames)) {
        console.warn('[fetchAllExames] Resposta inválida da API:', firstResponse.data);
        return [];
      }

      const totalPages = firstResponse.data.totalPages || 1;
      let allExames = [...firstResponse.data.exames];

      // ALTERAÇÃO: Remover a limitação de maxParallelRequests e buscar todas as páginas
      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            api.get('/api/exames', {
              params: { ...formattedFilters, page, limit: 100 }
            })
          );
        }

        try {
          const responses = await Promise.all(pagePromises);
          responses.forEach(response => {
            if (response.data && Array.isArray(response.data.exames)) {
              allExames = [...allExames, ...response.data.exames];
            }
          });
        } catch (parallelError) {
          console.warn('[fetchAllExames] Erro em requisições paralelas:', parallelError);
          // Continuar com os exames já buscados
        }
      }

      console.log('[fetchAllExames] Total de exames buscados:', allExames.length);

      const filteredExams = filterExamsByDateAndClinic(
        allExames,
        filters.start_date,
        filters.end_date,
        filters.clinic_name
      );

      console.log('[fetchAllExames] Exames após filtro client-side:', filteredExams.length);
      return filteredExams;
    } catch (err) {
      console.error('[fetchAllExames] Erro ao buscar exames:', err);
      toast.error(`Erro ao carregar exames: ${err.response?.data?.message || err.message}`);
      return [];
    }
  }, []);

  const fetchRelatorios = useCallback(async (filters = {}) => {
    try {
      setLoading(true);

      const formattedFilters = {
        ...filters,
        start_date: filters.start_date ? formatDateForAPI(filters.start_date, false) : undefined,
        end_date: filters.end_date ? formatDateForAPI(filters.end_date, true) : undefined,
        clinic_name: filters.clinic_name || undefined,
      };

      console.log('[fetchRelatorios] Filtros formatados para API:', formattedFilters);

      // Fetch stats and exams in parallel
      const [statsResponse, fetchedExames] = await Promise.all([
        api.get('/api/relatorios/financeiros', { params: formattedFilters }),
        fetchAllExames(formattedFilters)
      ]);

      console.log('[fetchRelatorios] Resposta completa da API /relatorios/financeiros:', statsResponse.data);
      console.log('[fetchRelatorios] Total de exames buscados:', Array.isArray(fetchedExames) ? fetchedExames.length : 'undefined');

      let newStats;
      if (
        statsResponse.data &&
        typeof statsResponse.data === 'object' &&
        statsResponse.data.total_exames !== undefined
      ) {
        console.log('[fetchRelatorios] Usando dados de estatísticas da API:', statsResponse.data);
        newStats = {
          total_exames: statsResponse.data.total_exames || 0,
          total_value: statsResponse.data.total_value || 0,
          exames_pagos: statsResponse.data.exames_pagos || 0,
          exames_pendentes: statsResponse.data.exames_pendentes || 0,
          valor_pago: statsResponse.data.valor_pago || 0,
          valor_pendente: statsResponse.data.valor_pendente || 0,
          exames_ultimos_30_dias: statsResponse.data.exames_ultimos_30_dias || 0,
          valor_ultimos_30_dias: statsResponse.data.valor_ultimos_30_dias || 0,
          by_type: statsResponse.data.by_type || {},
          by_payment_type: statsResponse.data.by_payment_type || {},
          by_clinic: statsResponse.data.by_clinic || {},
        };

        const expectedTotalExames = Array.isArray(fetchedExames) ? fetchedExames.length : 0;
        if (
          newStats.total_exames !== expectedTotalExames ||
          (filters.clinic_name && !Object.keys(newStats.by_clinic).includes(filters.clinic_name))
        ) {
          console.warn(
            '[fetchRelatorios] Inconsistência detectada:',
            `API retornou total_exames=${newStats.total_exames}, mas exames filtrados=${expectedTotalExames}`,
            `Filtro clinic_name=${filters.clinic_name}, by_clinic=`,
            newStats.by_clinic
          );
          console.log('[fetchRelatorios] Calculando estatísticas client-side como fallback');
          newStats = calculateStatsFromExams(fetchedExames);
        }
      } else {
        console.warn('[fetchRelatorios] Resposta inválida ou vazia da API, calculando estatísticas client-side:', statsResponse.data);
        newStats = calculateStatsFromExams(fetchedExames);
      }

      setStats(newStats);
      setExames(Array.isArray(fetchedExames) ? fetchedExames : []);
      setCurrentPage(1);
      setSelectedExams([]);
      setLoading(false);
    } catch (err) {
      console.error('[fetchRelatorios] Erro ao buscar relatórios:', err);
      setError(`Erro ao carregar os relatórios: ${err.response?.data?.message || err.message}`);
      setStats({
        total_exames: 0,
        total_value: 0,
        exames_pagos: 0,
        exames_pendentes: 0,
        valor_pago: 0,
        valor_pendente: 0,
        exames_ultimos_30_dias: 0,
        valor_ultimos_30_dias: 0,
        by_type: {},
        by_payment_type: {},
        by_clinic: {},
      });
      setExames([]);
      setLoading(false);
      toast.error('Falha ao carregar relatórios.');
    }
  }, [fetchAllExames]);

  // Initial data fetch
  useEffect(() => {
    fetchTiposPagamento();
  }, [fetchTiposPagamento]);

  // Modal body scroll lock
  useEffect(() => {
    if (isPaymentModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPaymentModalOpen]);

  // Select all checkbox state management
  useEffect(() => {
    if (selectAllRef.current) {
      const nonPaidExams = currentExams.filter((exame) => !exame.pago);
      const selectedNonPaidExams = nonPaidExams.filter((exame) => selectedExams.includes(exame.id));

      selectAllRef.current.checked = selectedNonPaidExams.length === nonPaidExams.length && nonPaidExams.length > 0;
      selectAllRef.current.indeterminate = selectedNonPaidExams.length > 0 && selectedNonPaidExams.length < nonPaidExams.length;
    }
  }, [selectedExams, currentExams]);

  // Memoized event handlers
  const onSubmit = useCallback((data) => {
    console.log('[onSubmit] Dados brutos do formulário:', data);
    const filters = {
      start_date: data?.dataInicio ? data.dataInicio : undefined,
      end_date: data?.dataFim ? data.dataFim : undefined,
      tipo_pagamento_id: data?.tipoPagamento ? parseInt(data.tipoPagamento) : undefined,
      clinic_name: data?.clinica ? data.clinica.trim() : undefined,
      pago: data?.pago !== '' ? data.pago : undefined,
    };

    if (filters.start_date && filters.end_date) {
      const startDate = new Date(filters.start_date);
      const endDate = new Date(filters.end_date);
      endDate.setHours(23, 59, 59, 999);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        toast.error('Datas inválidas. Por favor, selecione datas válidas.');
        return;
      }
      if (endDate < startDate) {
        toast.error('Data de fim não pode ser anterior à data de início.');
        return;
      }
    }

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
    );
    console.log('[onSubmit] Filtros limpos:', cleanedFilters);
    setActiveFilters(cleanedFilters);
    fetchRelatorios(cleanedFilters);
  }, [fetchRelatorios]);

  const handleRefresh = useCallback(() => {
    reset({
      dataInicio: '',
      dataFim: '',
      tipoPagamento: '',
      clinica: '',
      pago: '',
    });
    setActiveFilters({});
    setExames([]);
    setStats({
      total_exames: 0,
      total_value: 0,
      exames_pagos: 0,
      exames_pendentes: 0,
      valor_pago: 0,
      valor_pendente: 0,
      exames_ultimos_30_dias: 0,
      valor_ultimos_30_dias: 0,
      by_type: {},
      by_payment_type: {},
      by_clinic: {},
    });
    setSelectedExams([]);
    setCurrentPage(1);
    setClinics([]); // ALTERAÇÃO: Limpar clínicas para permitir recarregamento
    setClinicsLoaded(false); // ALTERAÇÃO: Resetar controle de carregamento
    toast.info('Filtros limpos!');
  }, [reset]);

  const handleSelectExam = useCallback((id) => {
    const exame = exames.find((e) => e.id === id);
    if (exame?.pago) return;
    setSelectedExams((prev) =>
      prev.includes(id) ? prev.filter((examId) => examId !== id) : [...prev, id]
    );
  }, [exames]);

  const handleSelectAll = useCallback(() => {
    const nonPaidExamsIds = currentExams
      .filter((exame) => !exame.pago)
      .map((exame) => exame.id);
    const allSelected = nonPaidExamsIds.every((id) => selectedExams.includes(id));

    if (allSelected) {
      setSelectedExams((prev) => prev.filter((id) => !nonPaidExamsIds.includes(id)));
    } else {
      setSelectedExams((prev) => [...new Set([...prev, ...nonPaidExamsIds])]);
    }
  }, [currentExams, selectedExams]);

  const handleKeyDown = useCallback((e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectExam(id);
    }
  }, [handleSelectExam]);

  const handleMarkAsPaid = useCallback(async (data) => {
    setPaymentLoading(true);
    try {
      const examesToUpdate = selectedExams.map((exameId) => {
        const exame = exames.find((e) => e.id === exameId);
        return {
          id: parseInt(exameId, 10),
          pago: true,
          tipo_pagamento_id: exame?.tipo_pagamento_id || null,
          observacaoPagamento: data.observacao || '',
        };
      });

      const invalidExams = examesToUpdate.filter((exame) => !exame.tipo_pagamento_id);
      if (invalidExams.length > 0) {
        toast.error('Alguns exames selecionados não possuem tipo de pagamento definido.');
        setPaymentLoading(false);
        return;
      }

      const response = await api.post('/api/exames/marcar-pagamentos', {
        exames: examesToUpdate,
      });

      setSelectedExams([]);
      await fetchRelatorios(activeFilters);
      setIsPaymentModalOpen(false);
      toast.success(response.data?.message || 'Exames marcados como pagos com sucesso!');
    } catch (error) {
      console.error('[handleMarkAsPaid] Erro:', error);
      toast.error(error.response?.data?.errors?.[0]?.msg || 'Erro ao marcar exames como pagos.');
    } finally {
      setPaymentLoading(false);
    }
  }, [selectedExams, exames, fetchRelatorios, activeFilters]);

  const handleExport = useCallback(async (format) => {
  if (format === 'pdf') {
    try {
      if (!pdfTableRef.current || !statContainerRef.current) {
        toast.error('Elementos não encontrados para o PDF.');
        return;
      }

      toast.info('Gerando PDF... Isso pode levar alguns instantes.');

      // Dynamically import heavy libraries
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - 2 * margin;

      const addHeader = (document, yPosition) => {
        document.setFontSize(16);
        // ALTERAÇÃO: Adicionar nome da clínica se estiver presente nos filtros
        const headerText = activeFilters.clinic_name
          ? `Relatório de Exames - ${activeFilters.clinic_name}`
          : 'Relatório de Exames';
        document.text(headerText, margin, yPosition);
        return yPosition + 10;
      };

      let position = 15;
      position = addHeader(doc, position);

      const statsCanvas = await html2canvas(statContainerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const statsImgData = statsCanvas.toDataURL('image/jpeg', 0.8);
      const statsImgWidth = contentWidth;
      const statsImgHeight = (statsCanvas.height * statsImgWidth) / statsCanvas.width;

      doc.addImage(statsImgData, 'JPEG', margin, position, statsImgWidth, statsImgHeight);
      position += statsImgHeight + 10;

      const tableCanvas = await html2canvas(pdfTableRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const tableImgWidth = contentWidth;
      const tableImgHeight = (tableCanvas.height * tableImgWidth) / tableCanvas.width;

      let remainingHeight = tableCanvas.height;
      let renderedHeight = 0;

      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = tableCanvas.width;

      const pixelPerMM = tableCanvas.height / tableImgHeight;
      let availablePageHeightMM = pageHeight - position - margin;
      let availablePageHeightPx = availablePageHeightMM * pixelPerMM;

      while (remainingHeight > 0) {
        if (availablePageHeightPx > remainingHeight) {
          availablePageHeightPx = remainingHeight;
        }

        pageCanvas.height = availablePageHeightPx;
        pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          tableCanvas,
          0,
          renderedHeight,
          tableCanvas.width,
          availablePageHeightPx,
          0,
          0,
          tableCanvas.width,
          availablePageHeightPx
        );

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 1);
        const pageImgHeightMM = availablePageHeightPx / pixelPerMM;

        doc.addImage(pageImgData, 'JPEG', margin, position, tableImgWidth, pageImgHeightMM);

        renderedHeight += availablePageHeightPx;
        remainingHeight -= availablePageHeightPx;

        if (remainingHeight > 0) {
          doc.addPage();
          position = addHeader(doc, 15);
          availablePageHeightMM = pageHeight - position - margin;
          availablePageHeightPx = availablePageHeightMM * pixelPerMM;
        }
      }

      doc.save(`relatorio_exames_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Relatório exportado como PDF!');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      toast.error('Erro ao exportar relatório como PDF.');
    }
  }
}, [activeFilters.clinic_name]); // ALTERAÇÃO: Adicionar activeFilters.clinic_name como dependência

  const getTipoPagamentoNome = useCallback((exame) => {
    if (exame?.TipoPagamento?.nome) {
      return exame.TipoPagamento.nome;
    }
    if (exame?.tipo_pagamento_id && tiposPagamento.length > 0) {
      const tipo = tiposPagamento.find((tp) => tp.id === exame.tipo_pagamento_id);
      return tipo?.nome || 'Pendente';
    }
    return 'Nenhum';
  }, [tiposPagamento]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  if (!activeFilters.start_date && !activeFilters.end_date && exames.length === 0) {
    return (
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaChartBar />
            <h1>Relatórios Financeiros</h1>
          </TitleContent>
        </TitleContainer>
        <Card>
          <FilterSection>
            <FilterForm onSubmit={handleSubmit(onSubmit)}>
              <FilterGroup>
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  {...register('dataInicio')}
                  type="date"
                  aria-label="Data de início"
                  title="Selecione a data de início"
                />
              </FilterGroup>
              <FilterGroup>
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  {...register('dataFim')}
                  type="date"
                  aria-label="Data de fim"
                  title="Selecione a data de fim"
                />
              </FilterGroup>
              <FilterGroup>
                <Label htmlFor="tipoPagamento">Tipo de Pagamento</Label>
                <Select id="tipoPagamento" {...register('tipoPagamento')} aria-label="Filtrar por tipo de pagamento">
                  <option value="">Todos os tipos</option>
                  {tiposPagamento.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </Select>
              </FilterGroup>
              {user?.role === 'Admin' && (
                <FilterGroup>
                  <Label htmlFor="clinica">Clínica</Label>
                  <Select
                    id="clinica"
                    {...register('clinica')}
                    aria-label="Filtrar por clínica"
                    title="Selecione uma clínica"
                    onFocus={fetchClinicas} // ALTERAÇÃO: Carregar clínicas ao focar no campo
                  >
                    <option value="">Todas as clínicas</option>
                    {clinics.map((clinic) => (
                      <option key={clinic} value={clinic}>
                        {clinic}
                      </option>
                    ))}
                  </Select>
                </FilterGroup>
              )}
              <FilterGroup>
                <Label htmlFor="pago">Status de Pagamento</Label>
                <Select id="pago" {...register('pago')} aria-label="Filtrar por status de pagamento">
                  <option value="">Todos os status</option>
                  <option value="true">Pagos</option>
                  <option value="false">Não Pagos</option>
                </Select>
              </FilterGroup>
            </FilterForm>
            <ActionsContainer>
              <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={loading} title="Filtrar">
                <FaFilter /> Filtrar
              </Button>
              <Button
                secondary
                onClick={handleRefresh}
                disabled={loading}
                title="Limpar todos os filtros"
              >
                <FaRedo /> Limpar
              </Button>
            </ActionsContainer>
          </FilterSection>
          <p style={{ fontFamily: FONTS.body, color: COLORS.textSoftBlack, textAlign: 'center', marginTop: '16px' }}>
            Aplique os filtros para visualizar os exames.
          </p>
        </Card>
      </Layout>
    );
  }

  if (loading && exames.length === 0) {
    return (
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaChartBar />
            <h1>Relatórios Financeiros</h1>
          </TitleContent>
        </TitleContainer>
        <LoadingMessage>Carregando...</LoadingMessage>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaChartBar />
            <h1>Relatórios Financeiros</h1>
          </TitleContent>
        </TitleContainer>
        <Card tight>
          <p style={{ color: 'red', fontFamily: FONTS.body }}>{error}</p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout onRefresh={handleRefresh}>
      <TitleContainer>
        <TitleContent>
          <FaChartBar />
          <h1>Relatórios Financeiros</h1>
        </TitleContent>
      </TitleContainer>

      <Card>
        <FilterSection>
          <FilterForm onSubmit={handleSubmit(onSubmit)}>
            <FilterGroup>
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                {...register('dataInicio')}
                type="date"
                aria-label="Data de início"
                title="Selecione a data de início"
              />
            </FilterGroup>
            <FilterGroup>
              <Label htmlFor="dataFim">Data de Fim</Label>
              <Input
                id="dataFim"
                {...register('dataFim')}
                type="date"
                aria-label="Data de fim"
                title="Selecione a data de fim"
              />
            </FilterGroup>
            <FilterGroup>
              <Label htmlFor="tipoPagamento">Tipo de Pagamento</Label>
              <Select id="tipoPagamento" {...register('tipoPagamento')} aria-label="Filtrar por tipo de pagamento">
                <option value="">Todos os tipos</option>
                {tiposPagamento.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </Select>
            </FilterGroup>
            {user?.role === 'Admin' && (
              <FilterGroup>
                <Label htmlFor="clinica">Clínica</Label>
                <Select
                  id="clinica"
                  {...register('clinica')}
                  aria-label="Filtrar por clínica"
                  title="Selecione uma clínica"
                  onFocus={fetchClinicas} // ALTERAÇÃO: Carregar clínicas ao focar no campo
                >
                  <option value="">Todas as clínicas</option>
                  {clinics.map((clinic) => (
                    <option key={clinic} value={clinic}>
                      {clinic}
                    </option>
                  ))}
                </Select>
              </FilterGroup>
            )}
            <FilterGroup>
              <Label htmlFor="pago">Status de Pagamento</Label>
              <Select id="pago" {...register('pago')} aria-label="Filtrar por status de pagamento">
                <option value="">Todos os status</option>
                <option value="true">Pagos</option>
                <option value="false">Não Pagos</option>
              </Select>
            </FilterGroup>
          </FilterForm>
          {loading && <LoadingMessage>Carregando estatísticas...</LoadingMessage>}
          <ActionsContainer>
            <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={loading} title="Filtrar">
              <FaFilter /> Filtrar
            </Button>
            <Button
              secondary
              onClick={handleRefresh}
              disabled={loading}
              title="Limpar todos os filtros"
            >
              <FaRedo /> Limpar
            </Button>
            {user?.role === 'Admin' && (
              <Button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={selectedExams.length === 0 || loading || paymentLoading}
                title="Marcar exames selecionados como pagos"
              >
                <FaDollarSign /> Marcar como Pago
              </Button>
            )}
            <Button
              onClick={() => handleExport('pdf')}
              disabled={loading || exames.length === 0}
              title="Exportar relatório como PDF"
            >
              <FaDownload /> PDF
            </Button>
            <Button
              onClick={() => handleExport('excel')}
              disabled={loading}
              title="Exportar relatório como Excel"
            >
              <FaDownload /> Excel
            </Button>
          </ActionsContainer>
        </FilterSection>
      </Card>

      <Card>
        <StatContainer ref={statContainerRef} key={JSON.stringify(stats)}>
          <StatCard type="total_exames">
            <ListAlt />
            <StatTitle>Total de Exames</StatTitle>
            <StatValue>{stats.total_exames.toLocaleString('pt-BR')}</StatValue>
          </StatCard>
          <StatCard type="total_value">
            <MonetizationOn />
            <StatTitle>Valor Total</StatTitle>
            <StatValue>{formatCurrency(stats.total_value)}</StatValue>
          </StatCard>
          <StatCard type="exames_pagos">
            <AssignmentTurnedIn />
            <StatTitle>Exames Pagos</StatTitle>
            <StatValue>{stats.exames_pagos.toLocaleString('pt-BR')} ({formatCurrency(stats.valor_pago)})</StatValue>
          </StatCard>
          <StatCard type="exames_pendentes">
            <Warning />
            <StatTitle>Exames Pendentes</StatTitle>
            <StatValue>{stats.exames_pendentes.toLocaleString('pt-BR')} ({formatCurrency(stats.valor_pendente)})</StatValue>
          </StatCard>
        </StatContainer>
      </Card>

      <Card>
        <h3 style={{ fontFamily: FONTS.subtitle, fontWeight: 600, fontSize: '18px', color: COLORS.textSoftBlack, marginBottom: '12px' }}>
          Lista de Exames
        </h3>
        {loading && <LoadingMessage>Atualizando lista de exames...</LoadingMessage>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <TableWrapper>
            <Table ref={tableRef}>
              <thead>
                <tr>
                  <Th><ThContent iconColor="#7AC143"><FaPaw /><span>Nome do Pet</span></ThContent></Th>
                  <Th><ThContent iconColor="#3498db"><FaUser /><span>Tutor</span></ThContent></Th>
                  <Th><ThContent iconColor="#8e44ad"><FaCalendarAlt /><span>Data</span></ThContent></Th>
                  <Th><ThContent iconColor="#3498db"><FaHospital /><span>Clínica</span></ThContent></Th>
                  <Th><ThContent iconColor="#e74c3c"><FaStethoscope /><span>Exame</span></ThContent></Th>
                  <Th><ThContent iconColor="#27ae60"><FaDollarSign /><span>Valor</span></ThContent></Th>
                  <Th><ThContent iconColor="#2ecc71"><FaCheckCircle /><span>Pago</span></ThContent></Th>
                  <Th><ThContent iconColor="#2980b9"><FaMoneyCheckAlt /><span>Tipo de Pagamento</span></ThContent></Th>
                  {user?.role === 'Admin' && (
                    <Th style={{ width: '50px' }}>
                      <Input
                        type="checkbox"
                        ref={selectAllRef}
                        onChange={handleSelectAll}
                        disabled={currentExams.filter((exame) => !exame.pago).length === 0}
                        title="Selecionar todos os exames não pagos da página"
                      />
                    </Th>
                  )}
                </tr>
              </thead>
              <tbody>
                {!loading && currentExams.length > 0 ? (
                  currentExams.map((exame) => (
                    <Tr
                      key={exame.id}
                      className={selectedExams.includes(exame.id) ? 'selected' : ''}
                      onClick={() => handleSelectExam(exame.id)}
                      onKeyDown={(e) => handleKeyDown(e, exame.id)}
                      tabIndex={0}
                      aria-selected={selectedExams.includes(exame.id)}
                      role="checkbox"
                    >
                      <Td className="animal-cell">
                        <span>{exame.animal_name || 'N/A'}</span>
                      </Td>
                      <Td>{exame.tutor || 'N/A'}</Td>
                      <Td>{formatDate(exame.date)}</Td>
                      <Td>{exame.clinic_name || 'N/A'}</Td>
                      <Td>{exame.ExamType?.name || exame.exame_nome || 'N/A'}</Td>
                      <Td>{formatCurrency(exame.value)}</Td>
                      <Td style={{ color: exame.pago ? '#7AC143' : '#e74c3c' }}>
                        {exame.pago ? 'Sim' : 'Não'}
                      </Td>
                      <Td>
                        <PaymentTypeBadge type={getTipoPagamentoNome(exame)}>
                          {getTipoPagamentoNome(exame)}
                        </PaymentTypeBadge>
                      </Td>
                      {user?.role === 'Admin' && (
                        <Td style={{ width: '50px' }}>
                          <Input
                            type="checkbox"
                            checked={selectedExams.includes(exame.id)}
                            onChange={() => handleSelectExam(exame.id)}
                            disabled={exame.pago}
                            title={exame.pago ? 'Exame já pago' : 'Selecionar exame'}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Td>
                      )}
                    </Tr>
                  ))
                ) : (
                  !loading && (
                    <Tr>
                      <Td colSpan={user?.role === 'Admin' ? 9 : 8} style={{ textAlign: 'center', fontFamily: FONTS.body, color: COLORS.textSoftBlack, opacity: 0.7 }}>
                        Nenhum exame encontrado com os filtros aplicados.
                      </Td>
                    </Tr>
                  )
                )}
              </tbody>
            </Table>
          </TableWrapper>
          {totalPages > 1 && (
            <PaginationContainer>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Página anterior"
              >
                Anterior
              </Button>
              <span style={{ fontFamily: FONTS.body, margin: '0 16px' }}>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Próxima página"
              >
                Próxima
              </Button>
            </PaginationContainer>
          )}
        </div>
      </Card>

      <HiddenTableWrapper>
        <Card>
          <StatContainer>
            <StatCard type="total_exames">
              <StatTitle>Total de Exames</StatTitle>
              <StatValue>{stats.total_exames}</StatValue>
            </StatCard>
            <StatCard type="total_value">
              <StatTitle>Valor Total</StatTitle>
              <StatValue>R$ {Number(stats.total_value).toFixed(2)}</StatValue>
            </StatCard>
            <StatCard type="exames_pagos">
              <StatTitle>Exames Pagos</StatTitle>
              <StatValue>{stats.exames_pagos} (R$ {Number(stats.valor_pago).toFixed(2)})</StatValue>
            </StatCard>
            <StatCard type="exames_pendentes">
              <StatTitle>Exames Pendentes</StatTitle>
              <StatValue>{stats.exames_pendentes} (R$ {Number(stats.valor_pendente).toFixed(2)})</StatValue>
            </StatCard>
          </StatContainer>
          <Table ref={pdfTableRef}>
            <thead>
              <tr>
                <Th><ThContent iconColor="#7AC143"><FaPaw /><span>Nome do Pet</span></ThContent></Th>
                <Th><ThContent iconColor="#3498db"><FaUser /><span>Tutor</span></ThContent></Th>
                <Th><ThContent iconColor="#8e44ad"><FaCalendarAlt /><span>Data</span></ThContent></Th>
                <Th><ThContent iconColor="#2c3e50"><FaHospital /><span>Clínica</span></ThContent></Th>
                <Th><ThContent iconColor="#e74c3c"><FaStethoscope /><span>Exame</span></ThContent></Th>
                <Th><ThContent iconColor="#27ae60"><FaDollarSign /><span>Valor</span></ThContent></Th>
                <Th><ThContent iconColor="#2ecc71"><FaCheckCircle /><span>Pago</span></ThContent></Th>
                <Th><ThContent iconColor="#2980b9"><FaMoneyCheckAlt /><span>Tipo de Pagamento</span></ThContent></Th>
              </tr>
            </thead>
            <tbody>
              {exames.length > 0 ? (
                exames.map((exame) => (
                  <Tr key={`pdf-${exame.id}`}>
                    <Td className="exame-cell">
                      <span>{exame.animal_name || 'N/A'}</span>
                    </Td>
                    <Td>{exame.tutor || 'N/A'}</Td>
                    <Td>{formatDate(exame.date)}</Td>
                    <Td>{exame.clinic_name || 'N/A'}</Td>
                    <Td>{exame.ExamType?.name || exame.exame_nome || 'N/A'}</Td>
                    <Td>R$ {typeof exame.value === 'number' ? exame.value.toFixed(2) : '0.00'}</Td>
                    <Td>{exame.pago ? 'Sim' : 'Não'}</Td>
                    <Td>{getTipoPagamentoNome(exame)}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="8">Nenhum exame encontrado.</Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </Card>
      </HiddenTableWrapper>

      {isPaymentModalOpen && (
        <Suspense fallback={<LoadingMessage>Carregando modal...</LoadingMessage>}>
          <PaymentModal
            open={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onConfirm={handleMarkAsPaid}
            loading={paymentLoading}
            selectedCount={selectedExams.length}
          />
        </Suspense>
      )}
    </Layout>
  );
};

export default Relatorios;
