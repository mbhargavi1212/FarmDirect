import React from 'react';
import { BrainCircuit, TrendingUp, Sparkles, AlertTriangle, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { MOCK_DEMAND_PREDICTIONS } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface AIDemandPageProps {
  onNavigate: (path: string) => void;
}

export const AIDemandPage: React.FC<AIDemandPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10">
        <div className="max-w-2xl space-y-3">
          <Badge variant="emerald" size="sm">SIH26033 AI Intelligence</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            AI Demand & Price Prediction
          </h1>
          <p className="text-sm text-emerald-200/90 leading-relaxed">
            Machine learning models forecasting seasonal deficit spikes, Mandi arrival shifts, and optimal staggered harvest schedules so farmers don't get trapped in distress gluts.
          </p>
        </div>
      </div>

      {/* Demand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_DEMAND_PREDICTIONS.map((pred, idx) => (
          <Card key={idx} padding="lg" className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={pred.demandLevel === 'Surge' ? 'danger' : 'success'}
                  size="sm"
                >
                  {pred.demandLevel.toUpperCase()} DEMAND
                </Badge>
                <span className="text-xs font-bold text-emerald-700">
                  {pred.confidenceScore}% AI Confidence
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  {pred.cropName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pred.targetRegion}</span>
                </div>
              </div>

              {/* Price trajectory */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Target Horizon</p>
                  <p className="text-xs font-bold text-slate-800">{pred.forecastMonth}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Expected Rate Delta</p>
                  <p className="text-sm font-bold text-emerald-700">+{pred.expectedPriceChangePercentage}%</p>
                </div>
              </div>

              {/* Drivers */}
              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-bold text-slate-700">Key AI Market Signals:</p>
                <ul className="space-y-1 text-xs text-slate-600">
                  {pred.keyDrivers.map((driver, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
};
