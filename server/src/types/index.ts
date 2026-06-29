import type { Role } from '../config/constants.js';

export interface JwtPayload {
  userId: string;
  role: Role;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StudyPlanData {
  focusAreas: string[];
  suggestedStudyHours: number;
  answerWritingTargets: number;
  revisionStrategy: string;
}
