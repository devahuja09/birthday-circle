// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import GroupPage from "./pages/GroupPage";
import LoadingSpinner from "./components/LoadingSpinner";

function ProtectedRoute({ children }) {
  const { user, userProfile, loading, isProfileComplete } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/" replace />;
  if (!isProfileComplete()) return <Navigate to="/profile-setup" replace />;
  return children;
}

function ProfileRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user, loading, isProfileComplete } = useAuth();
  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            isProfileComplete() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/profile-setup" replace />
            )
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/profile-setup"
        element={
          <ProfileRoute>
            <ProfileSetup />
          </ProfileRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-group"
        element={
          <ProtectedRoute>
            <CreateGroup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join-group"
        element={
          <ProtectedRoute>
            <JoinGroup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
