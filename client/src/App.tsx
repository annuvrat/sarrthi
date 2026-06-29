import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationWrapper } from './routes/NotificationWrapper';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import Login from './pages/Login';
import Readiness from './pages/Readiness';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminUsers from './pages/admin/Users';
import MentorStudents from './pages/mentor/Students';
import MentorTasks from './pages/mentor/Tasks';
import EvaluatorPending from './pages/evaluator/Pending';
import EvaluatorHistory from './pages/evaluator/History';
import StudentTasks from './pages/student/Tasks';
import StudentEvaluations from './pages/student/Evaluations';
import StudentStudyPlan from './pages/student/StudyPlan';

const adminNav = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/users', label: 'Users' },
];

const mentorNav = [
  { to: '/mentor', label: 'My Students' },
  { to: '/mentor/tasks', label: 'Assign Tasks' },
];

const evaluatorNav = [
  { to: '/evaluator', label: 'Pending' },
  { to: '/evaluator/history', label: 'History' },
];

const studentNav = [
  { to: '/student', label: 'My Tasks' },
  { to: '/student/evaluations', label: 'Evaluations' },
  { to: '/student/study-plan', label: 'AI Study Coach' },
];

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/readiness" element={<Readiness />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<NotificationWrapper />}>
            <Route element={<RoleRoute allowed={['admin']} />}>
              <Route path="/admin" element={<DashboardLayout title="Admin Portal" nav={adminNav} />}>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>
            <Route element={<RoleRoute allowed={['mentor']} />}>
              <Route path="/mentor" element={<DashboardLayout title="Mentor Portal" nav={mentorNav} />}>
                <Route index element={<MentorStudents />} />
                <Route path="tasks" element={<MentorTasks />} />
              </Route>
            </Route>
            <Route element={<RoleRoute allowed={['evaluator']} />}>
              <Route path="/evaluator" element={<DashboardLayout title="Evaluator Portal" nav={evaluatorNav} />}>
                <Route index element={<EvaluatorPending />} />
                <Route path="history" element={<EvaluatorHistory />} />
              </Route>
            </Route>
            <Route element={<RoleRoute allowed={['student']} />}>
              <Route path="/student" element={<DashboardLayout title="Student Portal" nav={studentNav} />}>
                <Route index element={<StudentTasks />} />
                <Route path="evaluations" element={<StudentEvaluations />} />
                <Route path="study-plan" element={<StudentStudyPlan />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
