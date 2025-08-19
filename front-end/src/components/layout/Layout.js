import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiFileText,
  FiBriefcase,
  FiUserCheck,
  FiCreditCard,
  FiFile,
  FiBarChart2,
  FiLogOut,
  FiRefreshCw,
  FiChevronRight,
  FiMenu,
  FiX,
  FiDollarSign,
  FiPieChart,
  FiList,
  FiLink,
} from 'react-icons/fi';

// Tema (mantido, com ajustes para submenu)
const theme = {
  colors: {
    primary: '#7AC143',
    primaryHover: '#1d4ed8',
    primaryLight: '#dbeafe',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#f8fafc',
    backgroundGlass: 'rgba(248, 250, 252, 0.8)',
    sidebarBackground: 'rgba(255, 255, 255, 0.95)',
    sidebarGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    activeItemBackground: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
    hoverItemBackground: 'rgba(37, 99, 235, 0.06)',
    error: '#ef4444',
    errorHover: '#dc2626',
    success: '#10b981',
    warning: '#f59e0b',
    white: '#ffffff',
    shadow: 'rgba(15, 23, 42, 0.08)',
    shadowMedium: 'rgba(15, 23, 42, 0.12)',
    shadowStrong: 'rgba(15, 23, 42, 0.16)',
    submenuBackground: 'rgba(248, 250, 252, 0.5)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    baseFontSize: '16px',
    h1: '2.5rem',
    h2: '1.875rem',
    h3: '1.5rem',
    body: '1rem',
    small: '0.875rem',
    caption: '0.75rem',
    micro: '0.6875rem',
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
    md: '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.02)',
    lg: '0 10px 25px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
    xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
    glow: '0 0 20px rgba(37, 99, 235, 0.15)',
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  sidebar: {
    widthExpanded: '280px',
    widthCollapsed: '80px',
    paddingVertical: '24px',
    paddingHorizontal: '16px',
    iconSize: '22px',
    submenuIndent: '36px',
  },
  header: {
    height: '72px',
  },
  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    medium: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    springcard: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
};

// Styled Components
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    font-size: ${props => props.theme.typography.baseFontSize};
    font-weight: ${props => props.theme.typography.weights.normal};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textPrimary};
    min-height: 100vh;
    overflow-x: hidden;
  }

  :focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  ::selection {
    background: ${props => props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.primary};
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.full};
    
    &:hover {
      background: ${props => props.theme.colors.secondary};
    }
  }
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  z-index: 999;
  display: none;
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: ${props => (props.isOpen ? 'block' : 'none')};
  }
`;

const SidebarToggleButton = styled(motion.button)`
  position: fixed;
  top: calc(${props => props.theme.header.height} + ${props => props.theme.spacing.xl});
  left: ${({ isCollapsed, theme }) => 
    isCollapsed 
      ? `calc(${theme.sidebar.widthCollapsed} - 20px)`
      : `calc(${theme.sidebar.widthExpanded} - 20px)`
  };
  z-index: 2000;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
  transition: left ${props => props.theme.transitions.medium}, all ${props => props.theme.transitions.fast};
  backdrop-filter: blur(8px);

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.glow};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 18px;
    transition: transform ${props => props.theme.transitions.medium};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textPrimary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.hoverItemBackground};
  }

  svg {
    font-size: 24px;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Sidebar = styled.aside`
  width: ${({ isCollapsed, theme }) => (isCollapsed ? theme.sidebar.widthCollapsed : theme.sidebar.widthExpanded)};
  background: ${props => props.theme.colors.sidebarGradient};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  border-right: 1px solid ${props => props.theme.colors.borderLight};
  z-index: ${({ isOpen }) => (isOpen ? 1000 : 800)};
  box-shadow: ${props => props.theme.shadows.xl};
  overflow: hidden;
  transition: width ${props => props.theme.transitions.medium}, transform ${props => props.theme.transitions.medium};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: ${props => props.theme.sidebar.widthExpanded};
    transform: translateX(${props => (props.isOpen ? '0' : '-100%')});
  }
`;

const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${props => props.theme.sidebar.paddingVertical} ${props => props.theme.sidebar.paddingHorizontal};
  position: relative;
  z-index: 1;
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isCollapsed }) => (isCollapsed ? 'center' : 'flex-start')};
  margin-bottom: ${props => props.theme.spacing.xxxl};
  position: relative;
`;

const Logo = styled.h1`
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.accent} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: ${props => props.theme.typography.h3};
  font-weight: ${props => props.theme.typography.weights.bold};
  letter-spacing: -0.02em;
  margin-bottom: ${props => props.theme.spacing.sm};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    border-radius: 2px;
    opacity: 1;
    transform: scaleX(1);
    transition: all ${props => props.theme.transitions.medium};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: block;
  }
`;

const Slogan = styled.p`
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.caption};
  font-weight: ${props => props.theme.typography.weights.medium};
  text-align: ${({ isCollapsed }) => (isCollapsed ? 'center' : 'left')};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: block;
    opacity: 1;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  flex-grow: 1;
`;

const NavItemWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => (isCollapsed ? 'center' : 'flex-start')};
  padding: ${({ isCollapsed, theme }) =>
    isCollapsed
      ? `${theme.spacing.sm} ${theme.spacing.md}`
      : `${theme.spacing.lg} ${theme.spacing.lg}`};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.typography.weights.medium};
  font-size: ${props => props.theme.typography.small};
  position: relative;
  overflow: visible;
  transition: all ${props => props.theme.transitions.medium};
  cursor: pointer;
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.textSecondary)};
  background: ${({ active, theme }) => (active ? theme.colors.activeItemBackground : 'transparent')};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.theme.colors.primary};
    transform: scaleY(${({ active }) => (active ? 1 : 0)});
    transition: transform ${props => props.theme.transitions.medium};
    border-radius: 0 2px 2px 0;
  }

  &:hover {
    background: ${props => props.theme.colors.hoverItemBackground};
    color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
    
    &::before {
      transform: scaleY(1);
    }
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }

  svg {
    margin-right: ${({ isCollapsed, theme }) => (isCollapsed ? '0' : theme.spacing.lg)};
    font-size: ${props => props.theme.sidebar.iconSize};
    min-width: ${props => props.theme.sidebar.iconSize};
    transition: all ${props => props.theme.transitions.medium};
    flex-shrink: 0;
  }

  span {
    opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
    width: ${({ isCollapsed }) => (isCollapsed ? '0' : 'auto')};
    overflow: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'visible')};
    white-space: nowrap;
    transition: opacity ${props => props.theme.transitions.medium}, 
                width ${props => props.theme.transitions.medium};
    font-weight: ${({ active, theme }) => (active ? theme.typography.weights.semibold : theme.typography.weights.medium)};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: flex-start;
    span {
      opacity: 1;
      width: auto;
      overflow: visible;
    }
    svg {
      margin-right: ${props => props.theme.spacing.xxl};
    }
  }
`;

const SubmenuWrapper = styled(motion.div)`
  margin-left: ${props => props.theme.sidebar.submenuIndent};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  background: ${props => props.theme.colors.submenuBackground};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.xs} 0;
`;

const SubmenuItemWrapper = styled(NavItemWrapper)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.caption};
  margin-left: ${props => props.theme.spacing.sm};

  &::before {
    left: -${props => props.theme.spacing.sm};
  }

  &:hover {
    transform: translateX(2px);
  }
`;

const NavItemLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  touch-action: manipulation;
`;

const SubmenuToggle = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => (isCollapsed ? 'center' : 'flex-start')};
  padding: ${({ isCollapsed, theme }) =>
    isCollapsed
      ? `${theme.spacing.sm} ${theme.spacing.md}`
      : `${theme.spacing.lg} ${theme.spacing.lg}`};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.typography.weights.medium};
  font-size: ${props => props.theme.typography.small};
  position: relative;
  cursor: pointer;
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.textSecondary)};
  background: ${({ active, theme }) => (active ? theme.colors.activeItemBackground : 'transparent')};
  
  &:hover {
    background: ${props => props.theme.colors.hoverItemBackground};
    color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
  }

  svg:first-child {
    margin-right: ${({ isCollapsed, theme }) => (isCollapsed ? '0' : theme.spacing.lg)};
    font-size: ${props => props.theme.sidebar.iconSize};
    min-width: ${props => props.theme.sidebar.iconSize};
  }

  .chevron {
    margin-left: auto;
    font-size: 16px;
    transition: transform ${props => props.theme.transitions.medium};
    transform: ${({ isOpen }) => (isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
  }

  span {
    opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
    width: ${({ isCollapsed }) => (isCollapsed ? '0' : 'auto')};
    overflow: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'visible')};
    white-space: nowrap;
    transition: opacity ${props => props.theme.transitions.medium}, 
                width ${props => props.theme.transitions.medium};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: flex-start;
    span {
      opacity: 1;
      width: auto;
    }
    .chevron {
      display: block;
    }
  }
`;

const LogoutButton = styled(motion.button)`
  background: transparent;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error}20;
  padding: ${({ isCollapsed, theme }) =>
    isCollapsed
      ? `${theme.spacing.sm} ${theme.spacing.md}`
      : `${theme.spacing.lg} ${theme.spacing.lg}`};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  font-weight: ${props => props.theme.typography.weights.medium};
  font-size: ${props => props.theme.typography.small};
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => (isCollapsed ? 'center' : 'flex-start')};
  transition: all ${props => props.theme.transitions.medium};
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
    transition: left ${props => props.theme.transitions.medium};
  }

  &:hover {
    background: ${props => props.theme.colors.error}10;
    border-color: ${props => props.theme.colors.error}40;
    color: ${props => props.theme.colors.errorHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  svg {
    margin-right: ${({ isCollapsed, theme }) => (isCollapsed ? '0' : theme.spacing.lg)};
    font-size: ${props => props.theme.sidebar.iconSize};
    min-width: ${props => props.theme.sidebar.iconSize};
  }

  span {
    opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
    width: ${({ isCollapsed }) => (isCollapsed ? '0' : 'auto')};
    overflow: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'visible')};
    transition: opacity ${props => props.theme.transitions.medium}, 
                width ${props => props.theme.transitions.medium};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: flex-start;
    span {
      opacity: 1;
      width: auto;
    }
  }
`;

const Header = styled.header`
  background: ${props => props.theme.colors.backgroundGlass};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  height: ${props => props.theme.header.height};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.xxxl};
  box-shadow: ${props => props.theme.shadows.md};
  position: fixed;
  top: 0;
  left: ${({ isCollapsed, theme }) => (isCollapsed ? theme.sidebar.widthCollapsed : theme.sidebar.widthExpanded)};
  right: 0;
  z-index: 500;
  transition: left ${props => props.theme.transitions.medium};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    left: 0;
    padding: 0 ${props => props.theme.spacing.xl};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm};
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.hoverItemBackground};
    color: ${props => props.theme.colors.primary};
  }

  svg {
    font-size: 20px;
  }

  &:active svg {
    animation: rotate 0.6s ease-in-out;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const UserAvatar = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.hoverItemBackground};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: ${props => props.theme.borderRadius.full};
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.white};
    font-weight: ${props => props.theme.typography.weights.semibold};
    font-size: ${props => props.theme.typography.small};
  }

  .user-info {
    display: flex;
    flex-direction: column;
    
    .name {
      font-size: ${props => props.theme.typography.small};
      font-weight: ${props => props.theme.typography.weights.semibold};
      color: ${props => props.theme.colors.textPrimary};
      line-height: 1.2;
    }
    
    .role {
      font-size: ${props => props.theme.typography.caption};
      color: ${props => props.theme.colors.textMuted};
      line-height: 1.2;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .user-info {
      display: none;
    }
  }
`;

const Content = styled.main`
  flex: 1;
  margin-left: ${({ isCollapsed, theme }) => (isCollapsed ? theme.sidebar.widthCollapsed : theme.sidebar.widthExpanded)};
  padding: calc(${props => props.theme.header.height} + ${props => props.theme.spacing.xl})
           ${props => props.theme.spacing.xl}
           ${props => props.theme.spacing.xl};
  min-height: 100vh;
  transition: margin-left ${props => props.theme.transitions.medium};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-left: 0;
    padding: calc(${props => props.theme.header.height} + ${props => props.theme.spacing.xl})
            ${props => props.theme.spacing.xl}
            ${props => props.theme.spacing.xl};
  }
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xxxl};
  font-size: ${props => props.theme.typography.small};
  color: ${props => props.theme.colors.textMuted};

  a {
    color: ${props => props.theme.colors.textMuted};
    text-decoration: none;
    font-weight: ${props => props.theme.typography.weights.medium};
    transition: color ${props => props.theme.transitions.fast};

    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }

  .separator {
    color: ${props => props.theme.colors.border};
    font-size: 14px;
  }

  .current {
    color: ${props => props.theme.colors.textPrimary};
    font-weight: ${props => props.theme.typography.weights.semibold};
  }
`;

const navItemVariants = {
  hover: { x: 4, transition: { type: "spring", stiffness: 400, damping: 17 } },
  tap: { scale: window.innerWidth <= 768 ? 1 : 0.98 },
};

const submenuVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

// Componente Layout
const Layout = ({ children, onRefresh, isModalOpen = false }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
        setIsMobileMenuOpen(false);
      } else {
        setIsSidebarCollapsed(isModalOpen);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isModalOpen]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavItemClick = (to) => {
    navigate(to);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSubmenuToggle = (submenu) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu);
  };

  const getPageTitle = (pathname) => {
    const routes = {
      '/': 'Página Inicial',
      '/dashboard': 'Dashboard',
      '/exames': 'Exames',
      '/clinicas': 'Clínicas',
      '/usuarios': 'Usuários',
      '/tipos-pagamento': 'Tipos de Pagamento',
      '/logs': 'Logs',
      '/relatorios': 'Relatórios',
      '/categorias': 'Categorias',
      '/despesas': 'Despesas',
      '/receitas': 'Receitas',
      '/relatorios-financeiros': 'Relatórios Financeiros',
    };
    return routes[pathname] || 'Página Desconhecida';
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const pageTitle = getPageTitle(location.pathname);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome, adminOnly: true },
    { to: '/exames', label: 'Exames', icon: FiFileText, adminOnly: false },
    {
      label: 'Administração',
      icon: FiUserCheck, // Ícone representando administração
      adminOnly: true,
      submenu: [
        { to: '/clinicas', label: 'Clínicas', icon: FiBriefcase },
        { to: '/usuarios', label: 'Usuários', icon: FiUserCheck },
        { to: '/tipos-pagamento', label: 'Tipos de Pagamento', icon: FiCreditCard },
      ],
    },
    {
      label: 'Financeiro',
      icon: FiDollarSign,
      adminOnly: false,
      submenu: [
        { to: '/categorias', label: 'Categorias', icon: FiList },
        { to: '/despesas', label: 'Despesas', icon: FiDollarSign },
        { to: '/receitas', label: 'Receitas', icon: FiDollarSign },
        { to: '/relatorios-financeiros', label: 'Relatórios Financeiros', icon: FiPieChart },
      ],
    },
    { to: '/logs', label: 'Logs', icon: FiFile, adminOnly: true },
    { to: '/relatorios', label: 'Relatórios', icon: FiBarChart2, adminOnly: false },
  ];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <MobileOverlay isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
        <Sidebar
          role="navigation"
          aria-label="Menu principal"
          isCollapsed={isSidebarCollapsed}
          isOpen={isMobileMenuOpen}
          animate={{ width: isSidebarCollapsed ? theme.sidebar.widthCollapsed : theme.sidebar.widthExpanded }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <SidebarInner>
            <div>
              <SidebarHeader isCollapsed={isSidebarCollapsed}>
                <Logo isCollapsed={isSidebarCollapsed}>Eco Imagem</Logo>
                <Slogan isCollapsed={isSidebarCollapsed}>Gestão de Exames</Slogan>
              </SidebarHeader>
              <Nav>
                {navItems.map((item, index) => {
                  if (item.adminOnly && user?.role !== 'Admin') return null;
                  const Icon = item.icon;
                  const isActive = item.submenu
                    ? item.submenu.some(sub => location.pathname.startsWith(sub.to))
                    : location.pathname === item.to;
                  if (item.submenu) {
                    const isSubmenuOpen = openSubmenu === item.label;
                    return (
                      <div key={item.label}>
                        <SubmenuToggle
                          active={isActive ? 1 : 0}
                          isCollapsed={isSidebarCollapsed}
                          isOpen={isSubmenuOpen}
                          onClick={() => handleSubmenuToggle(item.label)}
                          variants={navItemVariants}
                          whileHover="hover"
                          whileTap="tap"
                          aria-expanded={isSubmenuOpen}
                          aria-label={`Toggle submenu ${item.label}`}
                          title={item.label}
                        >
                          <Icon />
                          <span>{item.label}</span>
                          <FiChevronRight className="chevron" />
                        </SubmenuToggle>
                        <AnimatePresence>
                          {isSubmenuOpen && (
                            <SubmenuWrapper
                              variants={submenuVariants}
                              initial="closed"
                              animate="open"
                              exit="closed"
                            >
                              {item.submenu.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = location.pathname === subItem.to;
                                return (
                                  <SubmenuItemWrapper
                                    key={subItem.to}
                                    active={isSubActive ? 1 : 0}
                                    isCollapsed={isSidebarCollapsed}
                                    variants={navItemVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                  >
                                    <NavItemLink
                                      to={subItem.to}
                                      aria-label={subItem.label}
                                      title={subItem.label}
                                      onClick={() => handleNavItemClick(subItem.to)}
                                    >
                                      <SubIcon />
                                      <span>{subItem.label}</span>
                                    </NavItemLink>
                                  </SubmenuItemWrapper>
                                );
                              })}
                            </SubmenuWrapper>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  return (
                    <NavItemWrapper
                      key={item.to}
                      active={isActive ? 1 : 0}
                      isCollapsed={isSidebarCollapsed}
                      variants={navItemVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <NavItemLink
                        to={item.to}
                        aria-label={item.label}
                        title={item.label}
                        onClick={() => handleNavItemClick(item.to)}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </NavItemLink>
                    </NavItemWrapper>
                  );
                })}
              </Nav>
            </div>
            <LogoutButton
              onClick={handleLogout}
              isCollapsed={isSidebarCollapsed}
              aria-label="Sair do sistema"
              title="Sair do sistema"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiLogOut />
              <span>Sair</span>
            </LogoutButton>
          </SidebarInner>
        </Sidebar>

        {!isMobile && (
          <SidebarToggleButton
            onClick={handleToggleSidebar}
            isCollapsed={isSidebarCollapsed}
            title={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            aria-label={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiChevronRight style={{ transform: isSidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </SidebarToggleButton>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header isCollapsed={isSidebarCollapsed}>
            <HeaderLeft>
              <MobileMenuButton
                onClick={handleToggleSidebar}
                aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
              </MobileMenuButton>
            </HeaderLeft>
            <HeaderRight>
              {onRefresh && (
                <ActionButton
                  onClick={onRefresh}
                  title="Atualizar dados"
                  aria-label="Atualizar dados"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiRefreshCw />
                </ActionButton>
              )}
              <UserAvatar
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="avatar">{getUserInitials(user?.name)}</div>
                <div className="user-info">
                  <div className="name">{user?.name || 'Usuário'}</div>
                  <div className="role">{user?.role || 'Usuário'}</div>
                </div>
              </UserAvatar>
            </HeaderRight>
          </Header>
          <Content isCollapsed={isSidebarCollapsed}>
            <Breadcrumbs aria-label="Navegação estrutural">
              <Link to="/dashboard">Dashboard</Link>
              <span className="separator"><FiChevronRight /></span>
              <span className="current">{pageTitle}</span>
            </Breadcrumbs>
            {children}
          </Content>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Layout;