import mongoose, { Document, Types } from 'mongoose';
import { type SubmissionStatus } from '../config/constants.js';
export interface ISubmission extends Document {
    taskId: Types.ObjectId;
    studentId: Types.ObjectId;
    textResponse: string;
    status: SubmissionStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Submission: mongoose.Model<ISubmission, {}, {}, {}, mongoose.Document<unknown, {}, ISubmission, {}, {}> & ISubmission & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
