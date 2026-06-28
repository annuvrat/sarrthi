import mongoose, { Document, Schema, Types } from 'mongoose';
import { PERFORMANCE_STATUS, type PerformanceStatus } from '../config/constants.js';

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

const studentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    mobile: { type: String, required: true, trim: true },
    targetYear: { type: Number, required: true },
    notes: { type: String, default: '' },
    attendancePct: { type: Number, default: 0, min: 0, max: 100 },
    testsAttempted: { type: Number, default: 0, min: 0 },
    avgScore: { type: Number, default: 0, min: 0, max: 100 },
    lastEvalDate: { type: Date, default: null },
    performanceStatus: { type: String, enum: PERFORMANCE_STATUS, default: 'Needs Attention' },
  },
  { timestamps: true }
);

studentSchema.index({ mentorId: 1 });
studentSchema.index({ performanceStatus: 1 });
studentSchema.index({ userId: 1 }, { unique: true });

export const Student = mongoose.model<IStudent>('Student', studentSchema);
