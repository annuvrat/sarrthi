# Performance Optimization

## MongoDB Indexes

| Collection | Index | Purpose |
|------------|-------|---------|
| users | `{ email: 1 }` unique | Login lookup |
| users | `{ role: 1, isActive: 1 }` | Admin stats |
| students | `{ mentorId: 1 }` | Mentor student list |
| students | `{ performanceStatus: 1 }` | Filter + chart |
| tasks | `{ studentId: 1, status: 1, dueDate: 1 }` | Student task list |
| tasks | `{ mentorId: 1, studentId: 1 }` | Mentor views |
| submissions | `{ status: 1, createdAt: -1 }` | Evaluator queue |
| evaluations | `{ submissionId: 1 }` unique | One eval per submission |
| evaluations | `{ createdAt: -1 }` | Score trend |
| notifications | `{ userId: 1, read: 1, createdAt: -1 }` | User inbox |
| study_plans | `{ studentId: 1, weekStart: -1 }` | Latest plan |

Text indexes on `users.name` and `tasks.title` for search.

## Pagination Strategy

- Query params: `page` (default 1), `limit` (default 20, max 100)
- Offset pagination: `.skip((page-1)*limit).limit(limit)` with indexed sort fields
- Response includes `{ items, pagination: { page, limit, total, totalPages } }`

## Query Optimization

- `.select()` to project only needed fields on list endpoints
- Denormalized `avgScore`, `performanceStatus` on students (avoid aggregation on every dashboard load)
- Admin analytics cached in memory for 5 minutes
- `$lookup` with pipeline limits for mentor student lists
- Regex search with case-insensitive index-backed fields for 10k student scale

## Scale Target

Designed for 10,000 students, 500 mentors, 100 evaluators with indexed queries and paginated list endpoints.
