import mongoose, { Schema } from 'mongoose';
import { NOTIFICATION_TYPES } from '../config/constants.js';
const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    refId: { type: Schema.Types.ObjectId, default: null },
}, { timestamps: true });
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
export const Notification = mongoose.model('Notification', notificationSchema);
