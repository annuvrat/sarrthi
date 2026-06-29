import { Outlet } from 'react-router-dom';
import { NotificationProvider } from '../context/NotificationContext';

export const NotificationWrapper = () => (
  <NotificationProvider>
    <Outlet />
  </NotificationProvider>
);
