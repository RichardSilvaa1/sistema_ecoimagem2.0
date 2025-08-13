import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const RedirectByRole = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user?.tipo?.toLowerCase() === 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (user?.tipo?.toLowerCase() === 'clínica' || user?.tipo?.toLowerCase() === 'clinica') {
        navigate('/exames', { replace: true });
      } else {
        navigate('/login', { replace: true }); // fallback
      }
    }
  }, [user, loading, navigate]);

  return null; // ou um spinner, se quiser
};

export default RedirectByRole;
