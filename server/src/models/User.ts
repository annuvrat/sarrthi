import mongoose, { Document, Schema } from 'mongoose';
import { ROLES, type Role } from '../config/constants.js';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  refreshToken: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true },
    refreshToken: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ name: 'text' });

export const User = mongoose.model<IUser>('User', userSchema);
