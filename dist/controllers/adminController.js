import { sendSuccess } from '../utils/response.js';
import { getAnalytics } from '../services/analyticsService.js';
export const getAdminAnalytics = async (_req, res) => {
    const data = await getAnalytics();
    sendSuccess(res, 'Analytics fetched', data);
};
