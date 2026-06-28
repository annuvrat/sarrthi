import logger from '../config/logger.js';
import { Evaluation } from '../models/Evaluation.js';
import { Submission } from '../models/Submission.js';
import { Task } from '../models/Task.js';
import { AppError, buildPaginationMeta, getPagination, sendSuccess } from '../utils/response.js';
import { generateEvaluationSuggestions } from '../services/aiService.js';
import { createNotification } from '../services/notificationService.js';
import { updateStudentMetrics } from '../services/analyticsService.js';
export const getPendingSubmissions = async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const [items, total] = await Promise.all([
        Submission.find({ status: 'submitted' })
            .populate('taskId', 'title description dueDate priority')
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Submission.countDocuments({ status: 'submitted' }),
    ]);
    sendSuccess(res, 'Pending submissions fetched', { items, pagination: buildPaginationMeta(total, page, limit) });
};
export const createEvaluation = async (req, res) => {
    const { submissionId, score, strengths, weaknesses, suggestions } = req.body;
    const submission = await Submission.findById(submissionId);
    if (!submission)
        throw new AppError('Submission not found', 404);
    if (submission.status === 'evaluated')
        throw new AppError('Already evaluated', 400);
    const aiSuggestions = await generateEvaluationSuggestions(weaknesses);
    const evaluation = await Evaluation.create({
        submissionId,
        evaluatorId: req.user._id,
        studentId: submission.studentId,
        score,
        strengths,
        weaknesses,
        suggestions,
        aiSuggestions,
    });
    submission.status = 'evaluated';
    await submission.save();
    await Task.findByIdAndUpdate(submission.taskId, { status: 'completed' });
    await updateStudentMetrics(submission.studentId.toString());
    logger.info({
        event: 'evaluation_creation',
        userId: req.user._id,
        role: req.user.role,
        resourceId: evaluation._id,
    });
    await createNotification(submission.studentId.toString(), 'evaluation_submitted', `Your submission has been evaluated. Score: ${score}/100`, evaluation._id.toString());
    sendSuccess(res, 'Evaluation created', evaluation, 201);
};
export const listEvaluations = async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {};
    if (req.user.role === 'student')
        filter.studentId = req.user._id;
    if (req.query.from || req.query.to) {
        filter.createdAt = {};
        if (req.query.from)
            filter.createdAt.$gte = new Date(req.query.from);
        if (req.query.to)
            filter.createdAt.$lte = new Date(req.query.to);
    }
    const [items, total] = await Promise.all([
        Evaluation.find(filter)
            .populate('evaluatorId', 'name')
            .populate({ path: 'submissionId', populate: { path: 'taskId', select: 'title' } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Evaluation.countDocuments(filter),
    ]);
    sendSuccess(res, 'Evaluations fetched', { items, pagination: buildPaginationMeta(total, page, limit) });
};
export const getStudentEvaluations = async (req, res) => {
    const evaluations = await Evaluation.find({ studentId: req.user._id })
        .populate('evaluatorId', 'name')
        .populate({ path: 'submissionId', populate: { path: 'taskId', select: 'title' } })
        .sort({ createdAt: -1 });
    sendSuccess(res, 'Evaluation history fetched', evaluations);
};
