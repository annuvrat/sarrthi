import { Evaluation } from '../models/Evaluation.js';
import { Student } from '../models/Student.js';
import { Submission } from '../models/Submission.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { getPerformanceStatus } from '../config/constants.js';

let cache: { data: unknown; expiresAt: number } | null = null;

export const updateStudentMetrics = async (studentUserId: string) => {
  const evaluations = await Evaluation.find({ studentId: studentUserId }).select('score');
  const avgScore =
    evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
      : 0;

  const lastEval = await Evaluation.findOne({ studentId: studentUserId }).sort({ createdAt: -1 });

  await Student.findOneAndUpdate(
    { userId: studentUserId },
    {
      avgScore: Math.round(avgScore * 10) / 10,
      testsAttempted: evaluations.length,
      lastEvalDate: lastEval?.createdAt || null,
      performanceStatus: getPerformanceStatus(avgScore),
    }
  );
};

export const getAnalytics = async () => {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalStudents,
    totalMentors,
    totalEvaluators,
    activeStudents,
    pendingEvaluations,
    completedEvaluations,
    performanceDistribution,
    taskTrend,
    scoreTrend,
  ] = await Promise.all([
    User.countDocuments({ role: 'student', isActive: true }),
    User.countDocuments({ role: 'mentor', isActive: true }),
    User.countDocuments({ role: 'evaluator', isActive: true }),
    User.countDocuments({ role: 'student', isActive: true, lastLoginAt: { $gte: thirtyDaysAgo } }),
    Submission.countDocuments({ status: 'submitted' }),
    Evaluation.countDocuments(),
    Student.aggregate([{ $group: { _id: '$performanceStatus', count: { $sum: 1 } } }]),
    Task.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%U', date: '$createdAt' } },
          assigned: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 8 },
    ]),
    Evaluation.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%U', date: '$createdAt' } },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 8 },
    ]),
  ]);

  const data = {
    stats: {
      totalStudents,
      totalMentors,
      totalEvaluators,
      activeStudents,
      pendingEvaluations,
      completedEvaluations,
    },
    charts: {
      performanceDistribution: performanceDistribution.map((p: { _id: string; count: number }) => ({
        status: p._id,
        count: p.count,
      })),
      taskCompletionTrend: taskTrend.map((t: { _id: string; assigned: number; completed: number }) => ({
        week: t._id,
        assigned: t.assigned,
        completed: t.completed,
      })),
      evaluationScoreTrend: scoreTrend.map((s: { _id: string; avgScore: number }) => ({
        week: s._id,
        avgScore: Math.round(s.avgScore * 10) / 10,
      })),
    },
  };

  cache = { data, expiresAt: Date.now() + 5 * 60 * 1000 };
  return data;
};
