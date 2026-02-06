import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { GuidedTourProvider, GuidedTourModal } from "@/components/onboarding/GuidedTour";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import OnboardingSetup from "./pages/OnboardingSetup";
import Dashboard from "./pages/Dashboard";
import NewLog from "./pages/NewLog";
import ReviewLog from "./pages/ReviewLog";
import TodaysPlan from "./pages/TodaysPlan";
import Reports from "./pages/Reports";
import GenerateReport from "./pages/GenerateReport";
import ViewReport from "./pages/ViewReport";
import SettingsProfile from "./pages/SettingsProfile";
import SettingsProjects from "./pages/SettingsProjects";
import NotFound from "./pages/NotFound";
 import AuditLog from "./pages/AuditLog";
 import SettingsIntegrations from "./pages/SettingsIntegrations";
 import ManagerDashboard from "./pages/ManagerDashboard";
 import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function ManagerRoute() {
  const { isManager } = useAuth();
  if (!isManager) {
    return <Navigate to="/dashboard" replace />;
  }
  return <ManagerDashboard />;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      
      {/* Onboarding */}
      <Route path="/onboarding/setup" element={
        <ProtectedRoute>
          <OnboardingSetup />
        </ProtectedRoute>
      } />

      {/* Main App Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/logs/new" element={<ProtectedRoute><NewLog /></ProtectedRoute>} />
      <Route path="/logs/:id" element={<ProtectedRoute><ReviewLog /></ProtectedRoute>} />
      <Route path="/logs/:id/review" element={<ProtectedRoute><ReviewLog /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TodaysPlan /></ProtectedRoute>} />
      <Route path="/tasks/today" element={<ProtectedRoute><TodaysPlan /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/reports/generate" element={<ProtectedRoute><GenerateReport /></ProtectedRoute>} />
      <Route path="/reports/:id" element={<ProtectedRoute><ViewReport /></ProtectedRoute>} />
      <Route path="/settings/profile" element={<ProtectedRoute><SettingsProfile /></ProtectedRoute>} />
      <Route path="/settings/projects" element={<ProtectedRoute><SettingsProjects /></ProtectedRoute>} />
       <Route path="/settings/integrations" element={<ProtectedRoute><SettingsIntegrations /></ProtectedRoute>} />
       
       {/* Phase A: Audit Log */}
       <Route path="/logs/:id/audit" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
       
       {/* Phase C: Manager Dashboard - requires manager role */}
       <Route path="/manager" element={<ProtectedRoute><ManagerRoute /></ProtectedRoute>} />
       <Route path="/manager/dashboard" element={<ProtectedRoute><ManagerRoute /></ProtectedRoute>} />
       
       {/* Phase D: Analytics */}
       <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProjectProvider>
          <TaskProvider>
            <GuidedTourProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
                <GuidedTourModal />
              </BrowserRouter>
            </GuidedTourProvider>
          </TaskProvider>
        </ProjectProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
