import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Badge, Card, Loading, Pagination } from '../../components/ui';
import type { ApiResponse, Paginated, StudentProfile } from '../../types';

export default function AdminStudents() {
  const [data, setData] = useState<Paginated<StudentProfile> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', targetYear: 2026, notes: '' });

  const fetch = () => {
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    api.get<ApiResponse<Paginated<StudentProfile>>>(`/students?${params}`).then((res) => setData(res.data.data));
  };

  useEffect(() => { fetch(); }, [page, search, status]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/students', form);
    setShowForm(false);
    setForm({ name: '', email: '', mobile: '', targetYear: 2026, notes: '' });
    fetch();
  };

  if (!data) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Students</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Student</button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
            <input className="input" type="number" placeholder="Target Year" value={form.targetYear} onChange={(e) => setForm({ ...form, targetYear: +e.target.value })} required />
            <input className="input sm:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <button type="submit" className="btn-primary sm:col-span-2">Create Student</button>
          </form>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select className="input max-w-xs" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option>Excellent</option>
          <option>Good</option>
          <option>Needs Attention</option>
          <option>Critical</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Avg Score</th>
                <th className="p-2">Status</th>
                <th className="p-2">Target Year</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{s.userId?.name}</td>
                  <td className="p-2">{s.userId?.email}</td>
                  <td className="p-2">{s.avgScore}</td>
                  <td className="p-2"><Badge variant={s.performanceStatus}>{s.performanceStatus}</Badge></td>
                  <td className="p-2">{s.targetYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} />
      </Card>
    </div>
  );
}
