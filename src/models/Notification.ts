import mongoose, { Document, Schema, Types } from 'mongoose';
import { NOTIFICATION_TYPES, type NotificationType } from '../config/constants.js';

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  message: string;
  read: boolean;
  refId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    refId: { type: Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
