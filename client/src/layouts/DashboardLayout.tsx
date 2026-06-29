import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

interface NavItem {
  to: string;
  label: string;
}

export const DashboardLayout = ({ title, nav }: { title: string; nav: NavItem[] }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markRead } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="btn-secondary md:hidden" onClick={() => setOpen(!open)}>
              ☰
            </button>
            <h1 className="text-lg font-bold text-primary-700">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="btn-secondary" onClick={() => setShowNotifs(!showNotifs)}>
                🔔 {unreadCount > 0 && <span className="ml-1 rounded-full bg-danger px-1.5 text-xs text-white">{unreadCount}</span>}
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-white shadow-lg">
                  <div className="border-b p-3 font-medium">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-3 text-sm text-gray-500">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n._id}
                          className={`block w-full border-b p-3 text-left text-sm hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}
                          onClick={() => markRead(n._id)}
                        >
                          {n.message}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="hidden text-sm text-gray-600 sm:inline">{user?.name}</span>
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className={`${open ? 'block' : 'hidden'} w-56 shrink-0 border-r bg-white p-4 md:block`}>
          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/readiness" className="block rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
              UPSC Readiness
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
