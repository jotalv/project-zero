import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectRoute({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return null;
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}
