# SarrthiIAS — Student Performance Intelligence Portal

Full-stack UPSC student performance management system built for the SarrthiIAS assignment.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript (ESM) |
| Database | MongoDB Atlas |
| Auth | JWT (access + refresh), bcrypt |
| Real-time | Socket.io |
| AI | Google Gemini |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string

### Backend
```bash
cd server
cp .env.example .env   # add MONGO_URI, JWT secrets, GEMINI_API_KEY
npm install
npm run seed           # seed demo data
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

## Demo Credentials (after seed)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sarthiias.com | password123 |
| Mentor | mentor1@sarthiias.com | password123 |
| Evaluator | evaluator1@sarthiias.com | password123 |
| Student | student1@sarthiias.com | password123 |

## Modules
1. Auth & RBAC (Admin, Mentor, Evaluator, Student)
2. Student Management
3. Mentor Task Assignment
4. Student Dashboard
5. Evaluation Module
6. Admin Analytics (3 charts)
7. AI Study Coach (Gemini)
8. Real-time Notifications (Socket.io)
9. UPSC Readiness Analyzer (public)
10. Pagination, Search, Filtering

## API
Base URL: `http://localhost:5000/api`

All responses: `{ success, message, data }`

See `postman/SarrthiIAS.postman_collection.json` for full API collection.

## Deployment
- **Frontend:** Netlify/Vercel (`client/dist`, SPA rewrites)
- **Backend:** Render/Railway
- **Database:** MongoDB Atlas
