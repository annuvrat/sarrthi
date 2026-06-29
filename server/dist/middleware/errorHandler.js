import logger from '../config/logger.js';
import { AppError } from '../utils/response.js';
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent)
        return next(err);
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Internal Server Error';
    if (statusCode >= 500) {
        logger.error({ err: err.message, stack: err.stack, path: req.path });
    }
    if (err.name === 'ValidationError' && err.errors) {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map((e) => e.message).join(', '),
            data: null,
        });
    }
    if (err.code === 11000) {
        return res.status(400).json({ success: false, message: 'Duplicate field value', data: null });
    }
    res.status(statusCode).json({ success: false, message, data: null });
};
export const notFound = (req, _res, next) => {
    next(new AppError(`Not found: ${req.originalUrl}`, 404));
};
