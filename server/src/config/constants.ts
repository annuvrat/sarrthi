export const ROLES = ['admin', 'mentor', 'evaluator', 'student'] as const;
export const PERFORMANCE_STATUS = ['Excellent', 'Good', 'Needs Attention', 'Critical'] as const;
export const TASK_PRIORITY = ['Low', 'Medium', 'High'] as const;
export const TASK_STATUS = ['pending', 'submitted', 'completed', 'overdue'] as const;
export const SUBMISSION_STATUS = ['pending', 'submitted', 'evaluated'] as const;
export const NOTIFICATION_TYPES = [
  'task_assigned',
  'submission_received',
  'evaluation_submitted',
  'deadline_approaching',
] as const;

export type Role = (typeof ROLES)[number];
export type PerformanceStatus = (typeof PERFORMANCE_STATUS)[number];
export type TaskPriority = (typeof TASK_PRIORITY)[number];
export type TaskStatus = (typeof TASK_STATUS)[number];
export type SubmissionStatus = (typeof SUBMISSION_STATUS)[number];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const getPerformanceStatus = (avgScore: number): PerformanceStatus => {
  if (avgScore >= 80) return 'Excellent';
  if (avgScore >= 60) return 'Good';
  if (avgScore >= 40) return 'Needs Attention';
  return 'Critical';
};
