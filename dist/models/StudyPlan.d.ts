import mongoose, { Document, Types } from 'mongoose';
import type { StudyPlanData } from '../types/index.js';
export interface IStudyPlan extends Document {
    studentId: Types.ObjectId;
    weekStart: Date;
    plan: StudyPlanData;
    createdAt: Date;
    updatedAt: Date;
}
export declare const StudyPlan: mongoose.Model<IStudyPlan, {}, {}, {}, mongoose.Document<unknown, {}, IStudyPlan, {}, {}> & IStudyPlan & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
