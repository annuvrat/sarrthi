export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

import type { Response } from 'express';
import type { PaginationMeta } from '../types/index.js';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T = {} as T,
  statusCode = 200
): void => {
  res.status(statusCode).json({ success: true, message, data });
};

export const getPagination = (query: Record<string, unknown>) => {
  const page = Math.max(1, parseInt(String(query.page), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit), 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPaginationMeta = (total: number, page: number, limit: number): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});
