import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getRoleHome } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      navigate(getRoleHome(user.role));
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="card w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary-700">SarrthiIAS Portal</h1>
          <p className="mt-1 text-sm text-gray-500">Student Performance Intelligence</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-400">
          Demo: admin@sarthiias.com / password123
        </p>
        <a href="/readiness" className="mt-3 block text-center text-sm text-primary-600 hover:underline">
          Try UPSC Readiness Analyzer →
        </a>
      </div>
    </div>
  );
}
