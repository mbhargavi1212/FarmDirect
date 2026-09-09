import React, { useState } from 'react';
import { Plus, Package, Edit, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product, QualityGrade, CropCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedProduct } from '../../utils/productLocalization';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Table } from '../../components/common/Table';

interface FarmerProductsProps {
  onNavigate: (path: string) => void;
}

export const FarmerProducts: React.FC<FarmerProductsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { formatCurrency, showToast, products, addProduct } = useApp();
  const { language, t } = useLanguage();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [cropName, setCropName] = useState('Wheat');
  const [variety, setVariety] = useState('Sharbati Lokwan');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CropCategory>('grains_cereals');
  const [grade, setGrade] = useState<QualityGrade>('Grade A (Export)');
  const [availableQuantityKg, setAvailableQuantityKg] = useState('5000');
  const [minimumOrderQuantityKg, setMinimumOrderQuantityKg] = useState('500');
  const [pricePerKg, setPricePerKg] = useState('36');
  const [isOrganic, setIsOrganic] = useState(false);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      farmerId: user?.uid || 'farmer-001',
      farmerName: user?.displayName || 'Ramesh Patel',
      farmerLocation: {
        district: user?.district || 'Sehore',
        state: user?.state || 'Madhya Pradesh',
        pincode: user?.pincode || '466001',
      },
      title: title || `${grade} ${cropName} (${variety})`,
      cropName,
      variety,
      category,
      grade,
      description: `Freshly harvested ${cropName} directly from ${user?.farmDetails?.farmName || 'our certified farm'}. Cleaned and ready for pickup.`,
      harvestDate: new Date().toISOString().split('T')[0],
      availableQuantityKg: Number(availableQuantityKg),
      minimumOrderQuantityKg: Number(minimumOrderQuantityKg),
      pricePerKg: Number(pricePerKg),
      mandiBenchmarkPricePerKg: Number(pricePerKg) * 0.82,
      mspBenchmarkPricePerKg: Number(pricePerKg) * 0.7,
      estimatedSavingsPercentage: 22,
      isOrganic,
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      ],
      shelfLifeDays: 180,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProduct(newProduct);
    showToast('success', 'Harvest Lot Listed!', `${cropName} lot is now discoverable by retailers.`);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            My Harvest Produce Listings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active lots available for direct institutional and retail contracts
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Harvest Lot
        </Button>
      </div>

      <Table<Product>
        columns={[
          {
            header: language === 'te' ? 'పంట వివరాలు' : language === 'hi' ? 'फसल विवरण' : 'Produce Item',
            cell: (p: Product) => {
              const loc = getLocalizedProduct(p, language);
              return (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={p.images[0]}
                      alt={loc.cropName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{loc.title}</p>
                    <p className="text-[11px] text-slate-500">{loc.cropName} • {loc.variety} • {loc.grade}</p>
                  </div>
                </div>
              );
            },
          },
          {
            header: language === 'te' ? 'అందుబాటులో ఉన్న నిల్వ' : language === 'hi' ? 'उपलब्ध स्टॉक' : 'Available Stock',
            cell: (p: Product) => {
              const loc = getLocalizedProduct(p, language);
              return (
                <div>
                  <p className="font-bold text-slate-900">
                    {loc.quantityAvailable}
                  </p>
                  <p className="text-[11px] text-slate-400">{t('market.min_order', 'Min:')} {loc.minimumOrder}</p>
                </div>
              );
            },
          },
          {
            header: language === 'te' ? 'ప్రత్యక్ష ధర' : language === 'hi' ? 'सीधा दाम' : 'Direct Rate',
            cell: (p: Product) => {
              const loc = getLocalizedProduct(p, language);
              return (
                <div>
                  <p className="font-bold text-emerald-700">{formatCurrency(p.pricePerKg)}{loc.unitPriceLabel}</p>
                  <p className="text-[11px] text-slate-400">Mandi: {formatCurrency(p.mandiBenchmarkPricePerKg)}{loc.unitPriceLabel}</p>
                </div>
              );
            },
          },
          {
            header: language === 'te' ? 'ధృవీకరణ' : language === 'hi' ? 'प्रमाणीकरण' : 'Certification',
            cell: (p: Product) => {
              const loc = getLocalizedProduct(p, language);
              return (
                <Badge variant={p.isOrganic ? 'success' : 'neutral'} size="sm">
                  {p.isOrganic ? (language === 'te' ? 'సేంద్రీయ' : language === 'hi' ? 'जैविक' : 'Organic') : (language === 'te' ? 'సాధారణ' : language === 'hi' ? 'सामान्य' : 'Standard')}
                </Badge>
              );
            },
          },
          {
            header: 'Status',
            cell: (p: Product) => (
              <Badge variant="emerald" size="sm" dot>
                {p.status.toUpperCase()}
              </Badge>
            ),
          },
        ]}
        data={products}
        keyExtractor={(p: Product) => p.id}
      />

      {/* Add Produce Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="List New Crop Lot"
        subtitle="Make your harvest discoverable to verified institutional buyers"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Crop Name"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              required
              placeholder="e.g. Wheat, Basmati Rice, Onion"
            />
            <Input
              label="Variety"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              required
              placeholder="e.g. Sharbati, Pusa 1121"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Quality Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value as QualityGrade)}
              options={[
                { value: 'Grade A (Export)', label: 'Grade A (Export/Premium)' },
                { value: 'Grade B (Premium)', label: 'Grade B (Standard Retail)' },
                { value: 'Grade C (Standard)', label: 'Grade C (Processing/Canteen)' },
              ]}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CropCategory)}
              options={[
                { value: 'grains_cereals', label: 'Grains & Cereals' },
                { value: 'vegetables', label: 'Vegetables' },
                { value: 'pulses', label: 'Pulses' },
                { value: 'fruits', label: 'Fruits' },
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Total Quantity (Kg)"
              type="number"
              value={availableQuantityKg}
              onChange={(e) => setAvailableQuantityKg(e.target.value)}
              required
            />
            <Input
              label="Min Order (Kg)"
              type="number"
              value={minimumOrderQuantityKg}
              onChange={(e) => setMinimumOrderQuantityKg(e.target.value)}
              required
            />
            <Input
              label="Direct Price (₹/Kg)"
              type="number"
              step="0.5"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              required
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-medium">Govt MSP Reference Benchmark:</span>
            <span className="font-bold text-emerald-800">₹24.25 / kg</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isOrganicCheck"
              checked={isOrganic}
              onChange={(e) => setIsOrganic(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isOrganicCheck" className="text-xs text-slate-700 font-medium">
              This lot is certified organic (NPOP certified)
            </label>
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              className="w-1/2"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-1/2">
              Publish Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
