import mongoose, { Document, Types } from 'mongoose';
export interface IEvaluation extends Document {
    submissionId: Types.ObjectId;
    evaluatorId: Types.ObjectId;
    studentId: Types.ObjectId;
    score: number;
    strengths: string;
    weaknesses: string;
    suggestions: string;
    aiSuggestions: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Evaluation: mongoose.Model<IEvaluation, {}, {}, {}, mongoose.Document<unknown, {}, IEvaluation, {}, {}> & IEvaluation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
