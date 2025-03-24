
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/layout/AppShell";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Airdrops from "@/pages/Airdrops";
import AirdropRankings from "@/pages/AirdropRankings";
import Testnets from "@/pages/Testnets";
import Tools from "@/pages/Tools";
import Videos from "@/pages/Videos";
import Learn from "@/pages/Learn";
import Explore from "@/pages/Explore";
import { AirdropsProvider } from "@/contexts/AirdropsContext";
import { ToolsProvider } from "@/contexts/ToolsContext";
import { TestnetsProvider } from "@/contexts/TestnetsContext";
import { useEffect } from "react";
import { deleteOldTestnets } from "@/utils/deleteOldTestnets";

const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // After user is authenticated, delete the old testnets 
    if (isAuthenticated && user) {
      deleteOldTestnets(user.id);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <AppShell>{children}</AppShell>;
};

// Public route that redirects to dashboard if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Get the intended destination from location state or default to dashboard
  const from = (location.state as { from?: Location })?.from?.pathname || "/dashboard";

  // If user is already authenticated, redirect to the dashboard
  if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// Main App component with all providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AirdropsProvider>
        <ToolsProvider>
          <TestnetsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </TestnetsProvider>
        </ToolsProvider>
      </AirdropsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Separated routes component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public home page */}
      <Route path="/" element={<Index />} />
      
      {/* Auth routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginForm />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <RegisterForm />
            </AuthLayout>
          </PublicRoute>
        }
      />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      
      {/* Airdrops pages */}
      <Route
        path="/airdrops"
        element={
          <ProtectedRoute>
            <Airdrops />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/airdrop-rankings"
        element={
          <ProtectedRoute>
            <AirdropRankings />
          </ProtectedRoute>
        }
      />
      
      {/* Additional routes */}
      <Route
        path="/testnets"
        element={
          <ProtectedRoute>
            <Testnets />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tools"
        element={
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <Videos />
          </ProtectedRoute>
        }
      />
      
      {/* Learn and Explore routes */}
      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <Learn />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
