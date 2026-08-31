import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import HomePage from './pages/HomePage';
import ExhibitionListPage from './pages/ExhibitionListPage';
import CreateReservationPage from './pages/CreateReservationPage';
import MyReservationsPage from './pages/MyReservationsPage';
import ReservationDetailPage from './pages/ReservationDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminExhibitionPage from './pages/AdminExhibitionPage';
import NotFoundPage from './pages/NotFoundPage';

// Private Route Component
const PrivateRoute = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'EXHIBITION_ORGANIZER') return <Navigate to="/" replace />;
  
  return children;
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          
          <Route path="/exhibitions" element={<PrivateRoute><ExhibitionListPage /></PrivateRoute>} />
          <Route path="/reservations" element={<PrivateRoute><MyReservationsPage /></PrivateRoute>} />
          <Route path="/reservations/new" element={<PrivateRoute><CreateReservationPage /></PrivateRoute>} />
          <Route path="/reservations/:id" element={<PrivateRoute><ReservationDetailPage /></PrivateRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute requireAdmin><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/exhibitions" element={<PrivateRoute requireAdmin><AdminExhibitionPage /></PrivateRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
