import mongoose, { Document, Types } from 'mongoose';
import { type PerformanceStatus } from '../config/constants.js';
export interface IStudent extends Document {
    userId: Types.ObjectId;
    mentorId: Types.ObjectId | null;
    mobile: string;
    targetYear: number;
    notes: string;
    attendancePct: number;
    testsAttempted: number;
    avgScore: number;
    lastEvalDate: Date | null;
    performanceStatus: PerformanceStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Student: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
