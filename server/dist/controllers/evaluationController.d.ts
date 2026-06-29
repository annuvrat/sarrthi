import type { Request, Response } from 'express';
export declare const getPendingSubmissions: (req: Request, res: Response) => Promise<void>;
export declare const createEvaluation: (req: Request, res: Response) => Promise<void>;
export declare const listEvaluations: (req: Request, res: Response) => Promise<void>;
export declare const getStudentEvaluations: (req: Request, res: Response) => Promise<void>;
