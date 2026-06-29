import type { Server } from 'socket.io';
import type { NotificationType } from '../config/constants.js';
export declare const setSocketIO: (socketServer: Server) => void;
export declare const createNotification: (userId: string, type: NotificationType, message: string, refId?: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Notification.js").INotification, {}, {}> & import("../models/Notification.js").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const notifyRole: (role: string, type: NotificationType, message: string, refId?: string) => Promise<void>;
