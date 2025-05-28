
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import StudentMarks from "./pages/student/Marks";
import StudentAttendance from "./pages/student/Attendance";
import StudentFeedback from "./pages/student/Feedback";
import StudentGraphs from "./pages/student/Graphs";
import StaffDashboard from "./pages/staff/Dashboard";
import CreateStudent from "./pages/staff/CreateStudent";
import AssignSubjects from "./pages/staff/AssignSubjects";
import AttendanceManagement from "./pages/staff/AttendanceManagement";
import EvaluateMarks from "./pages/staff/EvaluateMarks";
import GiveFeedback from "./pages/staff/GiveFeedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Protected Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/marks" element={
                <ProtectedRoute requiredRole="student">
                  <StudentMarks />
                </ProtectedRoute>
              } />
              <Route path="/student/attendance" element={
                <ProtectedRoute requiredRole="student">
                  <StudentAttendance />
                </ProtectedRoute>
              } />
              <Route path="/student/feedback" element={
                <ProtectedRoute requiredRole="student">
                  <StudentFeedback />
                </ProtectedRoute>
              } />
              <Route path="/student/graphs" element={
                <ProtectedRoute requiredRole="student">
                  <StudentGraphs />
                </ProtectedRoute>
              } />
              
              {/* Protected Staff Routes */}
              <Route path="/staff/dashboard" element={
                <ProtectedRoute requiredRole="staff">
                  <StaffDashboard />
                </ProtectedRoute>
              } />
              <Route path="/staff/create-student" element={
                <ProtectedRoute requiredRole="staff">
                  <CreateStudent />
                </ProtectedRoute>
              } />
              <Route path="/staff/assign-subjects" element={
                <ProtectedRoute requiredRole="staff">
                  <AssignSubjects />
                </ProtectedRoute>
              } />
              <Route path="/staff/attendance" element={
                <ProtectedRoute requiredRole="staff">
                  <AttendanceManagement />
                </ProtectedRoute>
              } />
              <Route path="/staff/evaluate" element={
                <ProtectedRoute requiredRole="staff">
                  <EvaluateMarks />
                </ProtectedRoute>
              } />
              <Route path="/staff/feedback" element={
                <ProtectedRoute requiredRole="staff">
                  <GiveFeedback />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
