import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Loading } from '../../components/ui';
import type { ApiResponse, Evaluation } from '../../types';

export default function EvaluatorHistory() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    api.get<ApiResponse<{ items: Evaluation[] }>>('/evaluations?limit=50').then((res) => setEvaluations(res.data.data.items));
  }, []);

  if (!evaluations.length) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Evaluation History</h2>
      {evaluations.map((e) => (
        <Card key={e._id}>
          <div className="flex justify-between">
            <h3 className="font-semibold">{e.submissionId?.taskId?.title || 'Task'}</h3>
            <span className="text-lg font-bold text-primary-600">{e.score}/100</span>
          </div>
          <p className="mt-2 text-sm"><strong>Strengths:</strong> {e.strengths}</p>
          <p className="text-sm"><strong>Weaknesses:</strong> {e.weaknesses}</p>
          <p className="text-sm"><strong>Suggestions:</strong> {e.suggestions}</p>
        </Card>
      ))}
    </div>
  );
}
