import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User } from '../models/User.js';
export const initSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token)
                return next(new Error('Unauthorized'));
            const decoded = jwt.verify(token, config.jwt.accessSecret);
            const user = await User.findById(decoded.userId);
            if (!user || !user.isActive)
                return next(new Error('Unauthorized'));
            socket.data.userId = user._id.toString();
            socket.data.role = user.role;
            next();
        }
        catch {
            next(new Error('Unauthorized'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        socket.join(`user:${userId}`);
        socket.on('disconnect', () => { });
    });
};
