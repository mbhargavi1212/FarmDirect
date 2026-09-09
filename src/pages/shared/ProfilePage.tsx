import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Tractor, 
  ShoppingBag, 
  Building2, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Mic, 
  Sparkles,
  ArrowRight,
  Landmark,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { VoiceAssistantModal } from '../../components/common/VoiceAssistantModal';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, role, updateProfile } = useAuth();
  const { showToast, formatCurrency } = useApp();
  const { t, language } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Form states initialized with user profile
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+91 98765 43210');
  const [village, setVillage] = useState(user?.village || 'Guntur Rural');
  const [district, setDistrict] = useState(user?.district || 'Guntur');
  const [state, setState] = useState(user?.state || 'Andhra Pradesh');
  const [pincode, setPincode] = useState(user?.pincode || '522001');
  const [businessAddress, setBusinessAddress] = useState(user?.businessAddress || 'FreshMart Central Hub, Pune');

  // Farmer specific
  const [farmName, setFarmName] = useState(user?.farmDetails?.farmName || 'Sri Lakshmi Organic Farms');
  const [landAcres, setLandAcres] = useState(user?.farmDetails?.totalLandAcres || 12.5);
  const [kccNumber, setKccNumber] = useState(user?.farmDetails?.kisanCreditCardNumber || 'KCC-AP-2024-8891');
  const [mandiNearest, setMandiNearest] = useState(user?.farmDetails?.apmcMandiNearest || 'Guntur APMC Yard (Mirchi Yard)');

  // Buyer specific
  const [businessName, setBusinessName] = useState(user?.businessDetails?.businessName || 'FreshMart Retail & Wholesale Ltd');
  const [gstin, setGstin] = useState(user?.businessDetails?.gstin || '37AAAAA0000A1Z5');
  const [procurementCapacity, setProcurementCapacity] = useState(user?.businessDetails?.procurementCapacityTons || 25);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      phoneNumber,
      district,
      state,
      pincode,
      ...(role === 'buyer'
        ? {
            businessAddress,
            businessDetails: {
              ...(user?.businessDetails || {}),
              businessName,
              gstin,
              procurementCapacityTons: procurementCapacity,
            },
          }
        : {
            village,
            farmDetails: {
              ...(user?.farmDetails || {}),
              farmName,
              totalLandAcres: landAcres,
              kisanCreditCardNumber: kccNumber,
              apmcMandiNearest: mandiNearest,
            },
          }),
    });
    setIsEditing(false);
    showToast(
      'success',
      language === 'te' ? 'ప్రొఫైల్ నవీకరించబడింది' : language === 'hi' ? 'प्रोफ़ाइल अपडेट हुई' : 'Profile Updated',
      language === 'te' ? 'మీ వివరాలు భద్రపరచబడ్డాయి.' : language === 'hi' ? 'आपका विवरण सफलतापूर्वक सहेजा गया।' : 'Your profile changes have been successfully saved.'
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="relative bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-md ring-4 ring-white/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-600 border-2 border-emerald-300 text-white font-black text-3xl flex items-center justify-center shadow-md">
                {displayName.charAt(0) || 'U'}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
                  {displayName}
                </h1>
                <Badge variant="success" size="sm" dot>
                  {role === 'buyer' ? 'Verified Buyer' : t('profile.kyc_verified')}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200">
                <span className="flex items-center gap-1">
                  {role === 'farmer' ? <Tractor className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                  <span className="capitalize font-semibold">{role} Portal Account</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{district}, {state}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 pt-1">
                {role === 'buyer' ? 'FarmDirect marketplace account • Direct farmer sourcing enabled' : 'SIH26033 Verified Intermediary-Free Node • Direct Escrow Settlement Active'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {/* Audio Voice Input quick launcher */}
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all border border-white/20 cursor-pointer shadow-xs"
            >
              <Mic className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>{t('voice.audio_input')}</span>
            </button>

            <Button
              variant={isEditing ? 'outline' : 'secondary'}
              size="sm"
              icon={isEditing ? Save : Edit3}
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'bg-white text-slate-900' : ''}
            >
              {isEditing ? t('action.cancel') : t('profile.edit_profile')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Profile Details Form / View */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Personal & Contact Information */}
          <Card
            title={t('profile.personal_info')}
            subtitle={role === 'buyer' ? 'Contact and business details for marketplace orders' : 'Government ID and verified contact details'}
            headerAction={
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                {role === 'buyer' ? 'Business Verified' : 'Aadhaar Linked'}
              </span>
            }
          >
            <div className="space-y-4 pt-2">
              <Input
                label="Full Name / Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={!isEditing}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Registered Mobile"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                />
                <Input
                  label="Registered Email"
                  value={user?.email || ''}
                  disabled
                  helperText="Verified credentials"
                />
              </div>

              {role === 'buyer' && (
                <>
                  <Input
                    label="Business Address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    disabled={!isEditing}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="District"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!isEditing}
                    />
                    <Input
                      label="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <Input
                    label="Postal PIN Code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    disabled={!isEditing}
                  />
                </>
              )}

              {role === 'farmer' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <Input label="Village / Town" value={village} onChange={(e) => setVillage(e.target.value)} disabled={!isEditing} />
                    <Input label="District" value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!isEditing} />
                    <Input label="State" value={state} onChange={(e) => setState(e.target.value)} disabled={!isEditing} />
                  </div>
                  <Input label="Postal PIN Code" value={pincode} onChange={(e) => setPincode(e.target.value)} disabled={!isEditing} />
                </>
              )}

              {role === 'buyer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Buyer Type"
                    value={user?.buyerType === 'institutional' ? 'Institutional Buyer' : 'Retail Buyer'}
                    disabled
                    helperText="Account classification"
                  />
                  <Input
                    label="GSTIN"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Card 2: Role Specific Details (Farm Land vs Business Entity) */}
          {role === 'farmer' && (
            <Card
              title={t('profile.farm_info')}
              subtitle="Land survey registry & crop cultivation area"
              headerAction={
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  RoR & Geo-tagged
                </span>
              }
            >
              <div className="space-y-4 pt-2">
                <Input
                  label="Farm / Holding Name"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  disabled={!isEditing}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('profile.land_size')}
                    type="number"
                    value={landAcres}
                    onChange={(e) => setLandAcres(Number(e.target.value))}
                    disabled={!isEditing}
                    helperText="Survey registered"
                  />
                  <Input
                    label={t('profile.kcc_number')}
                    value={kccNumber}
                    onChange={(e) => setKccNumber(e.target.value)}
                    disabled={!isEditing}
                    helperText="NABARD / SBI Node"
                  />
                </div>

                <Input
                  label={t('profile.mandi_nearest')}
                  value={mandiNearest}
                  onChange={(e) => setMandiNearest(e.target.value)}
                  disabled={!isEditing}
                  helperText="Direct reference node for price benchmarking"
                />

                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-700" />
                    Organic NPOP / PGS-India Certification
                  </p>
                  <p className="text-emerald-700">
                    Certified pesticide-free cultivator. Eligible for 10-18% fair price premium on FarmDirect.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Role-specific preferences */}
        <Card
          title={role === 'buyer' ? 'Delivery & Purchase Preferences' : t('profile.bank_account')}
          subtitle={role === 'buyer' ? 'Saved details for faster marketplace checkout' : 'Direct bank-to-bank settlement node without intermediary deduction'}
          headerAction={
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" />
              {role === 'buyer' ? 'Checkout Ready' : 'NPCI / NACH Auto-Pay Active'}
            </span>
          }
        >
          {role === 'buyer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                <p className="text-xs font-bold text-sky-700 uppercase tracking-wider">Delivery Location</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{businessAddress}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Used for marketplace orders</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Preferred Produce</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{(user?.requiredProducts || ['Wheat', 'Tomatoes', 'Onions']).join(', ')}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Typical order: {user?.typicalPurchaseQuantity || `${procurementCapacity} tons / month`}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Beneficiary Bank</p>
                <p className="text-sm font-bold text-slate-800 mt-1">State Bank of India (SBI)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Agricultural Finance Branch</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Number</p>
                <p className="text-sm font-mono font-bold text-slate-800 mt-1">•••• •••• 9842</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">IFSC: SBIN0001248</p>
              </div>
            </div>
          )}
        </Card>

        {/* Save button bar if editing */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              {t('action.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
            >
              {t('profile.save_changes')}
            </Button>
          </div>
        )}
      </form>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
