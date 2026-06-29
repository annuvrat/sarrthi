import { useState } from 'react';
import axios from 'axios';
import { Card } from '../components/ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const computeScore = (hours: number, mocks: number, stage: string) => {
  const stageWeight = { Beginner: 0.6, Intermediate: 0.8, Advanced: 1 }[stage] ?? 0.7;
  const base = stageWeight * 30 + Math.min(hours, 12) * 4 + Math.min(mocks, 50) * 1.2;
  return Math.round(Math.min(100, Math.max(0, base)));
};

const scoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

export default function Readiness() {
  const [dailyHours, setDailyHours] = useState(6);
  const [mockTests, setMockTests] = useState(10);
  const [optionalSubject, setOptionalSubject] = useState('');
  const [stage, setStage] = useState('Intermediate');
  const [score, setScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    const localScore = computeScore(dailyHours, mockTests, stage);
    setScore(localScore);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/public/readiness`, {
        dailyHours,
        mockTests,
        optionalSubject,
        stage,
      });
      setScore(data.data.readinessScore);
      setRecommendations(data.data.recommendations);
    } catch {
      setRecommendations([
        'Maintain consistent daily study hours.',
        'Attempt weekly full-length mock tests.',
        'Focus on answer writing practice.',
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-primary-700">SarrthiIAS</h1>
          <a href="/login" className="text-sm text-primary-600 hover:underline">
            Login →
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">UPSC Readiness Analyzer</h2>
          <p className="mt-2 text-gray-600">Assess your preparation level and get personalized recommendations</p>
        </div>

        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Daily Study Hours</label>
              <input className="input" type="number" min={0} max={24} value={dailyHours} onChange={(e) => setDailyHours(+e.target.value)} />
            </div>
            <div>
              <label className="label">Mock Tests Attempted</label>
              <input className="input" type="number" min={0} value={mockTests} onChange={(e) => setMockTests(+e.target.value)} />
            </div>
            <div>
              <label className="label">Optional Subject</label>
              <input className="input" placeholder="e.g. Sociology" value={optionalSubject} onChange={(e) => setOptionalSubject(e.target.value)} />
            </div>
            <div>
              <label className="label">Preparation Stage</label>
              <select className="input" value={stage} onChange={(e) => setStage(e.target.value)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <button className="btn-primary mt-6 w-full" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Readiness'}
          </button>
        </Card>

        {score !== null && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card className="text-center">
              <p className="text-sm text-gray-500">Readiness Score</p>
              <div className={`mt-2 text-6xl font-bold ${scoreColor(score)}`}>{score}</div>
              <div className="mx-auto mt-4 h-3 w-full rounded-full bg-gray-200">
                <div className="h-3 rounded-full bg-primary-600 transition-all" style={{ width: `${score}%` }} />
              </div>
            </Card>
            <Card title="Recommendations">
              <ul className="space-y-2">
                {recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-primary-600">•</span> {r}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
