import { Evaluation } from '../models/Evaluation.js';
import { Student } from '../models/Student.js';
import { StudyPlan } from '../models/StudyPlan.js';
import { Task } from '../models/Task.js';
import { AppError, sendSuccess } from '../utils/response.js';
import { generateStudyPlan } from '../services/aiService.js';
export const createStudyPlan = async (req, res) => {
    const studentUserId = req.user.role === 'student' ? req.user._id.toString() : req.body.studentId;
    if (!studentUserId)
        throw new AppError('Student ID required', 400);
    const student = await Student.findOne({ userId: studentUserId });
    if (!student)
        throw new AppError('Student profile not found', 404);
    const completedTasks = await Task.countDocuments({ studentId: studentUserId, status: 'completed' });
    const missedDeadlines = await Task.countDocuments({
        studentId: studentUserId,
        status: { $in: ['pending', 'submitted'] },
        dueDate: { $lt: new Date() },
    });
    const evaluations = await Evaluation.find({ studentId: studentUserId }).select('weaknesses');
    const weaknesses = evaluations.map((e) => e.weaknesses);
    const plan = await generateStudyPlan({
        avgScore: student.avgScore,
        completedTasks,
        missedDeadlines,
        weaknesses,
    });
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const studyPlan = await StudyPlan.create({ studentId: studentUserId, weekStart, plan });
    sendSuccess(res, 'Study plan generated', studyPlan, 201);
};
export const listStudyPlans = async (req, res) => {
    const studentUserId = req.user.role === 'student' ? req.user._id : req.query.studentId;
    const filter = studentUserId ? { studentId: studentUserId } : {};
    const plans = await StudyPlan.find(filter).sort({ weekStart: -1 }).limit(20);
    sendSuccess(res, 'Study plans fetched', plans);
};
