import type { Request, Response } from 'express';
export declare const getNotifications: (req: Request, res: Response) => Promise<void>;
export declare const markNotificationRead: (req: Request, res: Response) => Promise<void>;
export declare const analyzeReadiness: (req: Request, res: Response) => Promise<void>;
