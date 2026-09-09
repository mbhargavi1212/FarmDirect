import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
// Public Layout
import { PublicNavbar } from './components/layout/PublicNavbar';
import { PublicFooter } from './components/layout/PublicFooter';
// Role Layouts
import { FarmerLayout } from './components/layout/FarmerLayout';
import { BuyerLayout } from './components/layout/BuyerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { MarketplacePage } from './pages/public/MarketplacePage';
// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FarmerProducts } from './pages/farmer/FarmerProducts';
import { FarmerOrders } from './pages/farmer/FarmerOrders';
// Buyer Pages
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { BuyerOrders } from './pages/buyer/BuyerOrders';
// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
// Shared Architectural Pages
import { FairPriceEnginePage } from './pages/shared/FairPriceEnginePage';
import { LogisticsPage } from './pages/shared/LogisticsPage';
import { AIDemandPage } from './pages/shared/AIDemandPage';
import { AnalyticsPage } from './pages/shared/AnalyticsPage';
import { PaymentsEscrowPage } from './pages/shared/PaymentsEscrowPage';
import { ProfilePage } from './pages/shared/ProfilePage';
// Protected Route Guard
import { ProtectedRoute } from './components/auth/ProtectedRoute';
const MainRouter = () => {
    const { role, isAuthenticated } = useAuth();
    // Initialize path from hash or default to '/login' if not authenticated
    const getInitialPath = () => {
        const hash = window.location.hash.replace(/^#/, '');
        if (!hash || hash === '/') {
            return '/login';
        }
        return hash;
    };
    const [currentPath, setCurrentPath] = useState(getInitialPath);
    // Sync hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace(/^#/, '');
            setCurrentPath(hash || '/login');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    const navigate = (path) => {
        window.location.hash = path;
        setCurrentPath(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Redirect if logged in and visiting login/root
    useEffect(() => {
        if (isAuthenticated) {
            if (currentPath === '/' || currentPath === '/login') {
                const dest = role === 'farmer' ? '/farmer' : role === 'buyer' ? '/buyer' : '/admin';
                navigate(dest);
            }
        }
    }, [isAuthenticated, role, currentPath]);
    // Render content according to route
    const renderRoute = () => {
        // 0. Start with FarmDirect Login Page when not authenticated or on login route
        if (!isAuthenticated) {
            if (currentPath === '/register') {
                return (<div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <PublicNavbar currentPath={currentPath} onNavigate={navigate}/>
            <main className="flex-1">
              <RegisterPage onNavigate={navigate}/>
            </main>
            <PublicFooter onNavigate={navigate}/>
          </div>);
            }
            // Default start page: Dedicated FarmDirect Login Page asking Farmer vs Consumer
            return (<div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
          <main className="flex-1 flex items-center justify-center">
            <LoginPage onNavigate={navigate}/>
          </main>
          <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
            <p>FarmDirect • Smart India Hackathon 2026 (SIH26033) • Direct Farmer-to-Consumer Platform</p>
          </footer>
        </div>);
        }
        // 1. Farmer routes (Strict Role Isolation: Only Farmer sees Farmer pages)
        if (currentPath.startsWith('/farmer')) {
            return (<ProtectedRoute allowedRoles={['farmer']} onNavigate={navigate} portalName="Farmer Producer Portal">
          <FarmerLayout currentPath={currentPath} onNavigate={navigate}>
            {currentPath === '/farmer/products' ? (<FarmerProducts onNavigate={navigate}/>) : currentPath === '/farmer/orders' ? (<FarmerOrders onNavigate={navigate}/>) : currentPath === '/farmer/payments' ? (<PaymentsEscrowPage onNavigate={navigate}/>) : (<FarmerDashboard onNavigate={navigate}/>)}
          </FarmerLayout>
        </ProtectedRoute>);
        }
        // 2. Buyer routes (Strict Role Isolation: Only Consumer/Buyer sees Buyer pages)
        if (currentPath.startsWith('/buyer')) {
            return (<ProtectedRoute allowedRoles={['buyer']} onNavigate={navigate} portalName="Consumer Procurement Hub">
          <BuyerLayout currentPath={currentPath} onNavigate={navigate}>
            {currentPath === '/buyer/orders' ? (<BuyerOrders onNavigate={navigate}/>) : currentPath === '/buyer/payments' ? (<PaymentsEscrowPage onNavigate={navigate}/>) : (<MarketplacePage onNavigate={navigate}/>)}
          </BuyerLayout>
        </ProtectedRoute>);
        }
        // 3. Admin routes (Strict Role Isolation: Only Admin sees Admin pages)
        if (currentPath.startsWith('/admin')) {
            return (<ProtectedRoute allowedRoles={['admin']} onNavigate={navigate} portalName="Nodal Admin Oversight Portal">
          <AdminLayout currentPath={currentPath} onNavigate={navigate}>
            {currentPath === '/admin/transactions' ? (<PaymentsEscrowPage onNavigate={navigate}/>) : (<AdminDashboard onNavigate={navigate}/>)}
          </AdminLayout>
        </ProtectedRoute>);
        }
        // 4. Shared tool routes (Fair Price, Logistics, AI Demand, Marketplace, Analytics, Profile)
        // Wrap them in the user's specific layout so they never see the other user's environment!
        if (role === 'farmer') {
            return (<FarmerLayout currentPath={currentPath} onNavigate={navigate}>
          {currentPath === '/profile' ? (<ProfilePage onNavigate={navigate}/>) : currentPath === '/fair-price' ? (<FairPriceEnginePage onNavigate={navigate}/>) : currentPath === '/ai-demand' ? (<AIDemandPage onNavigate={navigate}/>) : currentPath === '/logistics' ? (<LogisticsPage onNavigate={navigate}/>) : currentPath === '/analytics' ? (<AnalyticsPage onNavigate={navigate}/>) : currentPath === '/marketplace' ? (<MarketplacePage onNavigate={navigate}/>) : (<FarmerDashboard onNavigate={navigate}/>)}
        </FarmerLayout>);
        }
        if (role === 'buyer') {
            return (<BuyerLayout currentPath={currentPath} onNavigate={navigate}>
          {currentPath === '/profile' ? (<ProfilePage onNavigate={navigate}/>) : currentPath === '/logistics' ? (<LogisticsPage onNavigate={navigate}/>) : (<MarketplacePage onNavigate={navigate}/>)}
        </BuyerLayout>);
        }
        if (role === 'admin') {
            return (<AdminLayout currentPath={currentPath} onNavigate={navigate}>
          {currentPath === '/profile' ? (<ProfilePage onNavigate={navigate}/>) : currentPath === '/marketplace' ? (<MarketplacePage onNavigate={navigate}/>) : currentPath === '/fair-price' ? (<FairPriceEnginePage onNavigate={navigate}/>) : currentPath === '/analytics' ? (<AnalyticsPage onNavigate={navigate}/>) : (<AdminDashboard onNavigate={navigate}/>)}
        </AdminLayout>);
        }
        // Fallback if none matched
        return (<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <LoginPage onNavigate={navigate}/>
      </div>);
    };
    return <>{renderRoute()}</>;
};
export default function App() {
    return (<LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <MainRouter />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>);
}
