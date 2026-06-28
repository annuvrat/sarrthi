import type { NextFunction, Request, Response } from 'express';
export declare const ensureDb: (_req: Request, _res: Response, next: NextFunction) => Promise<void>;
