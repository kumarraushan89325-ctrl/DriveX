import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (!admin && user.role === 'admin' && location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
