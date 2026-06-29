import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Badge, Card, Loading, Pagination } from '../../components/ui';
import type { ApiResponse, Paginated } from '../../types';

interface MentorStudent {
  _id: string;
  name: string;
  avgScore: number;
  pendingTasks: number;
  performanceTrend: number[];
  performanceStatus: string;
}

export default function MentorStudents() {
  const [data, setData] = useState<Paginated<MentorStudent> | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get<ApiResponse<Paginated<MentorStudent>>>(`/students/mentor/assigned?page=${page}`).then((res) => setData(res.data.data));
  }, [page]);

  if (!data) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Students</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.items.map((s) => (
          <Card key={s._id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-500">Avg Score: {s.avgScore}</p>
                <p className="text-sm text-gray-500">Pending Tasks: {s.pendingTasks}</p>
              </div>
              <Badge variant={s.performanceStatus}>{s.performanceStatus}</Badge>
            </div>
            {s.performanceTrend.length > 0 && (
              <div className="mt-3 flex items-end gap-1">
                {s.performanceTrend.map((score, i) => (
                  <div key={i} className="w-6 rounded-t bg-primary-500" style={{ height: `${score}px` }} title={`${score}`} />
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} />
    </div>
  );
}
