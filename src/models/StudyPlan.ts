import mongoose, { Document, Schema, Types } from 'mongoose';
import type { StudyPlanData } from '../types/index.js';

export interface IStudyPlan extends Document {
  studentId: Types.ObjectId;
  weekStart: Date;
  plan: StudyPlanData;
  createdAt: Date;
  updatedAt: Date;
}

const studyPlanSchema = new Schema<IStudyPlan>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true },
    plan: {
      focusAreas: [{ type: String }],
      suggestedStudyHours: { type: Number },
      answerWritingTargets: { type: Number },
      revisionStrategy: { type: String },
    },
  },
  { timestamps: true }
);

studyPlanSchema.index({ studentId: 1, weekStart: -1 });

export const StudyPlan = mongoose.model<IStudyPlan>('StudyPlan', studyPlanSchema);
