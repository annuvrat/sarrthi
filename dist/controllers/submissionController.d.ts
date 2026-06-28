import type { Request, Response } from 'express';
export declare const createSubmission: (req: Request, res: Response) => Promise<void>;
export declare const markTaskCompleted: (req: Request, res: Response) => Promise<void>;
