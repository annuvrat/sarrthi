import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import {
  Evaluation,
  Notification,
  Student,
  StudyPlan,
  Submission,
  Task,
  User,
} from './models/index.js';

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Task.deleteMany({}),
    Submission.deleteMany({}),
    Evaluation.deleteMany({}),
    StudyPlan.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('password123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@sarthiias.com',
    passwordHash,
    role: 'admin',
  });

  const mentors = await User.insertMany([
    { name: 'Mentor One', email: 'mentor1@sarthiias.com', passwordHash, role: 'mentor' },
    { name: 'Mentor Two', email: 'mentor2@sarthiias.com', passwordHash, role: 'mentor' },
  ]);

  await User.insertMany([
    { name: 'Evaluator One', email: 'evaluator1@sarthiias.com', passwordHash, role: 'evaluator' },
    { name: 'Evaluator Two', email: 'evaluator2@sarthiias.com', passwordHash, role: 'evaluator' },
  ]);

  const studentUsers = await User.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Student ${i + 1}`,
      email: `student${i + 1}@sarthiias.com`,
      passwordHash,
      role: 'student' as const,
    }))
  );

  const students = await Student.insertMany(
    studentUsers.map((u, i) => ({
      userId: u._id,
      mentorId: mentors[i % 2]._id,
      mobile: `98765432${String(i).padStart(2, '0')}`,
      targetYear: 2026,
      notes: 'Seed student',
      attendancePct: 70 + i,
      avgScore: 40 + i * 5,
      performanceStatus: ['Critical', 'Needs Attention', 'Good', 'Excellent'][Math.min(3, Math.floor(i / 3))],
    }))
  );

  const task = await Task.create({
    mentorId: mentors[0]._id,
    studentId: studentUsers[0]._id,
    title: 'Essay on Federalism',
    description: 'Write a 250-word essay on cooperative federalism in India.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'High',
    status: 'submitted',
  });

  const submission = await Submission.create({
    taskId: task._id,
    studentId: studentUsers[0]._id,
    textResponse: 'Federalism in India is a system where power is divided...',
    status: 'submitted',
  });

  await Evaluation.create({
    submissionId: submission._id,
    evaluatorId: (await User.findOne({ role: 'evaluator' }))!._id,
    studentId: studentUsers[0]._id,
    score: 72,
    strengths: 'Good structure and relevant examples.',
    weaknesses: 'Needs more data points and conclusion.',
    suggestions: 'Add constitutional articles and recent examples.',
    aiSuggestions: 'Practice conclusion writing with timed drills.',
  });

  console.log('Seed complete!');
  console.log('Admin:', admin.email, '/ password123');
  console.log('Mentor:', mentors[0].email, '/ password123');
  console.log('Student:', studentUsers[0].email, '/ password123');
  console.log('Students created:', students.length);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
