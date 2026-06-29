import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants.js';
import { User } from '../models/User.js';
import { AppError, buildPaginationMeta, getPagination, sendSuccess } from '../utils/response.js';
import type { Role } from '../config/constants.js';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role: Role;
  };

  if (!ROLES.includes(role) || role === 'student') {
    throw new AppError('Invalid role for user creation', 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('Email already exists', 400);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role });

  sendSuccess(
    res,
    'User created',
    { _id: user._id, name: user.name, email: user.email, role: user.role },
    201
  );
};

export const listUsers = async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query as Record<string, unknown>);
  const role = req.query.role as string | undefined;
  const search = req.query.search as string | undefined;

  const filter: Record<string, unknown> = { role: { $ne: 'student' } };
  if (role) filter.role = role;
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const [items, total] = await Promise.all([
    User.find(filter).select('-passwordHash -refreshToken').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  sendSuccess(res, 'Users fetched', { items, pagination: buildPaginationMeta(total, page, limit) });
};
