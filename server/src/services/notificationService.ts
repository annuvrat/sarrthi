import type { Server } from 'socket.io';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import type { NotificationType } from '../config/constants.js';

let io: Server | null = null;

export const setSocketIO = (socketServer: Server) => {
  io = socketServer;
};

export const createNotification = async (
  userId: string,
  type: NotificationType,
  message: string,
  refId?: string
) => {
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

export const notifyRole = async (role: string, type: NotificationType, message: string, refId?: string) => {
  const users = await User.find({ role, isActive: true }).select('_id');
  await Promise.all(users.map((u) => createNotification(u._id.toString(), type, message, refId)));
};
