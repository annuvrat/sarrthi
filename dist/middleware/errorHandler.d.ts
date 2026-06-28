import type { NextFunction, Request, Response } from 'express';
export declare const errorHandler: (err: Error & {
    statusCode?: number;
    isOperational?: boolean;
    code?: number;
    errors?: Record<string, {
        message: string;
    }>;
}, req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const notFound: (req: Request, _res: Response, next: NextFunction) => void;
