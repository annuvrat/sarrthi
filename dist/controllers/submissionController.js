import logger from '../config/logger.js';
import { Submission } from '../models/Submission.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { AppError, sendSuccess } from '../utils/response.js';
import { createNotification, notifyRole } from '../services/notificationService.js';
export const createSubmission = async (req, res) => {
    const { taskId, textResponse } = req.body;
    const task = await Task.findOne({ _id: taskId, studentId: req.user._id });
    if (!task)
        throw new AppError('Task not found', 404);
    const existing = await Submission.findOne({ taskId });
    if (existing)
        throw new AppError('Submission already exists for this task', 400);
    const submission = await Submission.create({
        taskId,
        studentId: req.user._id,
        textResponse,
        status: 'submitted',
    });
    await Task.findByIdAndUpdate(taskId, { status: 'submitted' });
    logger.info({
        event: 'submission_creation',
        userId: req.user._id,
        role: req.user.role,
        resourceId: submission._id,
    });
    const mentor = await User.findById(task.mentorId);
    if (mentor) {
        await createNotification(mentor._id.toString(), 'submission_received', `New submission received for task: ${task.title}`, submission._id.toString());
    }
    await notifyRole('evaluator', 'submission_received', `New submission pending evaluation for task: ${task.title}`, submission._id.toString());
    sendSuccess(res, 'Submission created', submission, 201);
};
export const markTaskCompleted = async (req, res) => {
    const { taskId } = req.body;
    const task = await Task.findOneAndUpdate({ _id: taskId, studentId: req.user._id }, { status: 'completed' }, { new: true });
    if (!task)
        throw new AppError('Task not found', 404);
    sendSuccess(res, 'Task marked completed', task);
};
