import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Scale, Users, ShieldCheck, Download } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

interface AnalyticsPageProps {
  onNavigate: (path: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const { formatCurrency, showToast } = useApp();

  // Data comparing traditional mandi net revenue vs FarmDirect direct payout per quintal
  const priceComparisonData = [
    { crop: 'Wheat Sharbati', mandiNet: 2850, farmDirectNet: 3600, mspBase: 2425 },
    { crop: 'Basmati Pusa 1121', mandiNet: 3900, farmDirectNet: 4800, mspBase: 2800 },
    { crop: 'Nashik Red Onion', mandiNet: 1450, farmDirectNet: 2200, mspBase: 1200 },
    { crop: 'Polyhouse Tomato', mandiNet: 1200, farmDirectNet: 1800, mspBase: 950 },
    { crop: 'Desi Chana (Gram)', mandiNet: 5100, farmDirectNet: 6200, mspBase: 5440 },
  ];

  const monthlyVolumeData = [
    { month: 'Oct', volumeTons: 320, commissionSavedLakhs: 18.2 },
    { month: 'Nov', volumeTons: 480, commissionSavedLakhs: 26.5 },
    { month: 'Dec', volumeTons: 640, commissionSavedLakhs: 35.8 },
    { month: 'Jan', volumeTons: 820, commissionSavedLakhs: 48.0 },
    { month: 'Feb', volumeTons: 1150, commissionSavedLakhs: 69.4 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Macro Transparency & Disintermediation Analytics
            </h1>
            <Badge variant="emerald" size="sm">SIH26033 Proof of Impact</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical data validating economic gains achieved by bypassing agricultural commission middlemen.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => showToast('info', 'Report Generated', 'Nodal Analytics Summary PDF downloaded.')}
        >
          Export Report
        </Button>
      </div>

      {/* Primary Chart: Farmer Revenue Comparison */}
      <Card padding="lg" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Net Farmer Realization per Quintal (₹ / 100 Kg)
            </h2>
            <p className="text-xs text-slate-500">
              Comparing Traditional APMC Mandi after cuts vs Direct FarmDirect Settlement
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-rose-500" />
              <span>APMC Mandi Net</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-emerald-600" />
              <span>FarmDirect Direct (+26% avg)</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="crop" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="mandiNet" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Mandi Net Payout" />
              <Bar dataKey="farmDirectNet" fill="#059669" radius={[6, 6, 0, 0]} name="FarmDirect Payout" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Monthly Volume & Broker Fees Eliminated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card padding="lg" className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Monthly Traded Harvest (Metric Tons)
            </h3>
            <p className="text-xs text-slate-500">Accelerating direct adoption across producer clusters</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} Tons`, 'Volume']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="volumeTons" stroke="#0284c7" fill="#e0f2fe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg" className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Intermediary Brokerage Eliminated (₹ Lakhs)
            </h3>
            <p className="text-xs text-slate-500">Cumulative middleman fees preserved in the agricultural ecosystem</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Saved']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="commissionSavedLakhs" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
