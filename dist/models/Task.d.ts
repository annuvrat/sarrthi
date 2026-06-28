import mongoose, { Document, Types } from 'mongoose';
import { type TaskPriority, type TaskStatus } from '../config/constants.js';
export interface ITask extends Document {
    mentorId: Types.ObjectId;
    studentId: Types.ObjectId;
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
