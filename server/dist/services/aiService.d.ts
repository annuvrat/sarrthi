import type { StudyPlanData } from '../types/index.js';
export declare const generateStudyPlan: (context: {
    avgScore: number;
    completedTasks: number;
    missedDeadlines: number;
    weaknesses: string[];
}) => Promise<StudyPlanData>;
export declare const generateEvaluationSuggestions: (weaknesses: string) => Promise<string>;
export declare const generateReadinessRecommendations: (input: {
    score: number;
    dailyHours: number;
    mockTests: number;
    optionalSubject?: string;
    stage: string;
}) => Promise<string[]>;
export declare const computeReadinessScore: (input: {
    dailyHours: number;
    mockTests: number;
    stage: string;
}) => number;
