import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, adminOnly }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;