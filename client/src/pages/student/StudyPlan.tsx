import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Loading } from '../../components/ui';
import type { ApiResponse, StudyPlan } from '../../types';

export default function StudentStudyPlan() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = () => {
    api.get<ApiResponse<StudyPlan[]>>('/ai/study-plans').then((res) => setPlans(res.data.data));
  };

  useEffect(() => { fetch(); }, []);

  const generate = async () => {
    setLoading(true);
    await api.post('/ai/study-plan');
    fetch();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Study Coach</h2>
        <button className="btn-primary" onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Weekly Plan'}
        </button>
      </div>
      {plans.length === 0 ? (
        <Card><p className="text-gray-500">No study plans yet. Generate your first weekly plan!</p></Card>
      ) : (
        plans.map((p) => (
          <Card key={p._id} title={`Week of ${new Date(p.weekStart).toLocaleDateString()}`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Focus Areas</p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {p.plan.focusAreas.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-500">Study Hours: <strong>{p.plan.suggestedStudyHours}h/day</strong></p>
                <p className="text-sm text-gray-500">Answer Targets: <strong>{p.plan.answerWritingTargets}/week</strong></p>
              </div>
            </div>
            <p className="mt-3 text-sm"><strong>Revision:</strong> {p.plan.revisionStrategy}</p>
          </Card>
        ))
      )}
    </div>
  );
}
