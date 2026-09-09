import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { MOCK_FAIR_PRICE_ASSESSMENTS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

interface FairPriceEnginePageProps {
  onNavigate: (path: string) => void;
}

export const FairPriceEnginePage: React.FC<FairPriceEnginePageProps> = ({ onNavigate }) => {
  const { formatCurrency } = useApp();

  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);
  const [quantityQuintals, setQuantityQuintals] = useState<number>(50); // 1 Quintal = 100 Kg

  const currentCrop = MOCK_FAIR_PRICE_ASSESSMENTS[selectedCropIndex];
  const quantityKg = quantityQuintals * 100;

  // Financial calculations
  const totalMandiValue = quantityKg * currentCrop.localMandiPricePerKg;
  const totalFarmDirectValue = quantityKg * currentCrop.farmDirectRecommendedPricePerKg;

  const farmerExtraEarnings = totalFarmDirectValue - totalMandiValue;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10">
        <div className="max-w-2xl space-y-2">
          <Badge variant="emerald" size="sm">Algorithmic Disintermediation</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Fair Price Discovery Engine
          </h1>
          <p className="text-sm text-emerald-200/90 leading-relaxed">
            Eliminating broker exploitation. Our engine evaluates local Mandi arrival indices and consumer retail prices to calculate a win-win fair price band.
          </p>
        </div>
      </div>

      {/* Interactive Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Controls */}
        <Card padding="lg" className="space-y-6">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span>Fair Price Simulator</span>
          </div>

          <Select
            label="Select Produce Crop"
            value={String(selectedCropIndex)}
            onChange={(e) => setSelectedCropIndex(Number(e.target.value))}
            options={MOCK_FAIR_PRICE_ASSESSMENTS.map((c, idx) => ({
              value: String(idx),
              label: `${c.cropName} (${c.variety})`,
              subLabel: c.state,
            }))}
          />

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              <span>Quantity: {quantityQuintals} Quintals</span>
              <span className="text-emerald-700">{quantityKg.toLocaleString('en-IN')} Kg</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>10 Qtl (1,000 kg)</span>
              <span>500 Qtl (50,000 kg)</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Benchmark State:</span>
              <span className="font-semibold text-slate-800">{currentCrop.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Price Trend:</span>
              <span className="font-semibold text-emerald-600 capitalize">{currentCrop.priceTrend} (Arrivals firm)</span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => onNavigate('/marketplace')}
          >
            Explore Matching Market Lots
          </Button>
        </Card>

        {/* Right: Comparative Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Two-Rate Price Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card padding="md" className="border-slate-200 text-center space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Local Market Rate
              </p>
              <p className="text-2xl font-bold text-slate-700 font-heading">
                {formatCurrency(currentCrop.localMandiPricePerKg)}
                <span className="text-xs font-normal">/kg</span>
              </p>
              <p className="text-xs text-slate-500">
                Current local market rate
              </p>
            </Card>

            <Card padding="md" className="border-emerald-300 bg-emerald-50/50 text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase">
                Direct Win-Win
              </div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                FarmDirect Rate
              </p>
              <p className="text-3xl font-extrabold text-emerald-800 font-heading">
                {formatCurrency(currentCrop.farmDirectRecommendedPricePerKg)}
                <span className="text-xs font-normal">/kg</span>
              </p>
              <p className="text-xs text-emerald-700 font-bold">
                +{currentCrop.farmerMarginGainPercentage}% Extra for Farmer
              </p>
            </Card>
          </div>

          {/* Value Impact Breakdown for selected volume */}
          <Card padding="lg" className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Financial Impact on {quantityKg.toLocaleString('en-IN')} Kg Harvest
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Farmer Extra Realization
                </p>
                <p className="text-2xl font-bold text-emerald-800 font-heading mt-1">
                  +{formatCurrency(farmerExtraEarnings)}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Transferred straight to farmer bank without APMC middleman cuts.
                </p>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
