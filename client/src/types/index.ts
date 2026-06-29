export type Role = 'admin' | 'mentor' | 'evaluator' | 'student';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface Notification {
  _id: string;
  type: string;
  message: string;
  read: boolean;
  refId?: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: string;
  studentId?: string;
}

export interface StudentProfile {
  _id: string;
  userId: { name: string; email: string };
  mobile: string;
  targetYear: number;
  notes?: string;
  avgScore: number;
  performanceStatus: string;
  attendancePct: number;
  mentorId?: { name: string };
}

export interface Evaluation {
  _id: string;
  score: number;
  strengths: string;
  weaknesses: string;
  suggestions: string;
  aiSuggestions: string;
  createdAt: string;
  evaluatorId?: { name: string };
  submissionId?: { taskId?: { title: string } };
}

export interface StudyPlan {
  _id: string;
  weekStart: string;
  plan: {
    focusAreas: string[];
    suggestedStudyHours: number;
    answerWritingTargets: number;
    revisionStrategy: string;
  };
}
