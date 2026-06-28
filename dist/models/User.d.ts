import mongoose, { Document } from 'mongoose';
import { type Role } from '../config/constants.js';
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
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
