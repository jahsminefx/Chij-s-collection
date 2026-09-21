import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';
import BrandName from '../components/common/BrandName';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-background">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-3" />
        <p className="text-xs font-semibold tracking-widest uppercase text-brand-text-muted inline-flex items-baseline gap-1">
          Authenticating <BrandName /> Portal...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
