export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
import type { Response } from 'express';
import type { PaginationMeta } from '../types/index.js';
export declare const sendSuccess: <T>(res: Response, message: string, data?: T, statusCode?: number) => void;
export declare const getPagination: (query: Record<string, unknown>) => {
    page: number;
    limit: number;
    skip: number;
};
export declare const buildPaginationMeta: (total: number, page: number, limit: number) => PaginationMeta;
