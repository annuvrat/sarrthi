import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Loading, Pagination } from '../../components/ui';
import type { ApiResponse, Paginated } from '../../types';

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const [data, setData] = useState<Paginated<UserItem> | null>(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'mentor' });

  const fetch = () => {
    api.get<ApiResponse<Paginated<UserItem>>>(`/users?page=${page}`).then((res) => setData(res.data.data));
  };

  useEffect(() => { fetch(); }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/users', form);
    setForm({ name: '', email: '', password: '', role: 'mentor' });
    fetch();
  };

  if (!data) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Users</h2>
      <Card title="Create Mentor / Evaluator">
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="mentor">Mentor</option>
            <option value="evaluator">Evaluator</option>
          </select>
          <button type="submit" className="btn-primary sm:col-span-2">Create User</button>
        </form>
      </Card>
      <Card>
        <table className="w-full text-left text-sm">
          <thead className="border-b text-gray-500">
            <tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th></tr>
          </thead>
          <tbody>
            {data.items.map((u) => (
              <tr key={u._id} className="border-b"><td className="p-2">{u.name}</td><td className="p-2">{u.email}</td><td className="p-2 capitalize">{u.role}</td></tr>
            ))}
          </tbody>
        </table>
        <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} />
      </Card>
    </div>
  );
}
