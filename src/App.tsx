import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import TestSuite from "./pages/TestSuite";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import Workflows from "./pages/Workflows";
import WorkflowCreate from "./pages/WorkflowCreate";
import Monitoring from "./pages/Monitoring";
import MonitoringHistory from "./pages/MonitoringHistory";
import Testing from "./pages/Testing";
import TestingStatus from "./pages/TestingStatus";

const queryClient = new QueryClient();

const AppWithPaymentVerification = () => {
  usePaymentVerification();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppWithPaymentVerification />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/workflows" element={
              <ProtectedRoute>
                <Workflows />
              </ProtectedRoute>
            } />
            <Route path="/workflows/create" element={
              <ProtectedRoute>
                <WorkflowCreate />
              </ProtectedRoute>
            } />
            <Route path="/monitoring" element={
              <ProtectedRoute>
                <Monitoring />
              </ProtectedRoute>
            } />
            <Route path="/monitoring/history" element={
              <ProtectedRoute>
                <MonitoringHistory />
              </ProtectedRoute>
            } />
            <Route path="/testing" element={
              <ProtectedRoute>
                <Testing />
              </ProtectedRoute>
            } />
            <Route path="/testing/status" element={
              <ProtectedRoute>
                <TestingStatus />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            } />
            <Route path="/test-suite" element={
              <ProtectedRoute>
                <TestSuite />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
