import type { Request, Response } from 'express';
import logger from '../config/logger.js';
import { Task } from '../models/Task.js';
import { AppError, buildPaginationMeta, getPagination, sendSuccess } from '../utils/response.js';
import { createNotification } from '../services/notificationService.js';

export const createTask = async (req: Request, res: Response) => {
  const { studentId, title, description, dueDate, priority } = req.body;

  const task = await Task.create({
    mentorId: req.user!._id,
    studentId,
    title,
    description,
    dueDate,
    priority: priority || 'Medium',
  });

  logger.info({
    event: 'task_assignment',
    userId: req.user!._id,
    role: req.user!.role,
    resourceId: task._id,
  });

  await createNotification(
    studentId,
    'task_assigned',
    `New task assigned: ${title}`,
    task._id.toString()
  );

  sendSuccess(res, 'Task assigned', task, 201);
};

export const listTasks = async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query as Record<string, unknown>);
  const { studentId, status, priority, search } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
  if (req.user!.role === 'mentor') filter.mentorId = req.user!._id;
  if (req.user!.role === 'student') filter.studentId = req.user!._id;
  if (studentId) filter.studentId = studentId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const [items, total] = await Promise.all([
    Task.find(filter).sort({ dueDate: 1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  sendSuccess(res, 'Tasks fetched', { items, pagination: buildPaginationMeta(total, page, limit) });
};

export const getStudentTasks = async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query as Record<string, unknown>);
  const filter = { studentId: req.user!._id };

  const [items, total] = await Promise.all([
    Task.find(filter).sort({ dueDate: 1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  sendSuccess(res, 'Student tasks fetched', { items, pagination: buildPaginationMeta(total, page, limit) });
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!task) throw new AppError('Task not found', 404);
  sendSuccess(res, 'Task updated', task);
};
