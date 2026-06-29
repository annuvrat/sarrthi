import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Badge, Card, Loading, Pagination } from '../../components/ui';
import type { ApiResponse, Paginated, Task } from '../../types';

export default function MentorTasks() {
  const [tasks, setTasks] = useState<Paginated<Task> | null>(null);
  const [students, setStudents] = useState<{ _id: string; userId: { _id: string; name: string } }[]>([]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ studentId: '', title: '', description: '', dueDate: '', priority: 'Medium' });

  useEffect(() => {
    api.get<ApiResponse<Paginated<Task>>>(`/tasks?page=${page}`).then((res) => setTasks(res.data.data));
    api
      .get<ApiResponse<Paginated<{ _id: string; userId: { _id: string; name: string } }>>>(
        '/students/mentor/assigned?limit=100'
      )
      .then((res) => setStudents(res.data.data.items));
  }, [page]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setForm({ studentId: '', title: '', description: '', dueDate: '', priority: 'Medium' });
    api.get<ApiResponse<Paginated<Task>>>(`/tasks?page=${page}`).then((res) => setTasks(res.data.data));
  };

  if (!tasks) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assign Tasks</h2>
      <Card>
        <form onSubmit={handleAssign} className="grid gap-3 sm:grid-cols-2">
          <select className="input sm:col-span-2" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s.userId._id}>{s.userId.name}</option>
            ))}
          </select>
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <textarea className="input sm:col-span-2" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input className="input" type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <button type="submit" className="btn-primary">Assign Task</button>
        </form>
      </Card>
      <Card title="Assigned Tasks">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-gray-500">
            <tr><th className="p-2">Title</th><th className="p-2">Due</th><th className="p-2">Priority</th><th className="p-2">Status</th></tr>
          </thead>
          <tbody>
            {tasks.items.map((t) => (
              <tr key={t._id} className="border-b">
                <td className="p-2">{t.title}</td>
                <td className="p-2">{new Date(t.dueDate).toLocaleDateString()}</td>
                <td className="p-2"><Badge variant={t.priority}>{t.priority}</Badge></td>
                <td className="p-2 capitalize">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={tasks.pagination.page} totalPages={tasks.pagination.totalPages} onChange={setPage} />
      </Card>
    </div>
  );
}
