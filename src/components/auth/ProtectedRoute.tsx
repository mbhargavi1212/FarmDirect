import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowRight, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Button } from '../common/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  onNavigate: (path: string) => void;
  portalName: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  onNavigate,
  portalName,
}) => {
  const { user, isAuthenticated, role, logout } = useAuth();

  // 1. If not authenticated, prompt user to go to FarmDirect login
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center shadow-md space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <LogIn className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Sign In to Access {portalName}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Please sign in as a verified Farmer or Consumer to access this portal. FarmDirect maintains separate, dedicated interfaces for producers and buyers.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <Button
              variant="primary"
              className="w-full text-sm py-2.5 font-semibold"
              icon={LogIn}
              onClick={() => onNavigate('/login')}
            >
              Go to FarmDirect Login
            </Button>
            <Button
              variant="outline"
              className="w-full text-sm py-2.5"
              icon={UserPlus}
              onClick={() => onNavigate('/register')}
            >
              Register New Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. If authenticated but role is not allowed in this portal (Strict Role Separation)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center shadow-md space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Restricted to {portalName}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You are currently signed in with a <strong className="capitalize text-slate-800">{role}</strong> account. To protect data privacy and maintain zero-middlemen transparency, this workspace is restricted.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <Button
              variant="primary"
              className="w-full text-sm py-2.5"
              icon={ArrowRight}
              onClick={() => onNavigate(`/${role}`)}
            >
              Return to My {role === 'farmer' ? 'Farmer' : role === 'buyer' ? 'Consumer' : 'Admin'} Portal
            </Button>
            <Button
              variant="outline"
              className="w-full text-sm py-2.5"
              icon={LogOut}
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
            >
              Sign Out & Switch User
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
