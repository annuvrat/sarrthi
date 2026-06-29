import mongoose, { Schema } from 'mongoose';
const evaluationSchema = new Schema({
    submissionId: { type: Schema.Types.ObjectId, ref: 'Submission', required: true, unique: true },
    evaluatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    strengths: { type: String, required: true },
    weaknesses: { type: String, required: true },
    suggestions: { type: String, required: true },
    aiSuggestions: { type: String, default: '' },
}, { timestamps: true });
evaluationSchema.index({ submissionId: 1 }, { unique: true });
evaluationSchema.index({ createdAt: -1 });
evaluationSchema.index({ studentId: 1 });
export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
