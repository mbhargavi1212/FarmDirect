import React, { useState } from 'react';
import { 
  Sprout, 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShoppingBag, 
  Tractor,
  ShieldCheck,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { UserRole, BuyerType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

type MainRoleChoice = 'farmer' | 'consumer' | 'admin';

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, switchRole } = useAuth();
  const { showToast } = useApp();
  const { t, language } = useLanguage();

  // Primary choice between 'farmer' or 'consumer' (default is 'farmer' as primary producer)
  const [selectedRole, setSelectedRole] = useState<MainRoleChoice>('farmer');
  const [email, setEmail] = useState('ramesh.farmer@farmdirect.in');
  const [password, setPassword] = useState('farmer123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const getRoleMeta = (roleKey: MainRoleChoice) => {
    switch (roleKey) {
      case 'farmer':
        return {
          title: t('role.farmer_title'),
          nativeBadge: language === 'te' ? 'రైతు' : language === 'hi' ? 'किसान' : 'Farmer',
          cardButton: t('login as farmer'),
          tagline: t('role.farmer_desc'),
          perk: t('login.farmer_perk'),
          email: 'ramesh.farmer@farmdirect.in',
          pass: 'farmer123',
          destination: '/farmer',
          role: 'farmer' as UserRole,
          icon: Tractor,
        };
      case 'consumer':
        return {
          title: t('role.consumer_title'),
          nativeBadge: language === 'te' ? 'వినియోగదారుడు' : language === 'hi' ? 'उपभोक्ता' : 'Consumer',
          cardButton: t('login as consumer'),
          tagline: t('role.consumer_desc'),
          perk: t('login.consumer_perk'),
          email: 'retail.buyer@freshmart.in',
          pass: 'buyer123',
          destination: '/buyer',
          role: 'buyer' as UserRole,
          buyerType: 'retail' as BuyerType,
          icon: ShoppingBag,
        };
      case 'admin':
        return {
          title: t('role.admin_title'),
          nativeBadge: language === 'te' ? 'నోడల్ అధికారి' : language === 'hi' ? 'नोडल अधिकारी' : 'Officer',
          cardButton: t('role.admin_title'),
          tagline: 'Platform oversight, farmer KYC verification, and MSP compliance audits',
          perk: 'Govt Nodal Authority',
          email: 'admin@farmdirect.gov.in',
          pass: 'admin123',
          destination: '/admin',
          role: 'admin' as UserRole,
          icon: ShieldCheck,
        };
    }
  };

  const handleRoleSelect = (roleKey: MainRoleChoice) => {
    setSelectedRole(roleKey);
    setErrorMessage(null);
    const meta = getRoleMeta(roleKey);
    setEmail(meta.email);
    setPassword(meta.pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage(
        language === 'te'
          ? 'దయచేసి మీ రిజిస్టర్డ్ ఈమెయిల్ చిరునామాను నమోదు చేయండి.'
          : language === 'hi'
          ? 'कृपया अपना पंजीकृत ईमेल पता दर्ज करें।'
          : 'Please enter your registered email address.'
      );
      return;
    }
    if (!password) {
      setErrorMessage(
        language === 'te'
          ? 'దయచేసి మీ పాస్‌వర్డ్‌ను నమోదు చేయండి.'
          : language === 'hi'
          ? 'कृपया अपना पासवर्ड दर्ज करें।'
          : 'Please enter your password.'
      );
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      showToast(
        'success',
        language === 'te'
          ? 'లాగిన్ విజయవంతమైంది'
          : language === 'hi'
          ? 'सफलतापूर्वक साइन इन हुआ'
          : 'Signed In Successfully',
        `Welcome, ${loggedUser.displayName}!`
      );

      // Strict role isolation redirect
      if (loggedUser.role === 'farmer') {
        onNavigate('/farmer');
      } else if (loggedUser.role === 'buyer') {
        onNavigate('/buyer');
      } else if (loggedUser.role === 'admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/farmer');
      }
    } catch (err: any) {
      const msg =
        err?.message ||
        (language === 'te'
          ? 'ఈ ఖాతా కోసం వివరాలు తప్పుగా ఉన్నాయి. దయచేసి మళ్ళీ ప్రయత్నించండి.'
          : language === 'hi'
          ? 'इस भूमिका के लिए क्रेडेंशियल्स अमान्य हैं। कृपया पुनः प्रयास करें।'
          : 'Invalid credentials for this role. Please check email and password.');
      setErrorMessage(msg);
      showToast(
        'error',
        language === 'te' ? 'లాగిన్ విఫలమైంది' : language === 'hi' ? 'साइन इन विफल' : 'Sign In Failed',
        msg
      );
    } finally {
      setLoading(false);
    }
  };

  const currentMeta = getRoleMeta(selectedRole);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-6 sm:py-10 bg-slate-50/70">
      <div className="max-w-2xl w-full space-y-5">
        {/* Top Language Bar */}
        <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">{t('lang.select')}:</span>
            <span className="font-bold text-emerald-800">
              {language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिंदी' : 'English'}
            </span>
          </div>
          <LanguageSelector variant="segmented" />
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('app.sih_tag')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Sign in to FarmDirect
          </h1>
        </div>

        {/* Primary Selection: Farmer or Consumer */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1 text-center">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              {t('login.select_type')}
            </h2>
          </div>

          {/* 2 Primary Choice Cards: Farmer vs Consumer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Farmer Card */}
            <div
              onClick={() => handleRoleSelect('farmer')}
              className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left ${
                selectedRole === 'farmer'
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    selectedRole === 'farmer' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <Tractor className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    selectedRole === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {language === 'te' ? 'రైతు' : language === 'hi' ? 'किसान' : 'Farmer'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    Login as Farmer
                    {selectedRole === 'farmer' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-emerald-200/50 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>{t('login.farmer_perk')}</span>
                <span className="text-[11px] underline">
                  {language === 'te' ? 'రైతుగా లాగిన్ →' : language === 'hi' ? 'किसान के रूप में लॉगिन →' : 'Login as Farmer →'}
                </span>
              </div>
            </div>

            {/* 2. Consumer Card */}
            <div
              onClick={() => handleRoleSelect('consumer')}
              className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left ${
                selectedRole === 'consumer'
                  ? 'border-sky-600 bg-sky-50/60 shadow-md ring-2 ring-sky-500/20'
                  : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50/80 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    selectedRole === 'consumer' ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-100 text-sky-800'
                  }`}>
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    selectedRole === 'consumer' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-800 border border-sky-200'
                  }`}>
                    {language === 'te' ? 'వినియోగదారుడు' : language === 'hi' ? 'उपभोक्ता' : 'Consumer'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    Login as Consumer
                    {selectedRole === 'consumer' && (
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-sky-200/50 flex items-center justify-between text-xs font-semibold text-sky-800">
                <span>{t('login.consumer_perk')}</span>
                <span className="text-[11px] underline">
                  {language === 'te' ? 'వినియోగదారుగా లాగిన్ →' : language === 'hi' ? 'उपभोक्ता के रूप में लॉगिन →' : 'Login as Consumer →'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Role Indicator */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            selectedRole === 'farmer'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : selectedRole === 'consumer'
              ? 'bg-sky-50 border-sky-200 text-sky-900'
              : 'bg-purple-50 border-purple-200 text-purple-900'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>
                {t('login.active_selection')}: <strong>{currentMeta.title} ({currentMeta.nativeBadge})</strong>
              </span>
            </div>
            <span className="text-[11px] opacity-80 hidden sm:inline">
              FarmDirect Node
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1">
                <p className="font-semibold">{t('login.notice_error')}</p>
                <p className="mt-0.5 text-rose-700 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Dedicated Sign-in Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <Input
              label={`${currentMeta.title} ${t('login.email_label')}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              helperText={`Demo: ${currentMeta.email}`}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {t('login.password_label')}
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  {t('action.forgotPassword')}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Demo password: <span className="font-mono text-slate-600">{currentMeta.pass}</span>
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className={`w-full text-sm font-semibold py-3 ${
                selectedRole === 'consumer' ? 'bg-sky-600 hover:bg-sky-700' : ''
              }`}
              isLoading={loading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Footer Navigation & Registration Link */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
            <div>
              {t('login.no_account')}{' '}
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Register
              </button>
            </div>

            {/* Discreet Admin Switcher */}
            {selectedRole !== 'admin' ? (
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className="text-[11px] text-slate-400 hover:text-purple-700 underline cursor-pointer"
              >
                Login as Admin
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRoleSelect('farmer')}
                className="text-[11px] text-emerald-700 font-medium underline cursor-pointer"
              >
                Back to Farmer / Consumer Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
        onSuccess={(resetEmail) => {
          setEmail(resetEmail);
          showToast(
            'success',
            'Password Updated',
            'Your password has been changed successfully. You can now sign in.'
          );
        }}
      />
    </div>
  );
};
