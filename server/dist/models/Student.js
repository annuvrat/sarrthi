import mongoose, { Schema } from 'mongoose';
import { PERFORMANCE_STATUS } from '../config/constants.js';
const studentSchema = new Schema({
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
}, { timestamps: true });
studentSchema.index({ mentorId: 1 });
studentSchema.index({ performanceStatus: 1 });
studentSchema.index({ userId: 1 }, { unique: true });
export const Student = mongoose.model('Student', studentSchema);
