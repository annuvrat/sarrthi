import mongoose, { Schema } from 'mongoose';
import { SUBMISSION_STATUS } from '../config/constants.js';
const submissionSchema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    textResponse: { type: String, default: '' },
    status: { type: String, enum: SUBMISSION_STATUS, default: 'submitted' },
}, { timestamps: true });
submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ taskId: 1 });
submissionSchema.index({ studentId: 1 });
export const Submission = mongoose.model('Submission', submissionSchema);
