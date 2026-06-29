export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}
export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
    res.status(statusCode).json({ success: true, message, data });
};
export const getPagination = (query) => {
    const page = Math.max(1, parseInt(String(query.page), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(query.limit), 10) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
export const buildPaginationMeta = (total, page, limit) => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
});
