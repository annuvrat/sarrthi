import mongoose, { Schema } from 'mongoose';
const studyPlanSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true },
    plan: {
        focusAreas: [{ type: String }],
        suggestedStudyHours: { type: Number },
        answerWritingTargets: { type: Number },
        revisionStrategy: { type: String },
    },
}, { timestamps: true });
studyPlanSchema.index({ studentId: 1, weekStart: -1 });
export const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
