import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import type { ApiResponse, Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = async () => {
    if (!user) return;
    const { data } = await api.get<
      ApiResponse<{ items: Notification[]; unreadCount: number }>
    >('/notifications?limit=20');
    setNotifications(data.data.items);
    setUnreadCount(data.data.unreadCount);
  };

  useEffect(() => {
    if (!user) return;
    refresh();

    const socket = getSocket();
    const handler = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    };
    socket?.on('notification', handler);
    return () => {
      socket?.off('notification', handler);
    };
  }, [user]);

  const markRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
