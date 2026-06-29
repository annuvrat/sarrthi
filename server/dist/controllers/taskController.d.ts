import type { Request, Response } from 'express';
export declare const createTask: (req: Request, res: Response) => Promise<void>;
export declare const listTasks: (req: Request, res: Response) => Promise<void>;
export declare const getStudentTasks: (req: Request, res: Response) => Promise<void>;
export declare const updateTaskStatus: (req: Request, res: Response) => Promise<void>;
