import mongoose, { Document, Schema, Types } from 'mongoose';
import { SUBMISSION_STATUS, type SubmissionStatus } from '../config/constants.js';

export interface ISubmission extends Document {
  taskId: Types.ObjectId;
  studentId: Types.ObjectId;
  textResponse: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    textResponse: { type: String, default: '' },
    status: { type: String, enum: SUBMISSION_STATUS, default: 'submitted' },
  },
  { timestamps: true }
);

submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ taskId: 1 });
submissionSchema.index({ studentId: 1 });

export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
