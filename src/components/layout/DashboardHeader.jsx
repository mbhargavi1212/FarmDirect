import React, { useState } from 'react';
import { Menu, Bell, CheckCircle2, LogOut, Mic } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { VoiceAssistantModal } from '../common/VoiceAssistantModal';
export const DashboardHeader = ({ onToggleMobileMenu, onNavigate, }) => {
    const { user, role, switchRole, logout } = useAuth();
    const { unreadNotificationsCount, notifications, markAsRead, showToast } = useApp();
    const { t, language } = useLanguage();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const [isVoiceOpen, setIsVoiceOpen] = useState(false);
    return (<header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side: Hamburger & Title */}
        <div className="flex items-center gap-3">
          <button onClick={onToggleMobileMenu} className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5"/>
          </button>

        </div>

        {/* Right side: Audio Input, Language Selector, Active Workspace Badge, Notification, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Voice Input Button */}
          <button type="button" onClick={() => setIsVoiceOpen(true)} title={t('voice.audio_input')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs">
            <Mic className="w-4 h-4 text-emerald-600 animate-pulse"/>
            <span className="hidden sm:inline">{t('voice.audio_input')}</span>
          </button>

          {/* Language Selector Dropdown */}
          <LanguageSelector variant="compact"/>

          {/* Active Portal Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {t('badge.active_portal')}:
            </span>
            <span className={`font-bold capitalize ${role === 'farmer' ? 'text-emerald-700' : role === 'buyer' ? 'text-sky-700' : 'text-purple-700'}`}>
              {role === 'farmer'
            ? (language === 'te' ? '🌾 రైతు పోర్టల్' : language === 'hi' ? '🌾 किसान पोर्टल' : '🌾 Farmer Portal')
            : role === 'buyer'
                ? (language === 'te' ? '🛒 వినియోగదారుల కేంద్రం' : language === 'hi' ? '🛒 उपभोक्ता केंद्र' : '🛒 Consumer Hub')
                : (language === 'te' ? '🛡️ నోడల్ అడ్మిన్' : language === 'hi' ? '🛡️ नोडल एडमिन' : '🛡️ Nodal Admin')}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5"/>
              {unreadNotificationsCount > 0 && (<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"/>)}
            </button>

            {showNotifications && (<div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {unreadNotificationsCount} unread
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (<p className="py-6 text-center text-xs text-slate-400">
                      No new notifications
                    </p>) : (notifications.map((n) => (<div key={n.id} onClick={() => {
                    markAsRead(n.id);
                    if (n.actionUrl)
                        onNavigate(`/${n.actionUrl}`);
                    setShowNotifications(false);
                }} className={`p-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors ${!n.isRead ? 'bg-emerald-50/40' : ''}`}>
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400">Just now</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                      </div>)))}
                </div>
              </div>)}
          </div>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div onClick={() => onNavigate('/profile')} className="flex items-center gap-2 cursor-pointer group" title={t('profile.view_full')}>
              {user?.avatarUrl ? (<img src={user.avatarUrl} alt={user.displayName} className="w-8 h-8 rounded-full object-cover border border-emerald-300 shadow-xs group-hover:ring-2 group-hover:ring-emerald-400 transition-all" referrerPolicy="no-referrer"/>) : (<div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs group-hover:ring-2 group-hover:ring-emerald-400 transition-all">
                  {user?.displayName.charAt(0) || 'U'}
                </div>)}
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px] group-hover:text-emerald-700 transition-colors">
                  {user?.displayName}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3"/>
                  <span className="capitalize">{user?.role === 'buyer' && user?.buyerType ? `${user.buyerType} buyer` : user?.role || 'verified'}</span>
                </div>
              </div>
            </div>
            <button onClick={() => {
            logout();
            showToast('info', 'Signed Out', 'You have been logged out of FarmDirect.');
            onNavigate('/login');
        }} title="Sign Out" className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1 cursor-pointer">
              <LogOut className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} onNavigate={onNavigate}/>
    </header>);
};
