import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../../services/api';
import { Card, Loading, StatCard } from '../../components/ui';
import type { ApiResponse } from '../../types';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

interface Analytics {
  stats: {
    totalStudents: number;
    totalMentors: number;
    totalEvaluators: number;
    activeStudents: number;
    pendingEvaluations: number;
    completedEvaluations: number;
  };
  charts: {
    performanceDistribution: { status: string; count: number }[];
    taskCompletionTrend: { week: string; assigned: number; completed: number }[];
    evaluationScoreTrend: { week: string; avgScore: number }[];
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    api.get<ApiResponse<Analytics>>('/admin/analytics').then((res) => setData(res.data.data));
  }, []);

  if (!data) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Students" value={data.stats.totalStudents} />
        <StatCard label="Total Mentors" value={data.stats.totalMentors} />
        <StatCard label="Total Evaluators" value={data.stats.totalEvaluators} />
        <StatCard label="Active Students" value={data.stats.activeStudents} />
        <StatCard label="Pending Evaluations" value={data.stats.pendingEvaluations} />
        <StatCard label="Completed Evaluations" value={data.stats.completedEvaluations} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Student Performance Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.charts.performanceDistribution} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                {data.charts.performanceDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Task Completion Trend">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.charts.taskCompletionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#3b82f6" />
              <Bar dataKey="completed" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Evaluation Score Trend" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.charts.evaluationScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="avgScore" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
