import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
let io = null;
export const setSocketIO = (socketServer) => {
    io = socketServer;
};
export const createNotification = async (userId, type, message, refId) => {
    const notification = await Notification.create({
        userId,
        type,
        message,
        refId: refId || null,
    });
    if (io) {
        io.to(`user:${userId}`).emit('notification', {
            _id: notification._id,
            type: notification.type,
            message: notification.message,
            read: notification.read,
            refId: notification.refId,
            createdAt: notification.createdAt,
        });
    }
    return notification;
};
export const notifyRole = async (role, type, message, refId) => {
    const users = await User.find({ role, isActive: true }).select('_id');
    await Promise.all(users.map((u) => createNotification(u._id.toString(), type, message, refId)));
};
