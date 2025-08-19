// Importa React e hooks para gerenciamento de estado, efeitos, contexto, memoização e carregamento assíncrono
import React, { useEffect, useState, useContext, useMemo, Suspense } from 'react';

// Importa componentes do Material-UI para layout, tipografia, botões, tabelas, formulários e responsividade
import {
  Grid, Card, Typography, Box, Stack, Fab, Tabs, Tab, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Button, GlobalStyles, useMediaQuery, ThemeProvider, createTheme, Container
} from '@mui/material';

// Importa componentes de gráficos de barra e rosca da biblioteca react-chartjs-2
import { Bar, Doughnut } from 'react-chartjs-2';

// Importa elementos e plugins do Chart.js para renderização de gráficos
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Importa biblioteca react-toastify para exibir notificações
import { toast, ToastContainer } from 'react-toastify';

// Importa estilos CSS do react-toastify
import 'react-toastify/dist/ReactToastify.css';

// Importa ícones do Material-UI para uso nos componentes
import { MonetizationOn, WarningAmberRounded as Warning, Refresh, AssignmentTurnedIn, ListAlt, RestartAlt, Payment, LocalHospital, PieChart, TrendingUp, Analytics } from '@mui/icons-material';

// Importa biblioteca framer-motion para animações
import { motion } from 'framer-motion';

// Importa tinycolor2 para manipulação de cores e verificação de contraste
import tinycolor from 'tinycolor2';

// Importa serviço de API personalizado para requisições HTTP
import api from '../../services/api';

// Importa componente de layout personalizado
import Layout from '../layout/Layout';

// Importa contexto de autenticação para acessar informações do usuário
import { AuthContext } from '../../contexts/AuthContext';

// Registra os elementos e plugins necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Define paleta de cores premium e moderna
const COLORS = {
  // Cores primárias com gradientes mais sofisticados
  primaryRoyalBlue: '#1E40AF', // Azul mais profundo e elegante
  primaryAquaGreen: '#059669', // Verde mais refinado
  secondaryGoldenYellow: '#D97706', // Amarelo mais elegante
  secondaryOrange: '#EA580C', // Laranja mais vibrante
  secondaryPurple: '#7C3AED', // Roxo mais sofisticado
  secondaryred: '#DC2626', // Vermelho mais elegante
  
  // Cores de fundo premium
  backgroundPrimary: '#F8FAFC', // Fundo principal mais suave
  backgroundSecondary: '#F1F5F9', // Fundo secundário
  backgroundCard: '#FFFFFF', // Fundo dos cards
  
  // Cores de texto refinadas
  textPrimary: '#0F172A', // Texto principal mais escuro
  textSecondary: '#475569', // Texto secundário
  textMuted: '#94A3B8', // Texto esmaecido
  textWhite: '#FFFFFF', // Texto branco
  
  // Cores das clínicas com tons mais premium
  clinicVetVida: '#EC4899', // Rosa elegante
  clinicAgroPet: '#3B82F6', // Azul moderno
  clinicVixenVet: '#10B981', // Verde esmeralda
  clinicDraBicho: '#F59E0B', // Dourado
  
  // Cores de destaque premium
  accent: '#6366F1', // Índigo moderno
  success: '#10B981', // Verde sucesso
  warning: '#F59E0B', // Amarelo aviso
  error: '#EF4444', // Vermelho erro
  
  // Gradientes premium
  gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradientSuccess: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  gradientWarning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
};

// Define tipografia premium
const FONTS = {
  primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  secondary: '"Montserrat", sans-serif',
  numeric: '"JetBrains Mono", "Roboto Mono", monospace',
  heading: '"Poppins", sans-serif',
};

// Define escala tipográfica premium
const TYPOGRAPHY_SCALE = {
  h1: { 
    fontSize: '2.5rem', 
    fontWeight: 700, 
    lineHeight: 1.2, 
    fontFamily: FONTS.heading,
    letterSpacing: '-0.025em'
  },
  h2: { 
    fontSize: '2rem', 
    fontWeight: 600, 
    lineHeight: 1.3, 
    fontFamily: FONTS.heading,
    letterSpacing: '-0.02em'
  },
  h3: { 
    fontSize: '1.5rem', 
    fontWeight: 600, 
    lineHeight: 1.4, 
    fontFamily: FONTS.heading,
    letterSpacing: '-0.015em'
  },
  body: { 
    fontSize: '1rem', 
    fontWeight: 400, 
    lineHeight: 1.6, 
    fontFamily: FONTS.primary 
  },
  bodyLarge: { 
    fontSize: '1.125rem', 
    fontWeight: 400, 
    lineHeight: 1.6, 
    fontFamily: FONTS.primary 
  },
  numeric: { 
    fontSize: '1.5rem', 
    fontWeight: 600, 
    lineHeight: 1.4, 
    fontFamily: FONTS.numeric 
  },
  caption: { 
    fontSize: '0.875rem', 
    fontWeight: 500, 
    lineHeight: 1.5, 
    fontFamily: FONTS.primary,
    color: COLORS.textSecondary
  },
};

// Define estilos premium para componentes
const STYLES = {
  cardBorderRadius: '16px',
  cardBoxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  cardBoxShadowHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  buttonBorderRadius: '12px',
  containerMaxWidth: '1400px',
  spacing: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6
  }
};

// Função para verificar contraste de acessibilidade
const checkContrast = (foreground, background) => {
  return tinycolor.isReadable(foreground, background, { level: 'AA', size: 'small' })
    ? foreground
    : tinycolor(foreground).darken(20).toString();
};

// Função para escurecer cor
const darken = (color, amount) => tinycolor(color).darken(amount * 100).toString();

// Função para clarear cor
const lighten = (color, amount) => tinycolor(color).lighten(amount * 100).toString();

// Define tema premium do Material-UI
const theme = createTheme({
  palette: {
    primary: { main: COLORS.primaryRoyalBlue },
    secondary: { main: COLORS.accent },
    background: {
      default: COLORS.backgroundPrimary,
      paper: COLORS.backgroundCard,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
  },
  typography: {
    fontFamily: FONTS.primary,
    h1: TYPOGRAPHY_SCALE.h1,
    h2: TYPOGRAPHY_SCALE.h2,
    h3: TYPOGRAPHY_SCALE.h3,
    body1: TYPOGRAPHY_SCALE.body,
    body2: TYPOGRAPHY_SCALE.caption,
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  breakpoints: {
    values: {
      xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536,
    },
  },
});

// Configurações globais premium do ChartJS
ChartJS.defaults.font.family = FONTS.primary;
ChartJS.defaults.color = COLORS.textSecondary;
ChartJS.defaults.plugins.legend.labels.boxWidth = 12;
ChartJS.defaults.plugins.legend.labels.padding = 16;
ChartJS.defaults.plugins.legend.position = 'bottom';
ChartJS.defaults.animation.duration = 800;
ChartJS.defaults.animation.easing = 'easeInOutQuart';

// Define paleta premium para gráficos
const chartPalette = [
  COLORS.clinicVetVida,
  COLORS.clinicAgroPet,
  COLORS.clinicVixenVet,
  COLORS.clinicDraBicho,
];

// Cria versão com gradiente da paleta
const chartPaletteGradient = chartPalette.map(color =>
  `linear-gradient(135deg, ${color} 0%, ${lighten(color, 0.2)} 100%)`
);

// Componente premium para métricas em forma de cartão
const MetricCard = ({ title, value, icon, cardBackgroundColor, ariaLabel, trend, trendValue }) => (
  <Grid item xs={12} sm={6} lg={3}>
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: Math.random() * 0.2 
      }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
    >
      <Card
        sx={{
          background: `linear-gradient(135deg, ${cardBackgroundColor} 0%, ${lighten(cardBackgroundColor, 0.1)} 50%, ${lighten(cardBackgroundColor, 0.2)} 100%)`,
          color: COLORS.textWhite,
          borderRadius: STYLES.cardBorderRadius,
          boxShadow: STYLES.cardBoxShadow,
          p: { xs: 3, sm: 4 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            boxShadow: STYLES.cardBoxShadowHover,
            transform: 'translateY(-4px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, transparent 0%, ${tinycolor(cardBackgroundColor).setAlpha(0.1).toRgbString()} 100%)`,
            pointerEvents: 'none',
          }
        }}
        aria-label={ariaLabel}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon, {
                sx: {
                  color: COLORS.textWhite,
                  fontSize: '1.75rem',
                },
              })}
            </Box>
            {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <TrendingUp 
                  sx={{ 
                    fontSize: '1rem', 
                    color: trend === 'up' ? COLORS.success : COLORS.error 
                  }} 
                />
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: COLORS.textWhite,
                    opacity: 0.9,
                  }}
                >
                  {trendValue}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Typography
            sx={{
              ...TYPOGRAPHY_SCALE.caption,
              color: COLORS.textWhite,
              opacity: 0.9,
              mb: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              ...TYPOGRAPHY_SCALE.numeric,
              color: COLORS.textWhite,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Card>
    </motion.div>
  </Grid>
);

// Componente premium de gráfico Doughnut
const DoughnutChart = ({ title, icon, data, height = 320, ariaLabel, chartId }) => {
  const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
  const percentage = total > 0 ? ((data.datasets[0].data[0] / total) * 100).toFixed(0) : '0';

  return (
    <Card
      sx={{
        height,
        borderRadius: STYLES.cardBorderRadius,
        boxShadow: STYLES.cardBoxShadow,
        p: 3,
        background: COLORS.backgroundCard,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: STYLES.cardBoxShadowHover,
          transform: 'translateY(-2px)',
        },
      }}
      aria-label={ariaLabel}
      aria-describedby={`chart-description-${chartId}`}
    >
      <Typography id={`chart-description-${chartId}`} sx={{ display: 'none' }}>
        {ariaLabel}
      </Typography>
      
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: '12px',
            backgroundColor: `${COLORS.accent}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon, { 
            sx: { 
              fontSize: '1.5rem', 
              color: COLORS.accent 
            } 
          })}
        </Box>
        <Box>
          <Typography
            sx={{
              ...TYPOGRAPHY_SCALE.h3,
              fontSize: '1.25rem',
              color: COLORS.textPrimary,
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              ...TYPOGRAPHY_SCALE.caption,
              color: COLORS.textMuted,
            }}
          >
            Distribuição por clínica
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: 'calc(100% - 100px)'
      }}>
        <Suspense
          fallback={
            <Skeleton
              variant="circular"
              animation="wave"
              width={200}
              height={200}
              sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}
            />
          }
        >
          <Doughnut
            data={{
              ...data,
              datasets: data.datasets.map(dataset => ({
                ...dataset,
                backgroundColor: chartPalette,
                borderWidth: 0,
                hoverBorderWidth: 3,
                hoverBorderColor: COLORS.textWhite,
              }))
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '65%',
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    font: { 
                      family: FONTS.primary, 
                      size: 12,
                      weight: '500'
                    },
                    color: COLORS.textSecondary,
                    boxWidth: 12,
                    boxHeight: 12,
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                  },
                },
                tooltip: {
                  titleFont: { 
                    family: FONTS.primary, 
                    weight: '600', 
                    size: 14 
                  },
                  bodyFont: { 
                    family: FONTS.primary, 
                    size: 13 
                  },
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  titleColor: COLORS.textWhite,
                  bodyColor: COLORS.textWhite,
                  borderColor: COLORS.accent,
                  borderWidth: 1,
                  cornerRadius: 8,
                  displayColors: true,
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.parsed;
                      const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                      return `${label}: ${new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(value)} (${percentage}%)`;
                    },
                  },
                },
              },
              elements: {
                arc: { 
                  borderWidth: 0,
                  hoverBorderWidth: 2,
                  hoverBorderColor: COLORS.textWhite,
                },
              },
              animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000,
                easing: 'easeInOutQuart',
              },
            }}
          />
        </Suspense>
      </Box>
    </Card>
  );
};
// Cria versão suave (com opacidade) da paleta
const chartPaletteSoft = chartPalette.map(color =>
  tinycolor(color).setAlpha(0.7).toRgbString() // Aplica 70% de opacidade para cada cor da paleta
);
// Componente principal do dashboard
const Dashboard = () => {
  // Obtém informações do usuário do contexto de autenticação
  const { user } = useContext(AuthContext);
  // Define estado para armazenar dados estatísticos
  const [stats, setStats] = useState(null);
  // Define estado para indicar carregamento
  const [loading, setLoading] = useState(true);
  // Define estado para erros
  const [error, setError] = useState(null);
  // Define estado para controle de abas
  const [tabValue, setTabValue] = useState(0);
  // Define estado para filtro de mês
const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  // Define estado para filtro de ano (ano atual por padrão)
  const [year, setYear] = useState(String(new Date().getFullYear()));
  // Define estado para filtro de tipo de pagamento
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  // Verifica se a tela é menor que 768px (mobile)
  const isMobile = useMediaQuery('(max-width:768px)');
  // Verifica se a tela é menor que 900px (tela média)
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  // Define altura do gráfico com base no tamanho da tela
  const chartHeight = isMobile ? 200 : isMediumScreen ? 300 : 350;

  // Memoiza opções de meses para evitar recálculo desnecessário
  const monthOptions = useMemo(() => [
    { value: 'all', label: 'Todos os Meses' }, // Adiciona opção para todos os meses
    ...Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1).padStart(2, '0'), // Formata o valor do mês com dois dígitos
      label: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }) // Obtém nome do mês em português
    }))
  ], []);

  // Memoiza opções de anos para evitar recálculo
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear(); // Obtém o ano atual
    const options = [{ value: 'all', label: 'Todos os Anos' }]; // Adiciona opção para todos os anos
    for (let i = currentYear; i >= currentYear - 5; i--) { // Gera opções para os últimos 5 anos
      options.push({ value: String(i), label: String(i) });
    }
    return options; // Retorna as opções de anos
  }, []);

  // Memoiza opções de tipos de pagamento
  const paymentTypeOptions = useMemo(() => [
    { value: 'all', label: 'Todas' }, // Adiciona opção para todos os tipos
    ...(stats?.by_payment_type ? Object.keys(stats.by_payment_type).map(label => ({ value: label, label })) : []) // Gera opções com base nos tipos de pagamento disponíveis
  ], [stats]);

  // Memoiza dados filtrados das clínicas
  const filteredClinicData = useMemo(() => {
    if (!stats?.by_clinic || paymentTypeFilter === 'all') { // Se não houver dados ou filtro for 'all'
      const clinicLabels = Object.keys(stats?.by_clinic || {}); // Obtém rótulos das clínicas
      const clinicPendingValues = clinicLabels.map(label => stats.by_clinic[label]?.valor_pendente || 0); // Obtém valores pendentes
      return { labels: clinicLabels, pendingValues: clinicPendingValues }; // Retorna rótulos e valores
    }

    const filteredLabels = []; // Inicializa array de rótulos filtrados
    const filteredPendingValues = []; // Inicializa array de valores pendentes filtrados

    Object.keys(stats.by_clinic).forEach((clinica) => {
      // Itera sobre as clínicas
      const clinicInfo = stats.by_clinic[clinica]; // Obtém informações da clínica
      const pendingValue = clinicInfo?.by_payment_type?.[paymentTypeFilter]?.pending_value || 0; // Obtém valor pendente para o tipo de pagamento
      if (pendingValue > 0) { // Adiciona apenas se o valor for maior que 0
        filteredLabels.push(clinica); // Adiciona rótulo
        filteredPendingValues.push(pendingValue); // Adiciona valor
      }
    });

    return { labels: filteredLabels, pendingValues: filteredPendingValues }; // Retorna dados filtrados
  }, [stats, paymentTypeFilter]);

  // Função para buscar dados estatísticos da API
  const fetchStats = async () => {
    try {
      setLoading(true); // Define estado de carregamento como verdadeiro
      setError(null); // Limpa erros anteriores
      const params = new URLSearchParams(); // Cria objeto para parâmetros de URL
      if (year !== 'all') { // Se o ano não for 'all'
        if (month !== 'all') { // Se o mês não for 'all'
          params.append('month', `${year}-${month}`); // Adiciona parâmetro de mês e ano
        }
      }
      const response = await api.get(`/api/relatorios/financeiros?${params.toString()}`); // Faz requisição à API
      setStats(response.data); // Armazena dados recebidos no estado
      setLoading(false); // Define carregamento como concluído
    } catch (err) {
      console.error('Erro ao buscar dados:', err); // Loga o erro no console
      setError('Falha ao carregar os dados do dashboard.'); // Define mensagem de erro
      setLoading(false); // Define carregamento como concluído
      toast.error('Falha ao carregar os dados do dashboard!'); // Exibe notificação de erro
    }
  };

  // Hook para executar fetchStats quando mês ou ano mudam
  useEffect(() => {
    fetchStats();
  }, [month, year]);

  // Função para atualizar o dashboard
  const handleRefresh = () => {
    fetchStats(); // Chama função para buscar dados
    toast.info('Dashboard atualizado!'); // Exibe notificação de atualização
  };

  // Atualiza o valor da aba selecionada
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // Função para alterar o filtro de mês
  const handleMonthChange = (event) => {
    const newMonth = event.target.value; // Obtém novo valor do mês
    setMonth(newMonth); // Atualiza estado do mês
    if (newMonth !== 'all' && year === 'all') { // Se mês não for 'all' e ano for 'all'
      setYear(String(new Date().getFullYear())); // Define ano atual
    }
  };

  // Função para alterar o filtro de ano
  const handleYearChange = (event) => {
    setYear(event.target.value); // Atualiza estado do ano
  };

  // Função para alterar o filtro de tipo de pagamento
  const handlePaymentTypeChange = (event) => {
    setPaymentTypeFilter(event.target.value); // Atualiza estado do tipo de pagamento
  };

  // Função para redefinir filtros
  const resetFilters = () => {
    setMonth('all'); // Reseta mês para 'all'
    setYear(String(new Date().getFullYear())); // Reseta ano para o atual
    setPaymentTypeFilter('all'); // Reseta tipo de pagamento para 'all'
  };

  // Função para gerar dados para gráficos de barra
  const getBarChartData = (labels, values, label) => ({
    labels, // Define rótulos
    datasets: [{
      label, // Define título do dataset
      data: values, // Define valores
      backgroundColor: chartPaletteSoft, // Define cores suaves para barras
      borderColor: chartPalette, // Define cores de borda
      borderWidth: 1.5, // Define espessura da borda
      borderRadius: 8, // Define raio de borda das barras
      barThickness: 'flex', // Define espessura flexível das barras
      maxBarThickness: 50, // Define espessura máxima das barras
    }],
  });

  // Memoiza função para gerar dados para gráficos de rosca
  const getDoughnutChartData = useMemo(() => (labels, values) => ({
    labels, // Define rótulos
    datasets: [{
      data: values, // Define valores
      backgroundColor: chartPalette, // Define cores para os arcos
      borderWidth: 0, // Remove bordas dos arcos
      hoverOffset: 8, // Define deslocamento no hover
    }],
  }), []);

  // Memoiza rótulo do período selecionado
  const periodLabel = useMemo(() => {
    if (month === 'all' && year === 'all') return 'Todos os Períodos'; // Retorna 'Todos os Períodos' se ambos forem 'all'
    if (month === 'all' && year !== 'all') return `Ano de ${year}`; // Retorna ano específico se mês for 'all'
    if (month !== 'all' && year !== 'all') { // Se mês e ano forem específicos
      try {
        const y = parseInt(year); // Converte ano para número
        const m = parseInt(month) - 1; // Converte mês para índice (0-11)
        if (isNaN(y) || isNaN(m)) return `Período Selecionado`; // Retorna mensagem genérica se inválido
        return new Date(y, m).toLocaleString('pt-BR', { month: 'long', year: 'numeric' }); // Formata mês e ano em português
      } catch (e) { return 'Período Inválido'; } // Retorna mensagem de erro se formatação falhar
    }
    if (month !== 'all' && year === 'all') { // Se mês for específico e ano for 'all'
      const m = parseInt(month) - 1; // Converte mês para índice
      if (isNaN(m)) return 'Ano Atual'; // Retorna 'Ano Atual' se mês for inválido
      return `${new Date(0, m).toLocaleString('pt-BR', { month: 'long' })} de Todos os anos`; // Formata mês com todos os anos
    }
    return `Todos os meses de ${year}`; // Retorna todos os meses do ano selecionado
  }, [month, year]);

  // Formata o valor total de faturamento em reais
  const formattedTotalFaturamento = useMemo(
    () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.total_value || 0),
    [stats]
  );

  // Formata o valor pago em reais
  const formattedValorPago = useMemo(
    () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.valor_pago || 0),
    [stats]
  );

  // Formata o valor pendente em reais
  const formattedValorPendente = useMemo(
    () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.valor_pendente || 0),
    [stats]
  );

  // Obtém total de exames ou 0 se não disponível
  const totalExames = stats?.total_exames || 0;

  // Obtém rótulos dos tipos de exames
  const tiposLabels = Object.keys(stats?.by_type || {});

  // Obtém valores dos tipos de exames
  const tiposValues = Object.values(stats?.by_type || {});

  // Obtém dados por tipo de pagamento
  const paymentTypeData = stats?.by_payment_type || {};

  // Obtém rótulos dos tipos de pagamento
  const paymentTypeLabels = Object.keys(paymentTypeData);

  // Obtém valores totais por tipo de pagamento
  const paymentTypeValues = paymentTypeLabels.map(label => paymentTypeData[label]?.value || 0);

  // Obtém valores pendentes por tipo de pagamento
  const paymentPendingValues = paymentTypeLabels.map(label => paymentTypeData[label]?.pending_value || 0);

  // Obtém dados por clínica
  const clinicData = stats?.by_clinic || {};

  // Obtém rótulos das clínicas
  const clinicLabels = Object.keys(clinicData);

  // Obtém valores pendentes por clínica
  const clinicPendingValues = clinicLabels.map(label => clinicData[label]?.valor_pendente || 0);

  // Obtém valores totais por clínica
  const clinicTotalValues = clinicLabels.map(label => clinicData[label]?.total_value || 0);

  // Obtém o maior valor pendente entre as clínicas filtradas
  const maxPendingValue = Math.max(...filteredClinicData.pendingValues, 0);


  // Verifica se o estado de carregamento está ativo
if (loading) {
  return (
    <Layout onRefresh={handleRefresh}>
      {/* Define o layout principal com função de atualização */}
      <Box sx={{ p: { xs: 3, sm: 5 }, background: 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)', minHeight: '100vh' }}>
        {/* Container principal com padding responsivo e gradiente de fundo */}
        <Grid container spacing="32px">
          {/* Grid para exibir esqueletos de carregamento */}
          <Grid item xs={12}>
            {/* Esqueleto para cabeçalho */}
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={120}
              sx={{ borderRadius: STYLES.cardBorderRadius, bgcolor: 'rgba(0, 0, 0, 0.05)' }}
            />
          </Grid>
          <Grid item xs={12} container spacing="32px">
            {/* Grid para exibir esqueletos de cartões de métricas */}
            {[...Array(4)].map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                {/* Esqueleto para cada cartão de métrica */}
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={130}
                  sx={{ borderRadius: STYLES.cardBorderRadius, bgcolor: 'rgba(0, 0, 0, 0.05)' }}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            {/* Esqueleto para seção adicional */}
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={180}
              sx={{ borderRadius: STYLES.cardBorderRadius, bgcolor: 'rgba(0, 0, 0, 0.05)' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Esqueleto para gráfico menor */}
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={250}
              sx={{ borderRadius: STYLES.cardBorderRadius, bgcolor: 'rgba(0, 0, 0, 0.05)' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Esqueleto para gráfico maior */}
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={350}
              sx={{ borderRadius: STYLES.cardBorderRadius, bgcolor: 'rgba(0, 0, 0, 0.05)' }}
            />
          </Grid>
          <Grid item xs={12}>
            {/* Esqueleto para seção de análise detalhada */}
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={400}
              sx={{ borderRadius: STYLES.cardBorderRadius, bgcolor: 'rgba(0, 0, 0, 0.05)' }}
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

// Verifica se há erro no carregamento dos dados
if (error) {
  return (
    <Layout onRefresh={handleRefresh}>
      {/* Define o layout principal com função de atualização */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
        sx={{ p: { xs: 3, sm: 5 }, background: 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)' }}
      >
        {/* Container centralizado para exibir mensagem de erro */}
        <Typography
          color="error"
          sx={{ ...TYPOGRAPHY_SCALE.h2, color: COLORS.textPrimary }}
        >
          {error} {/* Exibe mensagem de erro */}
        </Typography>
        <Button
          variant="contained"
          onClick={handleRefresh}
          sx={{
            mt: 2,
            fontFamily: FONTS.subtitle,
            fontWeight: 500,
            backgroundColor: COLORS.primaryRoyalBlue,
            color: checkContrast(COLORS.textWhite, COLORS.primaryRoyalBlue),
            borderRadius: STYLES.buttonBorderRadius,
            textTransform: 'none',
            fontSize: '1rem',
            px: 3,
            py: 1,
            transition: 'background-color 0.3s ease-in-out',
            '&:hover': { backgroundColor: darken(COLORS.primaryRoyalBlue, 0.1) },
            '&:focus-visible': { outline: `2px solid ${COLORS.primaryRoyalBlue}`, outlineOffset: '2px' },
          }}
          startIcon={<Refresh />}
          aria-label="Tentar novamente"
        >
          Tentar Novamente {/* Botão para tentar recarregar os dados */}
        </Button>
      </Box>
    </Layout>
  );
}

// Renderiza o dashboard principal quando os dados estão disponíveis
return (
  <ThemeProvider theme={theme}>
    {/* Aplica o tema do Material-UI */}
    <Layout onRefresh={handleRefresh}>
      {/* Define o layout principal com função de atualização */}
      <GlobalStyles styles={{ body: { backgroundColor: COLORS.backgroundOffWhite } }} />
      {/* Aplica estilos globais ao corpo da página */}
      <ToastContainer position="top-right" autoClose={3000} aria-live="polite" />
      {/* Configura contêiner para notificações toast */}

      <Box sx={{ py: { xs: 4, sm: 1 }, px: { xs: -1, sm: 3 }, background: 'linear-gradient(to bottom,rgb(249, 252, 248), #FFFFFF)' }}>
        {/* Container principal com padding responsivo e gradiente de fundo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animação para entrada do cartão de cabeçalho */}
          <Card
            sx={{
              mb: 4,
              p: { xs: 2, sm: 3 },
              borderRadius: STYLES.cardBorderRadius,
              boxShadow: STYLES.cardBoxShadow,
              backgroundColor: COLORS.cardBackground,
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'center' }}
              spacing={{ xs: 2, md: 1 }}
            >
              {/* Organiza o título e filtros em uma pilha responsiva */}
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                {/* Container para título e subtítulo */}
                <Typography
                  sx={{
                    ...TYPOGRAPHY_SCALE.h1,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    color: COLORS.textPrimary,
                    letterSpacing: '0.02em',
                  }}
                >
                  Resumo Financeiro {/* Título principal do dashboard */}
                </Typography>
                <Typography
                  sx={{
                    ...TYPOGRAPHY_SCALE.body,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: COLORS.textPrimary,
                    opacity: 0.7,
                    mt: 0.5,
                  }}
                >
                  Período: {periodLabel} {/* Exibe o período selecionado */}
                </Typography>
              </Box>

              <Card
                sx={{
                  p: 2,
                  borderRadius: STYLES.cardBorderRadius,
                  boxShadow: STYLES.cardBoxShadow,
                  backgroundColor: COLORS.backgroundOffWhite,
                }}
              >
                {/* Cartão para controles de filtro */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems="center"
                  flexWrap="wrap"
                  justifyContent={{ sm: 'flex-end' }}
                  sx={{ width: { xs: '100%', md: 'auto' } }}
                >
                  {/* Organiza controles de filtro em uma pilha responsiva */}
                  <FormControl
                    sx={{
                      minWidth: { sm: 150 },
                      width: { xs: '100%', sm: 'auto' },
                    }}
                    size="small"
                  >
                    {/* Controle para selecionar o mês */}
                    <InputLabel
                      id="month-filter-label"
                      sx={{ fontFamily: FONTS.body, color: COLORS.textPrimary }}
                    >
                      Mês {/* Rótulo do campo de seleção de mês */}
                    </InputLabel>
                    <Select
                      labelId="month-filter-label"
                      value={month}
                      label="Mês"
                      onChange={handleMonthChange}
                      aria-label="Selecionar mês para filtrar dados"
                      sx={{
                        fontFamily: FONTS.body,
                        borderRadius: STYLES.buttonBorderRadius,
                        backgroundColor: COLORS.cardBackground,
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: month !== 'all' ? COLORS.primaryRoyalBlue : 'rgba(0,0,0,0.15)',
                        },
                        '&:focus-visible': {
                          outline: `2px solid ${COLORS.primaryRoyalBlue}`,
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      {monthOptions.map(option => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{ fontFamily: FONTS.body }}
                        >
                          {option.label} {/* Opção de mês no menu */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    sx={{
                      minWidth: { sm: 120 },
                      width: { xs: '100%', sm: 'auto' },
                    }}
                    size="small"
                  >
                    {/* Controle para selecionar o ano */}
                    <InputLabel
                      id="year-filter-label"
                      sx={{ fontFamily: FONTS.body, color: COLORS.textPrimary }}
                    >
                      Ano {/* Rótulo do campo de seleção de ano */}
                    </InputLabel>
                    <Select
                      labelId="year-filter-label"
                      value={year}
                      label="Ano"
                      onChange={handleYearChange}
                      aria-label="Selecionar ano para filtrar dados"
                      sx={{
                        fontFamily: FONTS.body,
                        borderRadius: STYLES.buttonBorderRadius,
                        backgroundColor: COLORS.cardBackground,
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: year !== 'all' ? COLORS.primaryRoyalBlue : 'rgba(0,0,0,0.15)',
                        },
                        '&:focus-visible': {
                          outline: `2px solid ${COLORS.primaryRoyalBlue}`,
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      {yearOptions.map(option => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{ fontFamily: FONTS.body }}
                        >
                          {option.label} {/* Opção de ano no menu */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    onClick={resetFilters}
                    variant="contained"
                    startIcon={<RestartAlt />}
                    sx={{
                      fontFamily: FONTS.subtitle,
                      fontWeight: 500,
                      backgroundColor: COLORS.secondaryGoldenYellow,
                      color: checkContrast(COLORS.textPrimary, COLORS.secondaryGoldenYellow),
                      borderRadius: STYLES.buttonBorderRadius,
                      textTransform: 'none',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': { backgroundColor: darken(COLORS.secondaryGoldenYellow, 0.1) },
                      '&:focus-visible': { outline: `2px solid ${COLORS.primaryRoyalBlue}`, outlineOffset: '2px' },
                    }}
                    aria-label="Limpar filtros"
                  >
                    Limpar Filtros {/* Botão para redefinir filtros */}
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Card>
        </motion.div>

        <Box sx={{ borderBottom: `1px solid rgba(0, 0, 0, 0.1)`, my: 4 }} />
        {/* Linha divisória entre seções */}

        <Grid
          container
          spacing={2}
          sx={{
            mb: 4,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(250px, 1fr))' },
            gap: '16px',
            justifyContent: 'center',
            '@media screen and (max-width: 768px)': {
              gridTemplateColumns: 'repeat(2, minmax(150px, 1fr))',
              overflowX: 'auto',
              paddingBottom: '16px',
              '& > *': {
                flex: '0 0 auto',
                minWidth: '150px',
                margin: '0 8px',
              },
              '& .MuiGrid-item': {
                width: '150px !important',
              },
            },
          }}
        >
          {/* Grid para cartões de métricas */}
          <MetricCard
            title="Faturamento Total"
            value={formattedTotalFaturamento}
            icon={<MonetizationOn />}
            cardBackgroundColor={COLORS.primaryRoyalBlue}
            ariaLabel="Faturamento total no período selecionado"
          />
          <MetricCard
            title="Total Pago"
            value={formattedValorPago}
            icon={<AssignmentTurnedIn />}
            cardBackgroundColor={COLORS.primaryAquaGreen}
            ariaLabel="Valor total pago no período selecionado"
          />
          <MetricCard
            title="Valor Pendente"
            value={formattedValorPendente}
            icon={<Warning />}
            cardBackgroundColor={COLORS.secondaryOrange}
            ariaLabel="Valor total pendente no período selecionado"
          />
          <MetricCard
            title="Total de Exames"
            value={totalExames.toLocaleString('pt-BR')}
            icon={<ListAlt />}
            cardBackgroundColor={COLORS.secondaryred}
            ariaLabel="Número total de exames no período selecionado"
          />
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
  {/* Grid para tabelas e gráficos com melhor espaçamento */}
  <Grid item xs={12} lg={4}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {/* Card de Pagamentos Pendentes com design aprimorado */}
      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
          p: { xs: 2, sm: 3 },
          height: '420px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${COLORS.primaryRoyalBlue}, ${COLORS.primaryRoyalBlue}CC)`,
            borderRadius: '16px 16px 0 0',
          },
          '@media screen and (max-width: 768px)': {
            height: 'auto',
            minHeight: '350px',
            p: 2,
          },
        }}
        elevation={0}
      >
        {/* Header melhorado com ícone e título */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid #f0f2f5'
        }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${COLORS.primaryRoyalBlue}15, ${COLORS.primaryRoyalBlue}25)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Payment 
              sx={{ 
                color: COLORS.primaryRoyalBlue,
                fontSize: '1.5rem',
              }} 
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                color: COLORS.textPrimary,
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
              }}
            >
              Pagamentos Pendentes
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#6b7280',
                mt: 0.5,
              }}
            >
              Por forma de pagamento
            </Typography>
          </Box>
        </Box>

        {/* Container da tabela com scroll personalizado */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid #f1f3f4',
            backgroundColor: '#ffffff',
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f8fafc',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#d1d5db',
                borderRadius: '3px',
                '&:hover': {
                  background: '#9ca3af',
                },
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      border: 'none',
                      backgroundColor: '#f8fafc',
                      py: 2,
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Forma de Pagamento
                    </Typography>
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      border: 'none',
                      backgroundColor: '#f8fafc',
                      py: 2,
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Valor
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(() => {
                  const paymentData = paymentTypeLabels
                    .map((label, index) => ({
                      label,
                      value: paymentPendingValues[index],
                    }))
                    .filter(({ value }) => value > 0);

                  paymentData.sort((a, b) => b.value - a.value);

                  return paymentData.length > 0 ? (
                    paymentData.map(({ label, value }, index) => (
                      <TableRow
                        key={label}
                        sx={{
                          '&:hover': { 
                            backgroundColor: '#f8fafc',
                            transition: 'background-color 0.2s ease',
                          },
                          '&:last-child td': { borderBottom: 'none' },
                        }}
                      >
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: '1px solid #f1f3f4',
                            fontFamily: 'Inter, sans-serif',
                            py: 2,
                            px: 2,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#374151',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: `hsl(${(index * 137.5) % 360}, 65%, 55%)`,
                              }}
                            />
                            {label}
                          </Box>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: 'none',
                            borderBottom: '1px solid #f1f3f4',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: value > 10000 ? '#dc2626' : value > 5000 ? '#f59e0b' : '#059669',
                            py: 2,
                            px: 2,
                          }}
                        >
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                          }).format(value)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        sx={{ 
                          border: 'none',
                          textAlign: 'center',
                          py: 6,
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          gap: 2,
                          opacity: 0.6,
                        }}>
                          <Payment sx={{ fontSize: '2rem', color: '#9ca3af' }} />
                          <Typography
                            sx={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.875rem',
                              color: '#6b7280',
                            }}
                          >
                            Nenhum pagamento pendente
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })()}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Card>
    </motion.div>
  </Grid>

  <Grid item xs={12} lg={4}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {/* Card de Pendências por Clínica com filtro melhorado */}
      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
          p: { xs: 2, sm: 3 },
          height: '420px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${COLORS.clinicVixenVet}, ${COLORS.clinicVixenVet}CC)`,
            borderRadius: '16px 16px 0 0',
          },
          '@media screen and (max-width: 768px)': {
            height: 'auto',
            minHeight: '350px',
            p: 2,
          },
        }}
        elevation={0}
      >
        {/* Header com filtro integrado */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3,
          pb: 2,
          borderBottom: '1px solid #f0f2f5',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${COLORS.clinicVixenVet}15, ${COLORS.clinicVixenVet}25)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalHospital 
                sx={{ 
                  color: COLORS.clinicVixenVet,
                  fontSize: '1.5rem',
                }} 
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                Pendências Clínica
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  mt: 0.5,
                }}
              >
                Pendências detalhadas
              </Typography>
            </Box>
          </Box>

          {/* Filtro redesenhado */}
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 15,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                },
              },
            }}
          >
            <InputLabel 
              sx={{ 
                fontFamily: 'Inter, sans-serif', 
                fontSize: '0.875rem',
                color: '#6b7280',
              }}
            >
              Filtrar por
            </InputLabel>
            <Select
              value={paymentTypeFilter}
              label="Filtrar por"
              onChange={handlePaymentTypeChange}
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              }}
            >
              {paymentTypeOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Tabela com design melhorado */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid #f1f3f4',
            backgroundColor: '#ffffff',
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f8fafc',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#d1d5db',
                borderRadius: '3px',
                '&:hover': {
                  background: '#9ca3af',
                },
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      border: 'none',
                      backgroundColor: '#f8fafc',
                      py: 2,
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Clínica
                    </Typography>
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      border: 'none',
                      backgroundColor: '#f8fafc',
                      py: 2,
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Pendente
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(() => {
                  const clinicData = filteredClinicData.labels
                    .map((label, index) => ({
                      label,
                      value: filteredClinicData.pendingValues[index],
                    }))
                    .filter(({ value }) => value > 0);

                  clinicData.sort((a, b) => b.value - a.value);

                  return clinicData.length > 0 ? (
                    clinicData.map(({ label, value }, index) => (
                      <TableRow
                        key={label}
                        sx={{
                          '&:hover': { 
                            backgroundColor: '#f8fafc',
                            transition: 'background-color 0.2s ease',
                          },
                          '&:last-child td': { borderBottom: 'none' },
                        }}
                      >
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: '1px solid #f1f3f4',
                            fontFamily: 'Inter, sans-serif',
                            py: 2,
                            px: 2,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#374151',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalHospital 
                              sx={{ 
                                fontSize: '1rem', 
                                color: `hsl(${(index * 137.5) % 360}, 65%, 55%)`,
                              }} 
                            />
                            {label}
                          </Box>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: 'none',
                            borderBottom: '1px solid #f1f3f4',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: value > 10000 ? '#dc2626' : value > 5000 ? '#f59e0b' : '#059669',
                            py: 2,
                            px: 2,
                          }}
                        >
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                          }).format(value)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        sx={{ 
                          border: 'none',
                          textAlign: 'center',
                          py: 6,
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          gap: 2,
                          opacity: 0.6,
                        }}>
                          <LocalHospital sx={{ fontSize: '2rem', color: '#9ca3af' }} />
                          <Typography
                            sx={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.875rem',
                              color: '#6b7280',
                              textAlign: 'center',
                            }}
                          >
                            Nenhuma pendência encontrada
                            <br />
                            <span style={{ fontSize: '0.75rem' }}>
                              para o filtro selecionado
                            </span>
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })()}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Card>
    </motion.div>
  </Grid>
 <Grid item xs={12} lg={4}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {/* Novo Card de Total Faturado por Clínica */}
      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
          p: { xs: 1.8, sm: 1.8 },
          height: '450px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${COLORS.clinicDraBicho}, ${COLORS.clinicDraBicho}CC)`,
            borderRadius: '16px 16px 0 0',
          },
          '@media screen and (max-width: 768px)': {
            height: 'auto',
            minHeight: '350px',
            p: 2,
          },
        }}
        elevation={0}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid #f0f2f5'
        }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${COLORS.clinicDraBicho}15, ${COLORS.clinicDraBicho}25)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MonetizationOn 
              sx={{ 
                color: COLORS.clinicDraBicho,
                fontSize: '1.5rem',
              }} 
            />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                color: COLORS.textPrimary,
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
              }}
            >
              Total Faturado por Clínica
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#6b7280',
                mt: 0.5,
              }}
            >
              Faturamento detalhado
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid #f1f3f4',
            backgroundColor: '#ffffff',
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f8fafc',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#d1d5db',
                borderRadius: '3px',
                '&:hover': {
                  background: '#9ca3af',
                },
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      border: 'none',
                      backgroundColor: '#f8fafc',
                      py: 2,
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Clínica
                    </Typography>
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      border: 'none',
                      backgroundColor: '#f8fafc',
                      py: 2,
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Total Faturado
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  const totalClinicData = clinicLabels
                    .map((label, index) => ({
                      label,
                      value: clinicTotalValues[index],
                    }))
                    .filter(({ value }) => value > 0);

                  totalClinicData.sort((a, b) => b.value - a.value);

                  return totalClinicData.length > 0 ? (
                    totalClinicData.map(({ label, value }, index) => (
                      <TableRow
                        key={label}
                        sx={{
                          '&:hover': { 
                            backgroundColor: '#f8fafc',
                            transition: 'background-color 0.2s ease',
                          },
                          '&:last-child td': { borderBottom: 'none' },
                        }}
                      >
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: '1px solid #f1f3f4',
                            fontFamily: 'Inter, sans-serif',
                            py: 2,
                            px: 2,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#374151',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalHospital 
                              sx={{ 
                                fontSize: '1rem', 
                                color: `hsl(${(index * 137.5) % 360}, 65%, 55%)`,
                              }} 
                            />
                            {label}
                          </Box>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: 'none',
                            borderBottom: '1px solid #f1f3f4',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: value > 100000 ? '#059669' : value > 50000 ? '#f59e0b' : '#374151',
                            py: 2,
                            px: 2,
                          }}
                        >
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                          }).format(value)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        sx={{ 
                          border: 'none',
                          textAlign: 'center',
                          py: 6,
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          gap: 2,
                          opacity: 0.6,
                        }}>
                          <MonetizationOn sx={{ fontSize: '2rem', color: '#9ca3af' }} />
                          <Typography
                            sx={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.875rem',
                              color: '#6b7280',
                              textAlign: 'center',
                            }}
                          >
                            Nenhum faturamento encontrado
                            <br />
                            <span style={{ fontSize: '0.75rem' }}>
                              para o período selecionado
                            </span>
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })()}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Card>
    </motion.div>
  </Grid>
</Grid>
  


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Animação para entrada da seção de análise detalhada */}
          <Card
            sx={{
              borderRadius: STYLES.cardBorderRadius,
              boxShadow: STYLES.cardBoxShadow,
              p: { xs: 2, sm: 2.5 },
              backgroundColor: COLORS.cardBackground,
              '@media screen and (max-width: 768px)': {
                p: 1,
                '& .MuiBox-root': {
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  '& > div': {
                    minWidth: '300px',
                  },
                },
                '& .MuiTypography-root': {
                  fontSize: '0.875rem',
                },
              },
            }}
            role="region"
            aria-labelledby="detailed-analysis-title"
          >
            <Typography
              id="detailed-analysis-title"
              sx={{ ...TYPOGRAPHY_SCALE.h1, color: COLORS.textPrimary, mb: 2, textAlign: 'center', letterSpacing: '0.02em' }}
            >
              Análise Detalhada {/* Título da seção */}
            </Typography>
            {isMobile ? (
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                {/* Controle para selecionar tipo de análise em dispositivos móveis */}
                <InputLabel
                  id="tab-select-label"
                  sx={{ fontFamily: FONTS.body, color: COLORS.textPrimary }}
                >
                  Análise {/* Rótulo do campo de seleção */}
                </InputLabel>
                <Select
                  labelId="tab-select-label"
                  value={tabValue}
                  label="Análise"
                  onChange={(e) => setTabValue(e.target.value)}
                  sx={{
                    fontFamily: FONTS.body,
                    borderRadius: STYLES.buttonBorderRadius,
                    backgroundColor: COLORS.cardBackground,
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' },
                    '&:focus-visible': { outline: `2px solid ${COLORS.primaryRoyalBlue}`, outlineOffset: '2px' },
                  }}
                  aria-label="Selecionar tipo de análise detalhada"
                >
                  <MenuItem value={0} sx={{ fontFamily: FONTS.body }}>Total por Clínica</MenuItem>
                  <MenuItem value={1} sx={{ fontFamily: FONTS.body }}>Exames por Tipo</MenuItem>
                  <MenuItem value={2} sx={{ fontFamily: FONTS.body }}>Faturamento por Pagamento</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                aria-label="Abas de análise detalhada"
                sx={{
                  mb: 2,
                  '& .MuiTabs-indicator': {
                    backgroundColor: COLORS.primaryRoyalBlue,
                    height: '3px',
                    borderRadius: '3px 3px 0 0',
                  },
                  '& .MuiTab-root': {
                    fontFamily: FONTS.subtitle,
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    color: COLORS.textPrimary,
                    opacity: 0.7,
                    '&.Mui-selected': {
                      color: COLORS.primaryRoyalBlue,
                      opacity: 1,
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${COLORS.primaryRoyalBlue}`,
                      outlineOffset: '2px',
                    },
                  },
                }}
              >
                <Tab label="Total por Clínica" /> {/* Aba para análise por clínica */}
                <Tab label="Exames por Tipo" /> {/* Aba para análise por tipo de exame */}
                <Tab label="Faturamento por Pagamento" /> {/* Aba para análise por forma de pagamento */}
              </Tabs>
            )}
            <Box sx={{ height: chartHeight, width: '100%' }}>
              {/* Container para gráficos de análise detalhada */}
              <Suspense
                fallback={
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    height={chartHeight}
                    sx={{ borderRadius: STYLES.cardBorderRadius, bgcolor: 'rgba(0, 0, 0, 0.05)' }}
                  />
                }
              >
                {/* Esqueleto de carregamento para gráficos */}
                {tabValue === 0 && clinicLabels.length > 0 && (
                  <Bar
                    data={getBarChartData(clinicLabels, clinicTotalValues, 'Faturamento Total (R$)')}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'Faturamento Total (R$)', font: { family: FONTS.subtitle, size: 14 } },
                          ticks: {
                            callback: value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
                            font: { family: FONTS.body },
                          },
                        },
                        x: {
                          title: { display: true, text: 'Clínica', font: { family: FONTS.subtitle, size: 14 } },
                          ticks: { font: { family: FONTS.body } },
                        },
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          titleFont: { family: FONTS.subtitle, weight: 'bold' },
                          bodyFont: { family: FONTS.body },
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y)}`,
                          },
                        },
                      },
                      animation: { duration: 1200 },
                    }}
                  />
                )}
                {/* Gráfico de barras para faturamento total por clínica */}
                {tabValue === 0 && clinicLabels.length === 0 && (
                  <Typography
                    sx={{ textAlign: 'center', fontFamily: FONTS.body, color: COLORS.textPrimary, opacity: 0.7, py: 3 }}
                  >
                    Sem dados de faturamento por clínica. {/* Mensagem para ausência de dados */}
                  </Typography>
                )}

                {tabValue === 1 && tiposLabels.length > 0 && (
                  <Bar
                    data={getBarChartData(tiposLabels, tiposValues, 'Quantidade de Exames')}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'Quantidade', font: { family: FONTS.subtitle, size: 14 } },
                          ticks: { precision: 0, font: { family: FONTS.body } },
                        },
                        x: {
                          title: { display: true, text: 'Tipo de Exame', font: { family: FONTS.subtitle, size: 14 } },
                          ticks: { font: { family: FONTS.body } },
                        },
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: { titleFont: { family: FONTS.subtitle, weight: 'bold' }, bodyFont: { family: FONTS.body } },
                      },
                      animation: { duration: 1200 },
                    }}
                  />
                )}
                {/* Gráfico de barras para quantidade de exames por tipo */}
                {tabValue === 1 && tiposLabels.length === 0 && (
                  <Typography
                    sx={{ textAlign: 'center', fontFamily: FONTS.body, color: COLORS.textPrimary, opacity: 0.7, py: 3 }}
                  >
                    Sem dados de exames por tipo. {/* Mensagem para ausência de dados */}
                  </Typography>
                )}

                {tabValue === 2 && paymentTypeLabels.length > 0 && (
                  <Bar
                    data={getBarChartData(paymentTypeLabels, paymentTypeValues, 'Faturamento (R$)')}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'Faturamento (R$)', font: { family: FONTS.subtitle, size: 14 } },
                          ticks: {
                            callback: value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
                            font: { family: FONTS.body },
                          },
                        },
                        x: {
                          title: { display: true, text: 'Forma de Pagamento', font: { family: FONTS.subtitle, size: 14 } },
                          ticks: { font: { family: FONTS.body } },
                        },
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          titleFont: { family: FONTS.subtitle, weight: 'bold' },
                          bodyFont: { family: FONTS.body },
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y)}`,
                          },
                        },
                      },
                      animation: { duration: 1200 },
                    }}
                  />
                )}
                {/* Gráfico de barras para faturamento por forma de pagamento */}
                {tabValue === 2 && paymentTypeLabels.length === 0 && (
                  <Typography
                    sx={{ textAlign: 'center', fontFamily: FONTS.body, color: COLORS.textPrimary, opacity: 0.7, py: 3 }}
                  >
                    Sem dados de faturamento por Forma de Pagamento. {/* Mensagem para ausência de dados */}
                  </Typography>
                )}
              </Suspense>
            </Box>
          </Card>
        </motion.div>
      </Box>

      <Fab
        onClick={handleRefresh}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 32 },
          right: { xs: 20, sm: 32 },
          backgroundColor: COLORS.primaryRoyalBlue,
          color: checkContrast(COLORS.textWhite, COLORS.primaryRoyalBlue),
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          boxShadow: '0px 4px 15px rgba(45, 91, 255, 0.4)',
          animation: 'pulse 2s infinite',
          '&:hover': {
            backgroundColor: darken(COLORS.primaryRoyalBlue, 0.1),
            transform: 'scale(1.05)',
            boxShadow: '0px 8px 25px rgba(45, 91, 255, 0.5)',
          },
          '&:focus-visible': {
            outline: `2px solid ${COLORS.primaryRoyalBlue}`,
            outlineOffset: '2px',
          },
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', boxShadow: '0px 4px 15px rgba(45, 91, 255, 0.3)' },
            '50%': { transform: 'scale(1.03)', boxShadow: '0px 8px 20px rgba(45, 91, 255, 0.4)' },
            '100%': { transform: 'scale(1)', boxShadow: '0px 4px 15px rgba(45, 91, 255, 0.3)' },
          },
        }}
        aria-label="Atualizar dashboard"
      >
        <Refresh /> {/* Botão flutuante para atualizar o dashboard */}
      </Fab>
    </Layout>
  </ThemeProvider>
);
};
// Exporta o componente Dashboard como padrão
export default Dashboard;
