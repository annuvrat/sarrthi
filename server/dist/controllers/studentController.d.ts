import type { Request, Response } from 'express';
export declare const createStudent: (req: Request, res: Response) => Promise<void>;
export declare const listStudents: (req: Request, res: Response) => Promise<void>;
export declare const getStudent: (req: Request, res: Response) => Promise<void>;
export declare const updateStudent: (req: Request, res: Response) => Promise<void>;
export declare const getMentorStudents: (req: Request, res: Response) => Promise<void>;
