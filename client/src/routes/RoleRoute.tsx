import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

export const RoleRoute = ({ allowed }: { allowed: Role[] }) => {
  const { user } = useAuth();
  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
