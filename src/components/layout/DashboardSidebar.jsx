import React, { useState } from 'react';
import { Sprout, LayoutDashboard, ShoppingBag, Package, TrendingUp, Truck, CreditCard, BrainCircuit, Users, BarChart3, LogOut, ChevronRight, User, Mic, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceAssistantModal } from '../common/VoiceAssistantModal';
export const DashboardSidebar = ({ role, currentPath, onNavigate, isOpenMobile, onCloseMobile, }) => {
    const { user, logout } = useAuth();
    const { t, language } = useLanguage();
    const [isVoiceOpen, setIsVoiceOpen] = useState(false);
    const farmerNavItems = [
        { label: 'Dashboard', path: '/farmer', icon: LayoutDashboard },
        { label: 'Produce Listings', path: '/farmer/products', icon: Package, count: 3 },
        { label: 'Orders', path: '/farmer/orders', icon: ShoppingBag, count: 2 },
        { label: 'Fair Price', path: '/fair-price', icon: TrendingUp },
        { label: 'Demand Forecast', path: '/ai-demand', icon: BrainCircuit, isNew: true },
        { label: 'Logistics', path: '/logistics', icon: Truck },
        { label: 'Payments', path: '/farmer/payments', icon: CreditCard },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Profile', path: '/profile', icon: User },
    ];
    const buyerNavItems = [
        { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
        { label: 'Purchases', path: '/buyer/orders', icon: Package, count: 1 },
        { label: 'Delivery Tracking', path: '/logistics', icon: Truck, count: 1 },
        { label: 'Payments', path: '/buyer/payments', icon: CreditCard },
        { label: 'Profile', path: '/profile', icon: User },
    ];
    const adminNavItems = [
        { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Farmer Verification', path: '/admin/verifications', icon: Users, count: 5 },
        { label: 'Price Benchmarks', path: '/admin/price-engine', icon: TrendingUp },
        { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
        { label: 'Transaction Audits', path: '/admin/transactions', icon: CreditCard },
        { label: 'Logistics', path: '/logistics', icon: Truck },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Profile', path: '/profile', icon: User },
    ];
    const navItems = role === 'farmer'
        ? farmerNavItems
        : role === 'buyer'
            ? buyerNavItems
            : adminNavItems;
    const roleTitle = role === 'farmer'
        ? (language === 'te' ? 'రైతు పోర్టల్' : language === 'hi' ? 'किसान पोर्टल' : 'Farmer Portal')
        : role === 'buyer'
            ? (language === 'te' ? 'వినియోగదారుల కేంద్రం' : language === 'hi' ? 'उपभोक्ता केंद्र' : 'Consumer Hub')
            : (language === 'te' ? 'నోడల్ అడ్మిన్' : language === 'hi' ? 'नोडल एडमिन' : 'Nodal Admin');
    const roleColor = role === 'farmer'
        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
        : role === 'buyer'
            ? 'text-sky-700 bg-sky-50 border-sky-200'
            : 'text-purple-700 bg-purple-50 border-purple-200';
    const sidebarContent = (<div className="h-full flex flex-col justify-between bg-white border-r border-slate-200/80 w-64 select-none overflow-y-auto">
      <div>
        {/* Logo Section */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div onClick={() => onNavigate('/')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-5 h-5"/>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 font-heading">
                Farm<span className="text-emerald-600">Direct</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Direct Market Platform</p>
            </div>
          </div>
        </div>

        {/* Profile Card on Left Navigation */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div onClick={() => {
            onNavigate('/profile');
            if (onCloseMobile)
                onCloseMobile();
        }} className={`p-3 rounded-2xl border transition-all cursor-pointer group ${currentPath === '/profile'
            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
            : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-2xs'}`}>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                {user?.avatarUrl ? (<img src={user.avatarUrl} alt={user.displayName} className="w-10 h-10 rounded-xl object-cover border border-emerald-200 shadow-2xs" referrerPolicy="no-referrer"/>) : (<div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                    {user?.displayName.charAt(0) || 'U'}
                  </div>)}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white"/>
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                    {user?.displayName}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.district}, {user?.state}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                  <span>{t('profile.view_full')}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Portal Badge */}
        <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Workspace</p>
            <p className="text-xs font-bold text-slate-800">{roleTitle}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleColor}`}>
            {role.toUpperCase()}
          </span>
        </div>

        {/* Nav Links */}
        <div className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (role === 'buyer' && item.path === '/marketplace' && currentPath === '/buyer');
            const Icon = item.icon;
            return (<button key={item.path} onClick={() => {
                    onNavigate(item.path);
                    if (onCloseMobile)
                        onCloseMobile();
                }} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`}/>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.isNew && (<span className="bg-amber-400/90 text-amber-950 font-bold px-1.5 py-0.2 text-[9px] rounded-sm">
                      AI
                    </span>)}
                  {item.count !== undefined && (<span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${isActive
                        ? 'bg-emerald-700 text-emerald-100'
                        : 'bg-slate-200 text-slate-700'}`}>
                      {item.count}
                    </span>)}
                </div>
              </button>);
        })}
        </div>
      </div>

      {/* Bottom Section: Audio Input Option + Sign Out */}
      <div className="mt-auto border-t border-slate-100">
        {/* Audio Input Option on Left Navigation */}
        <div className="p-3">
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50/80 rounded-2xl border border-emerald-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Mic className="w-3.5 h-3.5 text-emerald-600 animate-pulse"/>
                <span>{t('voice.audio_input')}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-800">
                Voice AI
              </span>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-snug">
              {language === 'te'
            ? 'పంట ధరలు, మార్కెట్ లేదా ఆర్డర్ల కోసం మాట్లాడండి'
            : language === 'hi'
                ? 'मंडी भाव, फसल या ऑर्डर के लिए बोलें'
                : 'Speak in English, Telugu, or Hindi to search or navigate'}
            </p>

            <button type="button" onClick={() => setIsVoiceOpen(true)} className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer">
              <Mic className="w-3.5 h-3.5"/>
              <span>{t('voice.start_speaking')}</span>
            </button>
          </div>
        </div>

        {/* User profile footer & Sign Out in sidebar */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <div onClick={() => {
            onNavigate('/profile');
            if (onCloseMobile)
                onCloseMobile();
        }} className="flex items-center gap-2 truncate cursor-pointer hover:opacity-80">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-200">
              {user?.displayName.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.displayName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user?.role} Portal</p>
            </div>
          </div>

          <button onClick={() => {
            logout();
            onNavigate('/login');
        }} title="Sign Out" className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">
            <LogOut className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} onNavigate={(path) => {
            onNavigate(path);
            if (onCloseMobile)
                onCloseMobile();
        }}/>
    </div>);
    return (<>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpenMobile && (<div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onCloseMobile}/>
          <div className="relative z-10">{sidebarContent}</div>
        </div>)}
    </>);
};
