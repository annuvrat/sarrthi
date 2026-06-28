import type { Request, Response } from 'express';
import type { PipelineStage } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Evaluation } from '../models/Evaluation.js';
import { Student } from '../models/Student.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { AppError, buildPaginationMeta, getPagination, sendSuccess } from '../utils/response.js';

export const createStudent = async (req: Request, res: Response) => {
  const { name, email, password, mobile, targetYear, notes, mentorId } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('Email already exists', 400);

  const passwordHash = await bcrypt.hash(password || 'student123', 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'student',
  });

  const student = await Student.create({
    userId: user._id,
    mentorId: mentorId || null,
    mobile,
    targetYear,
    notes: notes || '',
  });

  sendSuccess(
    res,
    'Student created',
    {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      profile: student,
    },
    201
  );
};

export const listStudents = async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query as Record<string, unknown>);
  const status = req.query.status as string | undefined;
  const mentorId = req.query.mentorId as string | undefined;
  const search = req.query.search as string | undefined;

  const pipeline: PipelineStage[] = [
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
  ];

  const match: Record<string, unknown> = {};
  if (status) match.performanceStatus = status;
  if (mentorId) match.mentorId = mentorId;
  if (search) {
    match.$or = [
      { 'user.name': { $regex: search, $options: 'i' } },
      { 'user.email': { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
    ];
  }
  if (Object.keys(match).length) pipeline.push({ $match: match });

  const countPipeline = [...pipeline, { $count: 'total' }];
  pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });

  const [items, countResult] = await Promise.all([
    Student.aggregate(pipeline),
    Student.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total || 0;
  sendSuccess(res, 'Students fetched', { items, pagination: buildPaginationMeta(total, page, limit) });
};

export const getStudent = async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.id).populate('userId', 'name email role').populate('mentorId', 'name email');
  if (!student) throw new AppError('Student not found', 404);
  sendSuccess(res, 'Student profile fetched', student);
};

export const updateStudent = async (req: Request, res: Response) => {
  const { notes, mentorId, attendancePct } = req.body;
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { ...(notes !== undefined && { notes }), ...(mentorId !== undefined && { mentorId }), ...(attendancePct !== undefined && { attendancePct }) },
    { new: true }
  ).populate('userId', 'name email');

  if (!student) throw new AppError('Student not found', 404);
  sendSuccess(res, 'Student updated', student);
};

export const getMentorStudents = async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query as Record<string, unknown>);
  const mentorId = req.user!._id;

  const students = await Student.find({ mentorId }).populate('userId', 'name email').skip(skip).limit(limit);
  const total = await Student.countDocuments({ mentorId });

  const items = await Promise.all(
    students.map(async (s) => {
      const studentUser = s.userId as unknown as { _id: string; name: string };
      const studentUserId = studentUser._id;
      const pendingTasks = await Task.countDocuments({ studentId: studentUserId, status: 'pending' });
      const recentEvals = await Evaluation.find({ studentId: studentUserId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('score createdAt');
      return {
        _id: s._id,
        name: studentUser.name,
        avgScore: s.avgScore,
        pendingTasks,
        performanceTrend: recentEvals.map((e) => e.score).reverse(),
        performanceStatus: s.performanceStatus,
      };
    })
  );

  sendSuccess(res, 'Mentor students fetched', { items, pagination: buildPaginationMeta(total, page, limit) });
};
