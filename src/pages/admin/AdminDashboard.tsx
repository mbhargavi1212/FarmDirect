import React from 'react';
import {
  ShieldCheck,
  Users,
  TrendingUp,
  Scale,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { formatCurrency, showToast } = useApp();

  const pendingFarmers = [
    {
      id: 'f-101',
      name: 'Harbhajan Singh',
      state: 'Punjab',
      district: 'Gurdaspur',
      crops: 'Pusa Basmati, Mustard',
      kcc: 'KCC-PB-88910',
      landAcres: 18.5,
    },
    {
      id: 'f-102',
      name: 'Shivaji Bhosale',
      state: 'Maharashtra',
      district: 'Nashik',
      crops: 'Onion, Grapes, Pomegranate',
      kcc: 'KCC-MH-44219',
      landAcres: 12.0,
    },
    {
      id: 'f-103',
      name: 'Annamalai Karunanidhi',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      crops: 'Samba Rice, Black Gram',
      kcc: 'KCC-TN-33104',
      landAcres: 9.5,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Nodal Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">
              Platform Governance & Nodal Oversight
            </h1>
            <Badge variant="success" size="sm">SIH26033 Active</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervising direct farmer transactions, MSP price parity, and decentralized escrow stability.
          </p>
        </div>

        <Button
          variant="primary"
          icon={TrendingUp}
          onClick={() => onNavigate('/analytics')}
        >
          View Macro Analytics
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Traded Volume (GMV)"
          value="₹9.48 Cr"
          subtext="2,840 Metric Tons produce"
          icon={Scale}
          accentColor="emerald"
        />
        <StatCard
          label="Middlemen Broker Fees Bypassed"
          value="₹1.84 Cr"
          trend={{ value: 'Saved 100%', isPositive: true }}
          subtext="Net retention by farmers"
          icon={TrendingUp}
          accentColor="emerald"
        />
        <StatCard
          label="Registered Producers & FPOs"
          value="1,420"
          subtext="18 Pending verification"
          icon={Users}
          accentColor="sky"
        />
        <StatCard
          label="Smart Escrow Health"
          value="100% Solvency"
          subtext="Zero payment default rate"
          icon={ShieldCheck}
          accentColor="indigo"
        />
      </div>

      {/* Pending Producer Verifications */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Pending Farmer KYC & Land Verification
            </h2>
            <p className="text-xs text-slate-500">
              Verify Kisan Credit Card and land holding before enabling direct listing
            </p>
          </div>
          <Badge variant="warning" size="sm">3 Pending Action</Badge>
        </div>

        <Table
          columns={[
            {
              header: 'Producer Name',
              cell: (f) => (
                <div>
                  <p className="font-bold text-slate-900">{f.name}</p>
                  <p className="text-[11px] text-slate-500">{f.district}, {f.state}</p>
                </div>
              ),
            },
            {
              header: 'KCC Record',
              cell: (f) => (
                <div className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded w-fit">
                  {f.kcc}
                </div>
              ),
            },
            {
              header: 'Land Holding',
              cell: (f) => <span className="font-semibold text-slate-800">{f.landAcres} Acres</span>,
            },
            {
              header: 'Primary Crops',
              cell: (f) => <span className="text-xs text-slate-600">{f.crops}</span>,
            },
            {
              header: 'Action',
              cell: (f) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      showToast('success', 'Producer Verified', `${f.name} approved for direct listing.`)
                    }
                  >
                    Approve KYC
                  </Button>
                </div>
              ),
            },
          ]}
          data={pendingFarmers}
          keyExtractor={(f) => f.id}
        />
      </Card>
    </div>
  );
};
