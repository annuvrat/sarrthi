import mongoose, { Schema } from 'mongoose';
import { TASK_PRIORITY, TASK_STATUS } from '../config/constants.js';
const taskSchema = new Schema({
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: TASK_PRIORITY, default: 'Medium' },
    status: { type: String, enum: TASK_STATUS, default: 'pending' },
}, { timestamps: true });
taskSchema.index({ studentId: 1, status: 1, dueDate: 1 });
taskSchema.index({ mentorId: 1, studentId: 1 });
taskSchema.index({ title: 'text' });
export const Task = mongoose.model('Task', taskSchema);
