import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import type { ApiResponse, Role, User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const roleHome: Record<Role, string> = {
  admin: '/admin',
  mentor: '/mentor',
  evaluator: '/evaluator',
  student: '/student',
};

export const getRoleHome = (role: Role) => roleHome[role];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (stored && token) {
      setUser(JSON.parse(stored));
      connectSocket(token);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >('/auth/login', { email, password });

    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    connectSocket(data.data.accessToken);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    localStorage.clear();
    disconnectSocket();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
