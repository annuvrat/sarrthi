import cron from 'node-cron';
import { Task } from '../models/Task.js';
import { createNotification } from '../services/notificationService.js';
export const startDeadlineCron = () => {
    cron.schedule('0 */6 * * *', async () => {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const now = new Date();
        const tasks = await Task.find({
            status: 'pending',
            dueDate: { $gte: now, $lte: tomorrow },
        });
        for (const task of tasks) {
            await createNotification(task.studentId.toString(), 'deadline_approaching', `Deadline approaching for task: ${task.title}`, task._id.toString());
        }
    });
};
