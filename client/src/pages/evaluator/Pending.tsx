import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Loading, Pagination } from '../../components/ui';
import type { ApiResponse, Paginated } from '../../types';

interface PendingSubmission {
  _id: string;
  textResponse: string;
  taskId: { title: string; description: string };
  studentId: { name: string };
}

export default function EvaluatorPending() {
  const [data, setData] = useState<Paginated<PendingSubmission> | null>(null);
  const [page, setPage] = useState(1);
  const [evalForm, setEvalForm] = useState<Record<string, { score: number; strengths: string; weaknesses: string; suggestions: string }>>({});

  const fetch = () => {
    api.get<ApiResponse<Paginated<PendingSubmission>>>(`/evaluations/pending?page=${page}`).then((res) => setData(res.data.data));
  };

  useEffect(() => { fetch(); }, [page]);

  const handleEvaluate = async (submissionId: string) => {
    const form = evalForm[submissionId];
    if (!form) return;
    await api.post('/evaluations', { submissionId, ...form });
    fetch();
  };

  if (!data) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pending Submissions</h2>
      {data.items.length === 0 ? (
        <Card><p className="text-gray-500">No pending submissions</p></Card>
      ) : (
        data.items.map((s) => (
          <Card key={s._id}>
            <h3 className="font-semibold">{s.taskId?.title}</h3>
            <p className="text-sm text-gray-500">Student: {s.studentId?.name}</p>
            <p className="mt-2 rounded bg-gray-50 p-3 text-sm">{s.textResponse}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input className="input" type="number" placeholder="Score (0-100)" min={0} max={100}
                onChange={(e) => setEvalForm({ ...evalForm, [s._id]: { ...evalForm[s._id], score: +e.target.value, strengths: evalForm[s._id]?.strengths || '', weaknesses: evalForm[s._id]?.weaknesses || '', suggestions: evalForm[s._id]?.suggestions || '' } })} />
              <input className="input" placeholder="Strengths"
                onChange={(e) => setEvalForm({ ...evalForm, [s._id]: { ...evalForm[s._id], strengths: e.target.value, score: evalForm[s._id]?.score || 0, weaknesses: evalForm[s._id]?.weaknesses || '', suggestions: evalForm[s._id]?.suggestions || '' } })} />
              <input className="input" placeholder="Weaknesses"
                onChange={(e) => setEvalForm({ ...evalForm, [s._id]: { ...evalForm[s._id], weaknesses: e.target.value, score: evalForm[s._id]?.score || 0, strengths: evalForm[s._id]?.strengths || '', suggestions: evalForm[s._id]?.suggestions || '' } })} />
              <input className="input" placeholder="Suggestions"
                onChange={(e) => setEvalForm({ ...evalForm, [s._id]: { ...evalForm[s._id], suggestions: e.target.value, score: evalForm[s._id]?.score || 0, strengths: evalForm[s._id]?.strengths || '', weaknesses: evalForm[s._id]?.weaknesses || '' } })} />
            </div>
            <button className="btn-primary mt-3" onClick={() => handleEvaluate(s._id)}>Submit Evaluation</button>
          </Card>
        ))
      )}
      <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} />
    </div>
  );
}
