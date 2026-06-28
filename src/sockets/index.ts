import type { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User } from '../models/User.js';

export const initSocket = (io: Server) => {
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token as string;
      if (!token) return next(new Error('Unauthorized'));

      const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string };
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) return next(new Error('Unauthorized'));

      socket.data.userId = user._id.toString();
      socket.data.role = user.role;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);
    socket.on('disconnect', () => {});
  });
};
