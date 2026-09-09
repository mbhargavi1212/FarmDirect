import React, { useState } from 'react';
import { Sprout, ArrowRight, Menu, X, UserCheck, LogOut, Mic } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { VoiceAssistantModal } from '../common/VoiceAssistantModal';
export const PublicNavbar = ({ currentPath, onNavigate }) => {
    const { role, switchRole, user, logout } = useAuth();
    const { t, language } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVoiceOpen, setIsVoiceOpen] = useState(false);
    return (<header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Platform Info Ribbon */}
      <div className="bg-emerald-900 text-emerald-100 px-4 py-1 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="bg-emerald-700/80 text-white px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
            Direct Market
          </span>
          <span className="hidden sm:inline text-emerald-200">
            Direct Farmer-to-Consumer Market Platform to Eliminate Intermediaries
          </span>
          <span className="sm:hidden text-emerald-200 truncate">
            Farm-to-Buyer Direct
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[11px] text-emerald-200">
              0% Commission • Fair APMC Rates
            </span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div onClick={() => onNavigate('/')} className="flex items-center gap-3 cursor-pointer select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
            <Sprout className="w-6 h-6"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                Farm<span className="text-emerald-600">Direct</span>
              </span>
              <Badge variant="success" size="sm">0% Commission</Badge>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              From Farm to Buyer, Without Unnecessary Middlemen
            </p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button onClick={() => onNavigate('/marketplace')} className={`hover:text-emerald-600 transition-colors ${currentPath === '/marketplace' ? 'text-emerald-600 font-semibold' : ''}`}>
            Marketplace
          </button>
          <button onClick={() => onNavigate('/fair-price')} className={`hover:text-emerald-600 transition-colors ${currentPath === '/fair-price' ? 'text-emerald-600 font-semibold' : ''}`}>
            Fair Price
          </button>
          <button onClick={() => onNavigate('/ai-demand')} className={`hover:text-emerald-600 transition-colors ${currentPath === '/ai-demand' ? 'text-emerald-600 font-semibold' : ''}`}>
            Demand Forecast
          </button>
          <button onClick={() => onNavigate('/analytics')} className={`hover:text-emerald-600 transition-colors ${currentPath === '/analytics' ? 'text-emerald-600 font-semibold' : ''}`}>
            Analytics
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Audio Input Button */}
          <button type="button" onClick={() => setIsVoiceOpen(true)} title={t('voice.audio_input')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all cursor-pointer shadow-xs">
            <Mic className="w-4 h-4 text-emerald-600 animate-pulse"/>
            <span>{t('voice.audio_input')}</span>
          </button>

          <LanguageSelector variant="compact"/>

          {user ? (<div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 pr-1">
                {user.avatarUrl ? (<img src={user.avatarUrl} alt={user.displayName} className="w-7 h-7 rounded-full object-cover border border-emerald-300 shadow-xs" referrerPolicy="no-referrer"/>) : (<div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px]">
                    {user.displayName.charAt(0)}
                  </div>)}
                <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                  {user.displayName.split(' ')[0]}
                </span>
              </div>
              <Button variant="outline" size="sm" icon={UserCheck} onClick={() => onNavigate(`/${role}`)}>
                {role.toUpperCase()} Portal
              </Button>
              <Button variant="ghost" size="sm" icon={LogOut} onClick={() => {
                logout();
                onNavigate('/login');
            }} className="text-slate-500 hover:text-rose-600">
                {t('action.signOut')}
              </Button>
            </div>) : (<>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/login')}>
                {t('action.signIn')}
              </Button>
              <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => onNavigate('/register')}>
                {t('action.register')}
              </Button>
            </>)}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button type="button" onClick={() => setIsVoiceOpen(true)} title={t('voice.audio_input')} className="p-2 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
            <Mic className="w-4 h-4 text-emerald-600 animate-pulse"/>
          </button>
          <LanguageSelector variant="compact"/>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (<div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <button onClick={() => {
                setIsVoiceOpen(true);
                setMobileMenuOpen(false);
            }} className="text-left py-2 px-3 hover:bg-emerald-50 rounded-lg flex items-center gap-2 text-emerald-800 font-semibold">
              <Mic className="w-4 h-4 text-emerald-600"/>
              <span>{t('voice.audio_input')}</span>
            </button>
            <button onClick={() => {
                onNavigate('/marketplace');
                setMobileMenuOpen(false);
            }} className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg">
              {t('action.marketplace')}
            </button>
            <button onClick={() => {
                onNavigate('/fair-price');
                setMobileMenuOpen(false);
            }} className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg">
              {t('nav.fair_price')}
            </button>
            <button onClick={() => {
                onNavigate('/ai-demand');
                setMobileMenuOpen(false);
            }} className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg">
              {t('nav.ai_demand')}
            </button>
            <button onClick={() => {
                onNavigate('/analytics');
                setMobileMenuOpen(false);
            }} className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg">
              {t('nav.spending_analytics')}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Button variant="primary" className="w-full" onClick={() => {
                onNavigate(`/${role}`);
                setMobileMenuOpen(false);
            }}>
              Open {role.toUpperCase()} Workspace
            </Button>
            <Button variant="outline" className="w-full" onClick={() => {
                onNavigate('/login');
                setMobileMenuOpen(false);
            }}>
              Login / Switch Account
            </Button>
          </div>
        </div>)}

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} onNavigate={onNavigate}/>
    </header>);
};
