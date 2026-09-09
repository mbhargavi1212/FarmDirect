import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
export const AdminLayout = ({ children, currentPath, onNavigate, }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (<div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <DashboardSidebar role="admin" currentPath={currentPath} onNavigate={onNavigate} isOpenMobile={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)}/>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} onNavigate={onNavigate}/>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>);
};
