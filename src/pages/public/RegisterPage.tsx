import React, { useState } from 'react';
import { 
  Sprout, 
  Tractor, 
  ShoppingBag, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Upload, 
  Camera, 
  MapPin, 
  FileText 
} from 'lucide-react';
import { UserRole, BuyerType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

const INDIAN_STATES = [
  'Madhya Pradesh',
  'Punjab',
  'Maharashtra',
  'Uttar Pradesh',
  'Haryana',
  'Gujarat',
  'Rajasthan',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Bihar',
  'West Bengal',
  'Odisha',
];

const COMMON_CROPS = [
  'Wheat',
  'Sharbati Wheat',
  'Paddy / Rice',
  'Basmati Rice',
  'Soybean',
  'Cotton',
  'Mustard',
  'Chana (Gram)',
  'Toor Dal',
  'Sugarcane',
  'Potatoes',
  'Red Onions',
  'Tomatoes',
  'Turmeric',
  'Green Peas',
];

const COMMON_BUYER_PRODUCTS = [
  'Wheat Grain & Flour',
  'Basmati Rice',
  'Table Rice',
  'Potatoes',
  'Red Onions',
  'Tomatoes',
  'Mustard Oil / Seeds',
  'Pulses (Chana, Toor, Moong)',
  'Seasonal Fresh Vegetables',
  'Spices & Condiments',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { registerFarmer, registerBuyer } = useAuth();
  const { showToast } = useApp();

  // Primary mode: 'farmer' or 'buyer'
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer'>('farmer');

  // Common credentials
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState('Madhya Pradesh');
  const [district, setDistrict] = useState('');

  // Farmer specific fields
  const [village, setVillage] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [mainCrops, setMainCrops] = useState<string[]>(['Wheat', 'Soybean']);
  const [newCropInput, setNewCropInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);

  // Buyer specific fields
  const [buyerType, setBuyerType] = useState<BuyerType>('retail');
  const [businessAddress, setBusinessAddress] = useState('');
  const [requiredProducts, setRequiredProducts] = useState<string[]>([
    'Wheat Grain & Flour',
    'Potatoes',
    'Red Onions',
  ]);
  const [newProductInput, setNewProductInput] = useState('');
  const [typicalPurchaseQuantity, setTypicalPurchaseQuantity] = useState('500 kg - 1,500 kg / week');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toggle crop selection
  const toggleCrop = (crop: string) => {
    if (mainCrops.includes(crop)) {
      setMainCrops(mainCrops.filter((c) => c !== crop));
    } else {
      setMainCrops([...mainCrops, crop]);
    }
  };

  const addCustomCrop = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newCropInput.trim() && !mainCrops.includes(newCropInput.trim())) {
      setMainCrops([...mainCrops, newCropInput.trim()]);
      setNewCropInput('');
    }
  };

  // Toggle product selection
  const toggleProduct = (prod: string) => {
    if (requiredProducts.includes(prod)) {
      setRequiredProducts(requiredProducts.filter((p) => p !== prod));
    } else {
      setRequiredProducts([...requiredProducts, prod]);
    }
  };

  const addCustomProduct = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newProductInput.trim() && !requiredProducts.includes(newProductInput.trim())) {
      setRequiredProducts([...requiredProducts, newProductInput.trim()]);
      setNewProductInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Common validations
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (!/^\+?[0-9\s-]{10,14}$/.test(phone.replace(/\s+/g, ''))) {
      setErrorMessage('Please provide a valid 10-digit phone number.');
      return;
    }
    if (!district.trim()) {
      setErrorMessage('Please provide your district.');
      return;
    }

    setLoading(true);
    try {
      if (selectedRole === 'farmer') {
        if (!village.trim()) throw new Error('Please specify your village name.');
        if (!farmLocation.trim()) throw new Error('Please describe your farm location or landmark.');
        if (!farmSize.trim()) throw new Error('Please specify your farm size (e.g. 10 Acres).');
        if (mainCrops.length === 0) throw new Error('Please select at least one primary crop.');

        await registerFarmer({
          displayName,
          phoneNumber: phone,
          email,
          password,
          state,
          district,
          village,
          farmLocation,
          farmSize,
          mainCrops,
          avatarUrl,
        });

        showToast(
          'success',
          'Farmer Account Created',
          `Welcome ${displayName}! Your farm profile has been created in Firestore.`
        );
        // Redirect to Farmer Dashboard
        onNavigate('/farmer');
      } else {
        if (!businessAddress.trim()) throw new Error('Please provide your business or procurement address.');
        if (requiredProducts.length === 0) throw new Error('Please select at least one required produce item.');
        if (!typicalPurchaseQuantity.trim()) throw new Error('Please specify your typical purchase quantity.');

        await registerBuyer({
          displayName,
          buyerType,
          phoneNumber: phone,
          email,
          password,
          state,
          district,
          businessAddress,
          requiredProducts,
          typicalPurchaseQuantity,
          avatarUrl,
        });

        showToast(
          'success',
          'Buyer Account Created',
          `Welcome ${displayName}! Your ${buyerType === 'retail' ? 'Retail' : 'Institutional'} buyer profile is ready.`
        );
        // Redirect to Buyer Dashboard
        onNavigate('/buyer');
      }
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please review the form fields.';
      setErrorMessage(msg);
      showToast('error', 'Registration Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Card padding="lg" className="space-y-6 shadow-sm border-slate-200">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Create your FarmDirect Account
          </h2>
          <p className="text-xs text-slate-500">
            Join the direct farm-to-buyer network. Passwords are kept securely isolated from public Firestore profiles.
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Registration Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('farmer');
                setErrorMessage(null);
              }}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                selectedRole === 'farmer'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-xl ${selectedRole === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Tractor className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Farmer / Producer</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Sell farm-gate produce at 0% commission</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('buyer');
                setErrorMessage(null);
              }}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                selectedRole === 'buyer'
                  ? 'border-sky-600 bg-sky-50/70 text-sky-950 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-xl ${selectedRole === 'buyer' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Commercial Buyer</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Retail grocery or institutional bulk procurement</p>
              </div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <p className="font-semibold">Incomplete or Invalid Information</p>
              <p className="mt-0.5 text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Basic Identity & Credentials */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Basic Credentials & Contact
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={selectedRole === 'farmer' ? 'Full Name' : 'Name / Organization Name'}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder={selectedRole === 'farmer' ? 'e.g. Ramesh Patel' : 'e.g. FreshMart Supermarkets Pvt Ltd'}
              />

              <Input
                label="Phone Number (10 Digits)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="e.g. 9825144321"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. member@farmdirect.in"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password (Min 6 chars)
                </label>
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Regional Location */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. State & District Location
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                options={INDIAN_STATES.map((s) => ({ label: s, value: s }))}
              />

              <Input
                label="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                placeholder="e.g. Sehore / Pune / Karnal"
              />
            </div>
          </div>

          {/* Section 3: Role-Specific Details */}
          {selectedRole === 'farmer' ? (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>3. Farmer Land & Crop Profile</span>
                <Badge variant="success" size="sm">SIH Mandate</Badge>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Village Name"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  required
                  placeholder="e.g. Ashta"
                />

                <Input
                  label="Farm Size"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  required
                  placeholder="e.g. 12 Acres / 5 Hectares"
                />
              </div>

              <Input
                label="Farm Location / Physical Landmark"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                required
                placeholder="e.g. Survey No. 42, Near Narmada Branch Canal Road"
              />

              {/* Main Crops Multi-select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Main Crops Grown (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {COMMON_CROPS.map((crop) => {
                    const isSelected = mainCrops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {crop} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCropInput}
                    onChange={(e) => setNewCropInput(e.target.value)}
                    onKeyDown={addCustomCrop}
                    placeholder="Add other crop (e.g. Green Gram, Garlic)..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomCrop}
                  >
                    Add Crop
                  </Button>
                </div>
              </div>

              {/* Profile Image Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Farmer Profile Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-600 bg-slate-100 shrink-0">
                    <img
                      src={avatarUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1.5">Choose an avatar preset or paste an image URL:</p>
                    <div className="flex items-center gap-2">
                      {AVATAR_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(p)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border cursor-pointer ${
                            avatarUrl === p ? 'ring-2 ring-emerald-600 ring-offset-1 border-transparent' : 'border-slate-200'
                          }`}
                        >
                          <img src={p} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Buyer specifics */
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>3. Buyer Type & Procurement Needs</span>
                <Badge variant="neutral" size="sm">Procurement Hub</Badge>
              </h4>

              {/* Buyer Type: Retail vs Institutional */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Buyer Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBuyerType('retail')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      buyerType === 'retail'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mt-0.5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold">Retail Buyer</p>
                      <p className="text-[10px] text-slate-500">Supermarkets, kirana stores, fresh markets</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuyerType('institutional')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      buyerType === 'institutional'
                        ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mt-0.5 text-sky-600" />
                    <div>
                      <p className="text-xs font-bold">Institutional Buyer</p>
                      <p className="text-[10px] text-slate-500">Hotels, hospital canteens, processors, universities</p>
                    </div>
                  </button>
                </div>
              </div>

              <Input
                label="Complete Business Address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                required
                placeholder="e.g. Warehouse 14, APMC Sector 19, Vashi, Navi Mumbai"
              />

              <Input
                label="Typical Purchase Quantity"
                value={typicalPurchaseQuantity}
                onChange={(e) => setTypicalPurchaseQuantity(e.target.value)}
                required
                placeholder="e.g. 500 kg - 2,000 kg / week or 10 Metric Tons / month"
              />

              {/* Required Products */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Required Produce Commodities
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {COMMON_BUYER_PRODUCTS.map((prod) => {
                    const isSelected = requiredProducts.includes(prod);
                    return (
                      <button
                        key={prod}
                        type="button"
                        onClick={() => toggleProduct(prod)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {prod} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProductInput}
                    onChange={(e) => setNewProductInput(e.target.value)}
                    onKeyDown={addCustomProduct}
                    placeholder="Add commodity requirement..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomProduct}
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              className="w-full text-sm font-semibold py-3"
              isLoading={loading}
              icon={CheckCircle2}
            >
              Complete {selectedRole === 'farmer' ? 'Farmer' : 'Buyer'} Registration
            </Button>
          </div>
        </form>

        {/* Existing Member Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have a FarmDirect account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-emerald-600 font-bold hover:underline cursor-pointer"
          >
            Sign In with Email & Password
          </button>
        </div>
      </Card>
    </div>
  );
};
