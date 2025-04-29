
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Pages
import HomePage from "@/pages/HomePage";
import SkillTreePage from "@/pages/SkillTreePage";
import MissionPage from "@/pages/MissionPage";
import ProfilePage from "@/pages/ProfilePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import SettingsPage from "@/pages/SettingsPage";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminSkillTracksPage from "@/pages/admin/SkillTracksPage";
import AdminMissionsPage from "@/pages/admin/MissionsPage";
import AdminQuestionBankPage from "@/pages/admin/QuestionBankPage";
import AdminBadgesPage from "@/pages/admin/BadgesPage";
import AdminUsersPage from "@/pages/admin/UsersPage";
import AdminReportsPage from "@/pages/admin/ReportsPage";
import AdminSettingsPage from "@/pages/admin/SettingsPage";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

// Other pages
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  const { user, userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      
      {/* User routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<HomePage />} />
        <Route path="/skill-tree" element={<SkillTreePage />} />
        <Route path="/mission/:id" element={<MissionPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="skill-tracks" element={<AdminSkillTracksPage />} />
        <Route path="missions" element={<AdminMissionsPage />} />
        <Route path="question-bank" element={<AdminQuestionBankPage />} />
        <Route path="badges" element={<AdminBadgesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="questify-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
