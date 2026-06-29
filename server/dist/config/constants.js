export const ROLES = ['admin', 'mentor', 'evaluator', 'student'];
export const PERFORMANCE_STATUS = ['Excellent', 'Good', 'Needs Attention', 'Critical'];
export const TASK_PRIORITY = ['Low', 'Medium', 'High'];
export const TASK_STATUS = ['pending', 'submitted', 'completed', 'overdue'];
export const SUBMISSION_STATUS = ['pending', 'submitted', 'evaluated'];
export const NOTIFICATION_TYPES = [
    'task_assigned',
    'submission_received',
    'evaluation_submitted',
    'deadline_approaching',
];
export const getPerformanceStatus = (avgScore) => {
    if (avgScore >= 80)
        return 'Excellent';
    if (avgScore >= 60)
        return 'Good';
    if (avgScore >= 40)
        return 'Needs Attention';
    return 'Critical';
};
