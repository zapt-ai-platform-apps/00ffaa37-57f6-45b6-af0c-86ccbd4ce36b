import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './modules/auth/AuthProvider';
import ProtectedRoute from './modules/auth/ProtectedRoute';
import PublicRoute from './modules/auth/PublicRoute';
import LoginPage from './modules/auth/LoginPage';
import Dashboard from './modules/dashboard/Dashboard';
import PublicView from './modules/public/PublicView';
import AppDetail from './modules/apps/AppDetail';
import ZaptBadge from './shared/components/ZaptBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicRoute element={<PublicView />} />} />
            <Route path="/login" element={<PublicRoute element={<LoginPage />} restricted={true} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/apps/:id" element={<ProtectedRoute element={<AppDetail />} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ZaptBadge />
        </AuthProvider>
      </Router>
    </div>
  );
}