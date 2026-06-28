import { Notification } from '../models/Notification.js';
import { AppError, buildPaginationMeta, getPagination, sendSuccess } from '../utils/response.js';
import { computeReadinessScore, generateReadinessRecommendations } from '../services/aiService.js';
export const getNotifications = async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { userId: req.user._id };
    const [items, total, unreadCount] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Notification.countDocuments(filter),
        Notification.countDocuments({ ...filter, read: false }),
    ]);
    sendSuccess(res, 'Notifications fetched', {
        items,
        unreadCount,
        pagination: buildPaginationMeta(total, page, limit),
    });
};
export const markNotificationRead = async (req, res) => {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { read: true }, { new: true });
    if (!notification)
        throw new AppError('Notification not found', 404);
    sendSuccess(res, 'Notification marked as read', notification);
};
export const analyzeReadiness = async (req, res) => {
    const { dailyHours, mockTests, optionalSubject, stage } = req.body;
    const readinessScore = computeReadinessScore({ dailyHours, mockTests, stage });
    const recommendations = await generateReadinessRecommendations({
        score: readinessScore,
        dailyHours,
        mockTests,
        optionalSubject,
        stage,
    });
    sendSuccess(res, 'Readiness analysis complete', { readinessScore, recommendations });
};
