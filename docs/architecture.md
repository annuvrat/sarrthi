# Architecture Document — SarrthiIAS Portal

## Folder Structure

```
sarthi-ias/
├── client/          # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── pages/   # Role-based dashboards + public readiness
│       ├── routes/  # ProtectedRoute, RoleRoute (RBAC)
│       ├── context/ # Auth + Socket notifications
│       └── services/# Axios API + Socket.io client
└── server/          # Express + TypeScript (ESM)
    └── src/
        ├── models/      # Mongoose schemas
        ├── controllers/ # Request handlers
        ├── routes/      # API route definitions
        ├── middleware/  # JWT auth, RBAC, validation
        ├── services/    # Gemini AI, analytics, notifications
        └── sockets/     # Socket.io auth + rooms
```

## Database Design

- **users** — all roles (admin, mentor, evaluator, student); credentials + refresh token
- **students** — 1:1 extension of student users (mentorId, metrics, performance status)
- **tasks** — mentor assigns to student (title, dueDate, priority, status)
- **submissions** — student text responses linked to tasks
- **evaluations** — evaluator scores + feedback + AI suggestions
- **study_plans** — Gemini-generated weekly plans (persisted)
- **notifications** — persisted + pushed via Socket.io

Relationships: User → Student (1:1), Mentor → Tasks → Submissions → Evaluation

## Authentication Design

1. Login returns JWT **access token** (15m) + **refresh token** (7d)
2. Access token sent as `Authorization: Bearer <token>`
3. Refresh endpoint rotates tokens; logout clears refresh token in DB
4. Passwords hashed with bcrypt (12 rounds)
5. **RBAC middleware** `authorize('admin', 'mentor')` on routes
6. Frontend `RoleRoute` blocks unauthorized role access to dashboards

## AI Design (Google Gemini)

- **Study Coach**: aggregates student metrics server-side → Gemini prompt → structured JSON plan → saved to `study_plans`
- **Evaluation suggestions**: post-evaluation AI tips from weaknesses
- **Readiness Analyzer**: public endpoint; formula score + Gemini recommendations
- Fallback mock responses when `GEMINI_API_KEY` missing or API fails

## Notification Design

- Socket.io on same HTTP server as Express
- Client connects with JWT in `auth.token`
- Server joins socket to room `user:{userId}`
- Events: task assigned, submission received, evaluation submitted, deadline approaching (cron)
- Notifications persisted in MongoDB; initial fetch on load, real-time via socket (no polling)
