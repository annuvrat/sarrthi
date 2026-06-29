import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Loading } from '../../components/ui';
import type { ApiResponse, Evaluation } from '../../types';

export default function StudentEvaluations() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Evaluation[]>>('/evaluations/student/me').then((res) => setEvaluations(res.data.data));
  }, []);

  if (!evaluations.length) return <Card><p className="text-gray-500">No evaluations yet</p></Card>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Evaluation History</h2>
      {evaluations.map((e) => (
        <Card key={e._id}>
          <div className="flex justify-between">
            <h3 className="font-semibold">{e.submissionId?.taskId?.title}</h3>
            <span className="text-xl font-bold text-primary-600">{e.score}/100</span>
          </div>
          <p className="mt-2 text-sm">{e.suggestions}</p>
          {e.aiSuggestions && (
            <div className="mt-3 rounded-lg bg-primary-50 p-3 text-sm">
              <strong>AI Suggestions:</strong> {e.aiSuggestions}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
