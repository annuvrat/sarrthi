# Database Design

## Collections

| Collection | Purpose |
|------------|---------|
| users | Authentication, roles, refresh tokens |
| students | Student profile + performance metrics |
| tasks | Mentor-assigned work items |
| submissions | Student task responses |
| evaluations | Evaluator feedback + scores |
| study_plans | AI-generated weekly plans |
| notifications | In-app notification history |

## Relationships

- `students.userId` → `users._id` (1:1, student role only)
- `students.mentorId` → `users._id` (many students per mentor)
- `tasks.mentorId` / `tasks.studentId` → `users._id`
- `submissions.taskId` → `tasks._id`
- `evaluations.submissionId` → `submissions._id` (unique)
- `study_plans.studentId` → `users._id`
- `notifications.userId` → `users._id`

## Performance Status Logic

| Avg Score | Status |
|-----------|--------|
| ≥ 80 | Excellent |
| 60–79 | Good |
| 40–59 | Needs Attention |
| < 40 | Critical |

Updated after each evaluation (denormalized on `students` collection).
