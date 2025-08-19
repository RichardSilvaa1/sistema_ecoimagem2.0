import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import ClinicasList from './components/pages/ClinicasList';
import ExamesList from './components/pages/ExamesList';
import ExameForm from './components/pages/ExameForm';
import UsuariosList from './components/pages/UsuariosList';
import TipoPagamentoList from './components/pages/TipoPagamentoList';
import Relatorios from './components/pages/Relatorios'; // Existente, mas renomeie se for o antigo; vou criar um novo para finanças
import Logs from './components/pages/Logs';
import RedirectByRole from './services/RedirectByRole';

// Novos componentes (crie-os conforme abaixo)
import CategoriesList from './components/pages/CategoriesList';
import CategoryForm from './components/pages/CategoryForm';
import ExpensesList from './components/pages/ExpensesList';
import ExpenseForm from './components/pages/ExpenseForm';
import RevenuesList from './components/pages/RevenuesList';
import RevenueForm from './components/pages/RevenueForm';
import FinancialReports from './components/pages/FinancialReports'; // Novo para relatórios financeiros

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rota dinâmica inicial baseada no tipo */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <RedirectByRole />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/clinicas"
        element={
          <PrivateRoute>
            <ClinicasList />
          </PrivateRoute>
        }
      />
      <Route
        path="/exames"
        element={
          <PrivateRoute>
            <ExamesList />
          </PrivateRoute>
        }
      />
      <Route
        path="/exames/novo"
        element={
          <PrivateRoute>
            <ExameForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/exames/editar/:id"
        element={
          <PrivateRoute>
            <ExameForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <UsuariosList />
          </PrivateRoute>
        }
      />
      <Route
        path="/tipos-pagamento"
        element={
          <PrivateRoute>
            <TipoPagamentoList />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <Relatorios />
          </PrivateRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <PrivateRoute>
            <Logs />
          </PrivateRoute>
        }
      />

      {/* Novas rotas financeiras */}
      <Route
        path="/categorias"
        element={
          <PrivateRoute>
            <CategoriesList />
          </PrivateRoute>
        }
      />
      <Route
        path="/categorias/novo"
        element={
          <PrivateRoute>
            <CategoryForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/categorias/editar/:id"
        element={
          <PrivateRoute>
            <CategoryForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/despesas"
        element={
          <PrivateRoute>
            <ExpensesList />
          </PrivateRoute>
        }
      />
      <Route
        path="/despesas/novo"
        element={
          <PrivateRoute>
            <ExpenseForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/despesas/editar/:id"
        element={
          <PrivateRoute>
            <ExpenseForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/receitas"
        element={
          <PrivateRoute>
            <RevenuesList />
          </PrivateRoute>
        }
      />
      <Route
        path="/receitas/novo"
        element={
          <PrivateRoute>
            <RevenueForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/receitas/editar/:id"
        element={
          <PrivateRoute>
            <RevenueForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/relatorios-financeiros"
        element={
          <PrivateRoute>
            <FinancialReports />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;