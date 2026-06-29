import mongoose, { Document, Schema, Types } from 'mongoose';

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

const evaluationSchema = new Schema<IEvaluation>(
  {
    submissionId: { type: Schema.Types.ObjectId, ref: 'Submission', required: true, unique: true },
    evaluatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    strengths: { type: String, required: true },
    weaknesses: { type: String, required: true },
    suggestions: { type: String, required: true },
    aiSuggestions: { type: String, default: '' },
  },
  { timestamps: true }
);

evaluationSchema.index({ submissionId: 1 }, { unique: true });
evaluationSchema.index({ createdAt: -1 });
evaluationSchema.index({ studentId: 1 });

export const Evaluation = mongoose.model<IEvaluation>('Evaluation', evaluationSchema);
