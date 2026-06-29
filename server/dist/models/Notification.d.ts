import mongoose, { Document, Types } from 'mongoose';
import { type NotificationType } from '../config/constants.js';
export interface INotification extends Document {
    userId: Types.ObjectId;
    type: NotificationType;
    message: string;
    read: boolean;
    refId: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
