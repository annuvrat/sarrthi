import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Badge, Card, Loading, Pagination } from '../../components/ui';
import type { ApiResponse, Paginated, Task } from '../../types';

export default function StudentTasks() {
  const [tasks, setTasks] = useState<Paginated<Task> | null>(null);
  const [page, setPage] = useState(1);
  const [submitForm, setSubmitForm] = useState<Record<string, string>>({});

  const fetch = () => {
    api.get<ApiResponse<Paginated<Task>>>(`/tasks/student/me?page=${page}`).then((res) => setTasks(res.data.data));
  };

  useEffect(() => { fetch(); }, [page]);

  const handleSubmit = async (taskId: string) => {
    await api.post('/submissions', { taskId, textResponse: submitForm[taskId] || '' });
    fetch();
  };

  const handleComplete = async (taskId: string) => {
    await api.post('/submissions/complete', { taskId });
    fetch();
  };

  if (!tasks) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Tasks</h2>
      {tasks.items.map((t) => (
        <Card key={t._id}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-gray-500">{t.description}</p>
              <p className="mt-1 text-xs text-gray-400">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
            </div>
            <Badge variant={t.priority}>{t.priority}</Badge>
          </div>
          {t.status === 'pending' && (
            <div className="mt-3 space-y-2">
              <textarea className="input" rows={3} placeholder="Your response..."
                value={submitForm[t._id] || ''} onChange={(e) => setSubmitForm({ ...submitForm, [t._id]: e.target.value })} />
              <div className="flex gap-2">
                <button className="btn-primary" onClick={() => handleSubmit(t._id)}>Submit Work</button>
                <button className="btn-secondary" onClick={() => handleComplete(t._id)}>Mark Complete</button>
              </div>
            </div>
          )}
          {t.status !== 'pending' && <p className="mt-2 text-sm capitalize text-gray-500">Status: {t.status}</p>}
        </Card>
      ))}
      <Pagination page={tasks.pagination.page} totalPages={tasks.pagination.totalPages} onChange={setPage} />
    </div>
  );
}
