import React from 'react';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Truck,
  CheckCircle2,
  Users,
  Building2,
  Scale,
  BrainCircuit,
  Coins,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { MOCK_PRODUCTS, MOCK_FAIR_PRICE_ASSESSMENTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedProduct } from '../../utils/productLocalization';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { switchRole } = useAuth();
  const { formatCurrency } = useApp();
  const { language, t } = useLanguage();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-emerald-100/60 via-teal-50/30 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart India Hackathon 2026 • Problem SIH26033</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-heading leading-[1.15]">
            Direct Farmer-to-Buyer Market{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              Without Middlemen
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            "From Farm to Buyer, Without Unnecessary Middlemen."
            Directly connect agricultural producers with retail and institutional buyers with AI fair price discovery,
            transparent escrow, and verified cold-chain logistics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => onNavigate('/marketplace')}
              className="w-full sm:w-auto shadow-md"
            >
              Explore Produce Marketplace
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={TrendingUp}
              onClick={() => onNavigate('/fair-price')}
              className="w-full sm:w-auto"
            >
              Fair Price Engine (MSP + Mandi)
            </Button>
          </div>

          {/* Core concept visual chain */}
          <div className="pt-6">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs max-w-2xl mx-auto">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Direct Value Chain Disintermediation
              </p>
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <span>1. Farmer</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+24% Income</span>
                </div>

                <ChevronRight className="w-5 h-5 text-emerald-500 shrink-0" />

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-xs">
                    <Scale className="w-5 h-5" />
                  </div>
                  <span className="text-emerald-800 font-bold">FarmDirect</span>
                  <span className="text-[10px] text-slate-400">0% Middleman cut</span>
                </div>

                <ChevronRight className="w-5 h-5 text-emerald-500 shrink-0" />

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-1">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span>2. Retailer / Inst.</span>
                  <span className="text-[10px] text-sky-600 font-bold">-16% Sourcing Cost</span>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-1">
                    <Users className="w-5 h-5" />
                  </div>
                  <span>3. Consumer</span>
                  <span className="text-[10px] text-slate-400">Fresh Produce</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Ticker & Platform Impact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card padding="md" className="border-emerald-100 bg-emerald-50/30">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Middlemen Commission Saved
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading mt-1">
              ₹1.84 Cr
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Directly diverted to farmer wallets
            </p>
          </Card>

          <Card padding="md" className="border-sky-100 bg-sky-50/30">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Verified Producers & FPOs
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-800 font-heading mt-1">
              1,420+
            </p>
            <p className="text-xs text-sky-600 font-medium mt-1">
              Across 8 agricultural states
            </p>
          </Card>

          <Card padding="md" className="border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Farmer Profit Boost
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
              +27.8%
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Over traditional APMC Mandi rates
            </p>
          </Card>

          <Card padding="md" className="border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Produce Traded
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
              2,840 Tons
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              With 100% Escrow Protection
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Live Marketplace Produce */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <Badge variant="emerald" size="sm" className="mb-2">
              Verified Farm-Gate Lots
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Current Available Harvests
            </h2>
            <p className="text-sm text-slate-500">
              Procure directly from verified agricultural producers with transparent grade certifications.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => onNavigate('/marketplace')}
          >
            View All Harvests
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.slice(0, 3).map((product) => {
            const loc = getLocalizedProduct(product, language);
            return (
              <Card
                key={product.id}
                padding="none"
                className="overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.images[0]}
                      alt={loc.cropName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <Badge variant="neutral" size="sm" className="bg-white/90 backdrop-blur-xs font-semibold">
                        {loc.grade}
                      </Badge>
                      {product.isOrganic && (
                        <Badge variant="success" size="sm" className="bg-emerald-900/80 text-white">
                          {loc.organicBadge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {loc.cropName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {loc.variety}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                        {loc.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        By {product.farmerName} • {loc.location}
                      </p>
                    </div>

                    {/* Price Comparison Block */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">{t('market.farmdirect_price', 'FarmDirect Rate')}</p>
                        <p className="text-lg font-bold text-emerald-700">
                          {formatCurrency(product.pricePerKg)}
                          <span className="text-xs text-slate-500 font-normal">{loc.unitPriceLabel}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-400 font-medium">{t('market.mandi_rate', 'Mandi Benchmark')}</p>
                        <p className="text-sm font-semibold text-slate-500 line-through">
                          {formatCurrency(product.mandiBenchmarkPricePerKg)}{loc.unitPriceLabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>{t('market.stock_available', 'Available:')} {loc.quantityAvailable}</span>
                      <span>{t('market.min_order', 'Min:')} {loc.minimumOrder}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    variant="primary"
                    className="w-full"
                    size="sm"
                    onClick={() => onNavigate('/marketplace')}
                  >
                    {t('market.procure_btn', 'View & Procure')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-emerald-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <Badge variant="emerald" size="sm">Zero Intermediary Architecture</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
            How FarmDirect Solves SIH26033
          </h2>
          <p className="text-emerald-200 text-sm sm:text-base">
            Eliminating traditional multi-layered APMC commission agents through decentralized digital trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-emerald-900/60 border border-emerald-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-white">
              01
            </div>
            <h3 className="font-bold text-base text-white">Direct Crop Listing</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Farmer logs harvest quantity, variety, photos, and quality grade directly with geolocation tagging.
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-white">
              02
            </div>
            <h3 className="font-bold text-base text-white">Fair Price Discovery</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              AI Price Engine balances MSP price floor and mandi arrival spikes, recommending mutually profitable rates.
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-white">
              03
            </div>
            <h3 className="font-bold text-base text-white">Smart Escrow Lock</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Buyer deposits 100% order payment into secure escrow before farm pickup, preventing payment defaults.
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-white">
              04
            </div>
            <h3 className="font-bold text-base text-white">Instant UPI Settlement</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Upon GPS-verified delivery and digital signoff, funds disburse instantly to the farmer's bank account.
            </p>
          </div>
        </div>
      </section>

      {/* Role Selectors & Portals CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Ready to Join the Revolution?
            </h2>
            <p className="text-sm text-slate-500">
              Select your role to access dedicated tools and dashboards designed for your specific agricultural needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              padding="lg"
              className="border-emerald-200 bg-emerald-50/30 hover:border-emerald-400 transition-all text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">For Farmers & FPOs</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  List harvest lots, compare MSP price floors, track payments, and get AI guidance on when to sell.
                </p>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  switchRole('farmer');
                  onNavigate('/farmer');
                }}
              >
                Access Farmer Portal
              </Button>
            </Card>

            <Card
              padding="lg"
              className="border-sky-200 bg-sky-50/30 hover:border-sky-400 transition-all text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center mx-auto shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">For Buyers & Retailers</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Procure bulk lots directly from certified farms with quality guarantees, live transit GPS, and escrow.
                </p>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  switchRole('buyer');
                  onNavigate('/buyer');
                }}
              >
                Access Buyer Portal
              </Button>
            </Card>

            <Card
              padding="lg"
              className="border-purple-200 bg-purple-50/30 hover:border-purple-400 transition-all text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Admin & Oversight</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Nodal officer monitoring, farmer KYC verifications, MSP price compliance, and transparent audits.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  switchRole('admin');
                  onNavigate('/admin');
                }}
              >
                Access Admin Portal
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
