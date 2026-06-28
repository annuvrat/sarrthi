import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import type { StudyPlanData } from '../types/index.js';

const genAI = config.geminiApiKey ? new GoogleGenerativeAI(config.geminiApiKey) : null;

const parseJson = <T>(text: string): T => {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned) as T;
};

const mockStudyPlan = (avgScore: number, missedDeadlines: number): StudyPlanData => ({
  focusAreas: [
    avgScore < 60 ? 'Answer writing fundamentals' : 'Advanced answer structuring',
    missedDeadlines > 2 ? 'Time management' : 'Revision cycles',
    'Current affairs integration',
  ],
  suggestedStudyHours: avgScore < 50 ? 8 : avgScore < 75 ? 6 : 5,
  answerWritingTargets: avgScore < 60 ? 5 : 3,
  revisionStrategy:
    'Follow a 3-day revision cycle: Day 1 new topics, Day 2 practice answers, Day 3 full revision of weak areas.',
});

export const generateStudyPlan = async (context: {
  avgScore: number;
  completedTasks: number;
  missedDeadlines: number;
  weaknesses: string[];
}): Promise<StudyPlanData> => {
  if (config.aiMock || !genAI) {
    return mockStudyPlan(context.avgScore, context.missedDeadlines);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a UPSC study coach. Based on this student data, return ONLY valid JSON with keys: focusAreas (string array), suggestedStudyHours (number), answerWritingTargets (number), revisionStrategy (string).
Avg Score: ${context.avgScore}
Completed Tasks: ${context.completedTasks}
Missed Deadlines: ${context.missedDeadlines}
Weaknesses: ${context.weaknesses.join('; ') || 'None recorded'}`;

    const result = await model.generateContent(prompt);
    return parseJson<StudyPlanData>(result.response.text());
  } catch {
    return mockStudyPlan(context.avgScore, context.missedDeadlines);
  }
};

export const generateEvaluationSuggestions = async (weaknesses: string): Promise<string> => {
  if (config.aiMock || !genAI) {
    return `Focus on improving: ${weaknesses}. Practice structured answer writing daily.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(
      `As a UPSC evaluator, give 2-3 concise improvement suggestions for these weaknesses: ${weaknesses}. Plain text only, under 150 words.`
    );
    return result.response.text();
  } catch {
    return `Focus on improving: ${weaknesses}. Practice structured answer writing daily.`;
  }
};

export const generateReadinessRecommendations = async (input: {
  score: number;
  dailyHours: number;
  mockTests: number;
  optionalSubject?: string;
  stage: string;
}): Promise<string[]> => {
  if (config.aiMock || !genAI) {
    const recs = [
      `Maintain ${Math.max(6, input.dailyHours)} hours of focused study daily.`,
      'Attempt at least 2 full-length mock tests per week.',
      input.stage === 'Beginner' ? 'Build NCERT foundation before moving to standard books.' : 'Focus on answer writing and revision.',
    ];
    if (input.optionalSubject) recs.push(`Dedicate fixed weekly slots for ${input.optionalSubject}.`);
    return recs;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(
      `UPSC readiness score: ${input.score}/100. Daily hours: ${input.dailyHours}. Mock tests: ${input.mockTests}. Stage: ${input.stage}. Optional: ${input.optionalSubject || 'None'}. Return ONLY a JSON array of 3-5 short recommendation strings.`
    );
    return parseJson<string[]>(result.response.text());
  } catch {
    return [
      'Increase daily study consistency.',
      'Practice answer writing under timed conditions.',
      'Revise previous mock test mistakes weekly.',
    ];
  }
};

export const computeReadinessScore = (input: {
  dailyHours: number;
  mockTests: number;
  stage: string;
}): number => {
  const stageWeight = { Beginner: 0.6, Intermediate: 0.8, Advanced: 1 }[input.stage] ?? 0.7;
  const base = stageWeight * 30 + Math.min(input.dailyHours, 12) * 4 + Math.min(input.mockTests, 50) * 1.2;
  return Math.round(Math.min(100, Math.max(0, base)));
};
